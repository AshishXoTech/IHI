import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use Service Role Key if present, otherwise fall back cleanly to Anon Key
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || undefined;

    const supabase = getSupabaseClient();

    // 1. Try full query with teams join
    let rows: any[] | null = null;
    let queryError: string | null = null;

    const fullQuery = await supabase
      .from("submissions")
      .select(
        `
        id,
        title,
        description,
        repo_url,
        demo_url,
        track,
        status,
        created_at,
        submitted_at,
        event_id,
        team_id,
        fields,
        teams ( id, name )
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (!fullQuery.error) {
      rows = fullQuery.data;
    } else {
      queryError = fullQuery.error.message;
      console.warn("[queue] Full query warning:", queryError);

      // 2. Fallback query without relational joins (bare columns)
      const bareQuery = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!bareQuery.error) {
        rows = bareQuery.data;
      } else {
        console.error("[queue] Bare query error:", bareQuery.error.message);
        // Return 200 with empty list so front-end gracefully renders "Queue Empty"
        return NextResponse.json({
          ok: true,
          items: [],
          count: 0,
          warning: bareQuery.error.message,
          eventId: eventId ?? null,
        });
      }
    }

    // Filter by Event ID if provided
    if (eventId && rows) {
      rows = rows.filter((r) => {
        const fields = r.fields || {};
        return (
          r.event_id === eventId ||
          fields.event_id === eventId ||
          fields.eventId === eventId ||
          String(r.event_id || "").includes(eventId)
        );
      });
    }

    // Check which submissions have already been scored
    const ids = (rows || []).map((r) => r.id).filter(Boolean);
    const scoredIds = new Set<string>();

    if (ids.length > 0) {
      for (const table of ["scores", "judge_scores", "evaluations"]) {
        const { data: scores, error } = await supabase
          .from(table)
          .select("submission_id")
          .in("submission_id", ids);

        if (!error && scores) {
          scores.forEach((s: any) => {
            if (s.submission_id) scoredIds.add(s.submission_id);
          });
          break;
        }
      }
    }

    // Format final queue response
    const items = (rows || []).map((row: any, i: number) => {
      const fields = row.fields || {};
      const teamName = Array.isArray(row.teams)
        ? row.teams[0]?.name
        : row.teams?.name;

      const isScored =
        scoredIds.has(row.id) ||
        row.status === "scored" ||
        row.is_scored === true;

      return {
        id: row.id,
        title: (
          row.title ||
          fields.title ||
          fields.project_title ||
          "UNTITLED PROJECT"
        ).toString(),
        team_name: (
          teamName ||
          fields.team_name ||
          fields.team ||
          "UNKNOWN TEAM"
        ).toString(),
        track: (row.track || fields.track || "GENERAL").toString(),
        status: isScored
          ? "scored"
          : row.status === "correction" || fields.needs_correction
          ? "correction"
          : "pending",
        priority: i + 1,
        submitted_at:
          row.submitted_at || row.created_at || new Date().toISOString(),
        created_at: row.created_at,
        repo_url: row.repo_url || fields.repo_url || fields.repo || null,
        demo_url: row.demo_url || fields.demo_url || null,
        description: row.description || fields.description || "",
        event_id: row.event_id || fields.event_id || eventId || null,
      };
    });

    return NextResponse.json({
      ok: true,
      items,
      count: items.length,
      eventId: eventId ?? null,
      warning: queryError,
    });
  } catch (e: any) {
    console.error("[api/judging/queue]", e);
    return NextResponse.json({
      ok: false,
      items: [],
      count: 0,
      error: e?.message || "Failed to load judging queue",
    });
  }
}