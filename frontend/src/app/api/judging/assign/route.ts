import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { AuthError } from "@/lib/auth/errors";
import type { ApiResult, JudgeAssignment } from "@/types/shared";

const IS_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveEventId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventKey: string
) {
  let query = supabase.from("events").select("id");
  query = IS_UUID.test(eventKey)
    ? query.or(`id.eq.${eventKey},slug.eq.${eventKey}`)
    : query.eq("slug", eventKey);

  const { data } = await query.maybeSingle();
  return data?.id ?? (IS_UUID.test(eventKey) ? eventKey : null);
}

function responseError(
  error: string,
  code: "validation" | "unauthorized" | "forbidden" | "not_found" | "conflict",
  status: number
) {
  return NextResponse.json(
    { ok: false, error, code } satisfies ApiResult<never>,
    { status }
  );
}

function authResponse(err: unknown) {
  if (!(err instanceof AuthError)) return null;
  return responseError(
    err.message,
    err.code === "FORBIDDEN" ? "forbidden" : "unauthorized",
    err.status
  );
}

export async function GET(request: NextRequest) {
  try {
    await requireRole("organizer");
    const eventKey = request.nextUrl.searchParams.get("eventId");
    if (!eventKey) return responseError("eventId is required.", "validation", 400);

    const supabase = await createClient();
    const eventId = await resolveEventId(supabase, eventKey);
    if (!eventId) return responseError("Event not found.", "not_found", 404);

    const { data, error } = await supabase
      .from("judge_assignments")
      .select("id, event_id, judge_user_id, submission_id, status, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[api/judging/assign] GET failed:", error);
      return responseError("Failed to load assignments.", "conflict", 500);
    }

    return NextResponse.json(
      { ok: true, data: data ?? [] } satisfies ApiResult<JudgeAssignment[]>
    );
  } catch (err) {
    return (
      authResponse(err) ??
      responseError("Failed to load assignments.", "conflict", 500)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("organizer");
    const body = await request.json();
    const eventKey =
      typeof body?.eventId === "string" ? body.eventId.trim() : "";
    if (!eventKey) return responseError("eventId is required.", "validation", 400);

    const supabase = await createClient();
    const eventId = await resolveEventId(supabase, eventKey);
    if (!eventId) return responseError("Event not found.", "not_found", 404);

    const { data: invites, error: inviteError } = await supabase
      .from("judge_invites")
      .select("email")
      .eq("event_id", eventId)
      .neq("status", "revoked");

    if (inviteError) {
      console.error("[api/judging/assign] Invite lookup failed:", inviteError);
      return responseError("Failed to load judge invites.", "conflict", 500);
    }

    const inviteEmails = [...new Set((invites ?? []).map((i) => i.email.toLowerCase()))];
    if (inviteEmails.length === 0) {
      return responseError(
        "Invite at least one judge before auto-assign.",
        "validation",
        400
      );
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("email", inviteEmails);

    if (profileError) {
      console.error("[api/judging/assign] Judge lookup failed:", profileError);
      return responseError("Failed to find invited judge accounts.", "conflict", 500);
    }

    const judgeIds = [...new Set((profiles ?? []).map((profile) => profile.id))];
    if (judgeIds.length === 0) {
      return responseError(
        "No invited judge accounts are available yet. Judges must sign up or use their magic link first.",
        "validation",
        400
      );
    }

    const { data: submissions, error: submissionError } = await supabase
      .from("submissions")
      .select("id")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (submissionError) {
      console.error("[api/judging/assign] Submission lookup failed:", submissionError);
      return responseError("Failed to load submissions.", "conflict", 500);
    }
    if (!submissions?.length) {
      return responseError(
        "No submissions found for this event to assign.",
        "validation",
        400
      );
    }

    const { error: deleteError } = await supabase
      .from("judge_assignments")
      .delete()
      .eq("event_id", eventId);
    if (deleteError) {
      console.error("[api/judging/assign] Existing assignment cleanup failed:", deleteError);
      return responseError("Failed to replace existing assignments.", "conflict", 500);
    }

    const rows = submissions.map((submission, index) => ({
      event_id: eventId,
      submission_id: submission.id,
      judge_user_id: judgeIds[index % judgeIds.length],
      status: "assigned" as const,
    }));

    const { data: created, error: assignmentError } = await supabase
      .from("judge_assignments")
      .insert(rows)
      .select("id, event_id, judge_user_id, submission_id, status, created_at");

    if (assignmentError) {
      console.error("[api/judging/assign] Assignment insert failed:", assignmentError);
      return responseError("Failed to create assignments.", "conflict", 500);
    }

    const perJudge: Record<string, number> = {};
    for (const assignment of created ?? []) {
      perJudge[assignment.judge_user_id] =
        (perJudge[assignment.judge_user_id] || 0) + 1;
    }

    return NextResponse.json({
      ok: true,
      data: {
        assignmentCount: created?.length ?? 0,
        judgeCount: judgeIds.length,
        submissionCount: submissions.length,
        perJudge,
        assignments: created ?? [],
      },
    } satisfies ApiResult<{
      assignmentCount: number;
      judgeCount: number;
      submissionCount: number;
      perJudge: Record<string, number>;
      assignments: JudgeAssignment[];
    }>);
  } catch (err) {
    return authResponse(err) ?? responseError("Auto-assign failed.", "conflict", 500);
  }
}
