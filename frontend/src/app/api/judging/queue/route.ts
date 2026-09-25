import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, AssignedSubmissionItem, Score } from "@/types/shared";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Authentication required.",
          code: "unauthorized",
        } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    // ─────────────────────────────────────────────────────────
    // 1. Try explicit assignments for this judge
    // Support both column names: judge_user_id and judge_id
    // ─────────────────────────────────────────────────────────
    let assignments: any[] | null = null;

    const attemptA = await supabase
      .from("judge_assignments")
      .select("id, event_id, submission_id, status, judge_user_id, judge_id")
      .eq("judge_user_id", user.id);

    if (!attemptA.error && attemptA.data) {
      assignments = attemptA.data;
    } else {
      const attemptB = await supabase
        .from("judge_assignments")
        .select("id, event_id, submission_id, status, judge_user_id, judge_id")
        .eq("judge_id", user.id);

      if (!attemptB.error && attemptB.data) {
        assignments = attemptB.data;
      }
    }

    const hasAssignments = Boolean(assignments && assignments.length > 0);

    // ─────────────────────────────────────────────────────────
    // 2. Resolve submission IDs
    // If no assignments exist yet → DEMO FALLBACK: show ALL submissions
    // so the judge queue is never empty after a real project is submitted.
    // ─────────────────────────────────────────────────────────
    let submissionIds: string[] = [];

    if (hasAssignments) {
      submissionIds = (assignments || [])
        .map((a) => a.submission_id)
        .filter((id): id is string => Boolean(id));
    } else {
      const { data: allSubs } = await supabase
        .from("submissions")
        .select("id")
        .order("created_at", { ascending: false });

      submissionIds = (allSubs || []).map((s: any) => s.id);
    }

    if (submissionIds.length === 0) {
      return NextResponse.json({
        ok: true,
        data: [],
      } satisfies ApiResult<AssignedSubmissionItem[]>);
    }

    // ─────────────────────────────────────────────────────────
    // 3. Fetch submission details (schema-flexible)
    // ─────────────────────────────────────────────────────────
    let submissions: any[] = [];

    const subJoin = await supabase
      .from("submissions")
      .select("id, title, description, repo_url, demo_url, event_id, team_id, fields, teams(name), ai_briefings(*)")
      .in("id", submissionIds);

    if (!subJoin.error && subJoin.data) {
      submissions = subJoin.data;
    } else {
      const subPlain = await supabase
        .from("submissions")
        .select("*")
        .in("id", submissionIds);

      submissions = subPlain.data || [];
    }

    const submissionMap = new Map(
      submissions.map((s: any) => {
        const title =
          s.title ||
          s.fields?.title ||
          s.fields?.project_title ||
          "Untitled Project";

        const teamName =
          s.teams?.name ||
          s.team_name ||
          "Team";

        return [
          s.id,
          {
            project_title: title,
            team_name: teamName,
            event_id: s.event_id || null,
            repo_url: s.repo_url || null,
            description: s.description || s.fields?.description || null,
            ai_briefing: Array.isArray(s.ai_briefings)
              ? s.ai_briefings[0] || null
              : s.ai_briefings || null,
          },
        ];
      })
    );

    // ─────────────────────────────────────────────────────────
    // 4. Fetch existing scores for this judge
    // Support judge_user_id and judge_id
    // ─────────────────────────────────────────────────────────
    let scores: any[] = [];

    const scoreA = await supabase
      .from("scores")
      .select("*")
      .eq("judge_user_id", user.id)
      .in("submission_id", submissionIds);

    if (!scoreA.error && scoreA.data) {
      scores = scoreA.data;
    } else {
      const scoreB = await supabase
        .from("scores")
        .select("*")
        .eq("judge_id", user.id)
        .in("submission_id", submissionIds);

      scores = scoreB.data || [];
    }

    const scoreMap = new Map<string, Score>();
    for (const s of scores) {
      // Keep one representative score row per submission
      if (!scoreMap.has(s.submission_id)) {
        scoreMap.set(s.submission_id, s as Score);
      }
    }

    // ─────────────────────────────────────────────────────────
    // 5. Fetch pending correction requests
    // ─────────────────────────────────────────────────────────
    let corrections: any[] = [];

    const corrA = await supabase
      .from("correction_requests")
      .select("submission_id")
      .eq("judge_user_id", user.id)
      .in("status", ["pending", "pending_organizer_review"])
      .in("submission_id", submissionIds);

    if (!corrA.error && corrA.data) {
      corrections = corrA.data;
    } else {
      const corrB = await supabase
        .from("correction_requests")
        .select("submission_id")
        .eq("judge_id", user.id)
        .in("status", ["pending", "pending_organizer_review"])
        .in("submission_id", submissionIds);

      corrections = corrB.data || [];
    }

    const pendingCorrectionSet = new Set(
      (corrections || []).map((c: any) => c.submission_id)
    );

    // ─────────────────────────────────────────────────────────
    // 6. Build response items
    // ─────────────────────────────────────────────────────────
    let items: AssignedSubmissionItem[] = [];

    if (hasAssignments) {
      items = (assignments || []).map((a) => {
        const subId = a.submission_id || "";
        const subMeta = submissionMap.get(subId);
        const existingScore = scoreMap.get(subId) || null;

        return {
          assignment_id: a.id,
          submission_id: subId,
          event_id: a.event_id || subMeta?.event_id || "",
          status: (a.status as "assigned" | "in_progress" | "completed") || "assigned",
          project_title: subMeta?.project_title || "Project Handoff",
          team_name: subMeta?.team_name || "Assigned Team",
          is_scored: Boolean(existingScore),
          score: existingScore,
          has_pending_correction: pendingCorrectionSet.has(subId),
        } as AssignedSubmissionItem;
      });
    } else {
      // Demo fallback: synthesize queue items from all submissions
      items = submissionIds.map((subId, index) => {
        const subMeta = submissionMap.get(subId);
        const existingScore = scoreMap.get(subId) || null;

        return {
          assignment_id: `auto_${subId}_${index}`,
          submission_id: subId,
          event_id: subMeta?.event_id || "",
          status: existingScore ? "completed" : "assigned",
          project_title: subMeta?.project_title || "Untitled Project",
          team_name: subMeta?.team_name || "Team",
          is_scored: Boolean(existingScore),
          score: existingScore,
          has_pending_correction: pendingCorrectionSet.has(subId),
        } as AssignedSubmissionItem;
      });
    }

    // Unscored first
    items.sort((a, b) => Number(a.is_scored) - Number(b.is_scored));

    return NextResponse.json({
      ok: true,
      data: items,
    } satisfies ApiResult<AssignedSubmissionItem[]>);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to load judge queue.",
        code: "validation",
      } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}