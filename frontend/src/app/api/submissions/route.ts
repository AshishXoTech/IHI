import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_EVENT_ID } from "@/lib/mocks/teams";
import { getMockSubmissionsStore, MOCK_DEADLINE } from "@/lib/mocks/submissions";
import type { ApiResult } from "@/types/shared";

// Force mocks off by default unless USE_MOCKS=true is set in .env.local
const USE_MOCKS = process.env.USE_MOCKS === "true";

/**
 * GET /api/submissions?event_id=...&team_id=...
 */
export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get("event_id");
    const teamId = req.nextUrl.searchParams.get("team_id");

    if (USE_MOCKS) {
      const { submissions } = getMockSubmissionsStore();
      let filtered = submissions;
      if (eventId) filtered = filtered.filter((s: any) => s.event_id === eventId);
      if (teamId) filtered = filtered.filter((s: any) => s.team_id === teamId);
      return NextResponse.json({ ok: true, data: filtered } satisfies ApiResult<any[]>);
    }

    const supabase = await createClient();
    let query = supabase
      .from("submissions")
      .select("*, teams(name), ai_briefings(*)")
      .order("created_at", { ascending: false });

    if (eventId) query = query.eq("event_id", eventId);
    if (teamId) query = query.eq("team_id", teamId);

    const { data, error } = await query;
    if (error) {
      // Fallback query if relation joins are missing in initial schema
      const { data: fallback, error: fallbackError } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fallbackError) throw fallbackError;
      return NextResponse.json({ ok: true, data: fallback } satisfies ApiResult<any[]>);
    }

    return NextResponse.json({ ok: true, data } satisfies ApiResult<any[]>);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/submissions
 * Upserts a submission, enforces authoritative server deadline, and triggers AI analysis.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const title = body?.title?.trim() || body?.name?.trim() || "Untitled Project";
    const repoUrl = body?.repo_url?.trim() || null;
    const demoUrl = body?.demo_url?.trim() || null;
    const description = body?.description?.trim() || null;
    const isDraft = body?.is_draft ?? false;

    if (!repoUrl) {
      return NextResponse.json(
        { ok: false, error: "GitHub repository URL (repo_url) is required", code: "validation" } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    // ── Mock Path (explicit opt-in only) ──────────────────────
    if (USE_MOCKS) {
      const teamId = body?.team_id || "mock_team_1";
      const eventId = body?.event_id || MOCK_EVENT_ID;

      if (Date.now() >= new Date(MOCK_DEADLINE).getTime()) {
        return NextResponse.json(
          { ok: false, error: "The submission deadline has passed. Modifications are locked.", code: "forbidden" } satisfies ApiResult<never>,
          { status: 403 }
        );
      }

      const store = getMockSubmissionsStore();
      const existingIdx = store.submissions.findIndex((s: any) => s.team_id === teamId);

      const newSub = {
        id: existingIdx >= 0 ? store.submissions[existingIdx].id : `sub_${Date.now()}`,
        event_id: eventId,
        team_id: teamId,
        title,
        repo_url: repoUrl,
        demo_url: demoUrl,
        description,
        is_draft: isDraft,
        excluded_from_gallery: false,
        updated_at: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        store.submissions[existingIdx] = newSub;
      } else {
        store.setSubmissions([...store.submissions, newSub]);
      }

      return NextResponse.json({ ok: true, data: newSub } satisfies ApiResult<any>);
    }

    // ── Live Supabase Path ────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized. Please log in first.", code: "unauthorized" } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    // Auto-resolve team_id if missing
    let teamId = body?.team_id || null;
    if (!teamId) {
      const { data: member } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      teamId = member?.team_id || null;
    }

    // Auto-resolve event_id if missing
    let eventId = body?.event_id || null;
    if (!eventId && teamId) {
      const { data: teamRow } = await supabase
        .from("teams")
        .select("event_id")
        .eq("id", teamId)
        .maybeSingle();

      eventId = teamRow?.event_id || null;
    }

    if (!eventId) {
      const { data: anyEvent } = await supabase
        .from("events")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      eventId = anyEvent?.id || null;
    }

    // ── Server-Time Deadline Gate ──────────────────────────────
    if (eventId) {
      const { data: eventRow } = await supabase
        .from("events")
        .select("ends_at, status")
        .eq("id", eventId)
        .maybeSingle();

      if (eventRow) {
        const isClosedStatus =
          eventRow.status === "submission_closed" ||
          eventRow.status === "judging" ||
          eventRow.status === "results_published";
        const isPastEndsAt =
          eventRow.ends_at && Date.now() >= new Date(eventRow.ends_at).getTime();

        if (isClosedStatus || isPastEndsAt) {
          return NextResponse.json(
            { ok: false, error: "The submission deadline has passed. Modifications are locked.", code: "forbidden" } satisfies ApiResult<never>,
            { status: 403 }
          );
        }
      }
    }

    // ── Upsert Submission into Supabase ───────────────────────
    const submissionPayload = {
      event_id: eventId,
      team_id: teamId,
      title,
      repo_url: repoUrl,
      demo_url: demoUrl,
      description,
      is_draft: isDraft,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };

    let data: any = null;
    let dbError: any = null;

    if (teamId) {
      const attemptUpsert = await supabase
        .from("submissions")
        .upsert(submissionPayload, { onConflict: "team_id" })
        .select()
        .single();

      if (!attemptUpsert.error) {
        data = attemptUpsert.data;
      } else {
        dbError = attemptUpsert.error;
      }
    }

    if (!data) {
      const attemptInsert = await supabase
        .from("submissions")
        .insert(submissionPayload)
        .select()
        .single();

      if (!attemptInsert.error) {
        data = attemptInsert.data;
      } else {
        // Fallback retry without title column if table was pre-scaffolded without title
        const { title: _, ...fallbackPayload } = submissionPayload;
        const attemptFallback = await supabase
          .from("submissions")
          .insert(fallbackPayload)
          .select()
          .single();

        if (!attemptFallback.error) {
          data = attemptFallback.data;
        } else {
          return NextResponse.json(
            { ok: false, error: attemptFallback.error.message || dbError?.message || "Failed to save submission" } satisfies ApiResult<never>,
            { status: 400 }
          );
        }
      }
    }

    // ── Trigger AI Briefing Engine ────────────────────────────
    try {
      const aiBackendUrl = process.env.AI_BACKEND_URL || "http://127.0.0.1:8000";
      const aiRes = await fetch(`${aiBackendUrl}/analyze-repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: data.id,
          repo_url: repoUrl,
          project_title: title,
          project_description: description || "",
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        await supabase.from("ai_briefings").upsert(
          {
            submission_id: data.id,
            repo_url: repoUrl,
            project_summary: aiData.project_summary,
            detected_tech: aiData.detected_tech || [],
            duplicate_risk: aiData.duplicate_risk || "low",
            duplicate_details: aiData.duplicate_details || "",
            confidence_score: aiData.confidence_score || 0.90,
          },
          { onConflict: "submission_id" }
        );
      }
    } catch {
      // AI generation is non-blocking so submission succeeds even if AI service is offline
    }

    return NextResponse.json({ ok: true, data } satisfies ApiResult<any>, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}