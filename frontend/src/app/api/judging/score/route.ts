import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, CriterionScoreInput, Score } from "@/types/shared";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const submissionId = req.nextUrl.searchParams.get("submissionId");
    if (!submissionId) {
      return NextResponse.json({ ok: false, error: "submissionId required" }, { status: 400 });
    }

    // 1. Fetch existing scores for this judge & submission
    const { data: scores } = await supabase
      .from("scores")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("judge_id", user.id);

    // 2. Fetch pending correction request if any
    const { data: corrections } = await supabase
      .from("correction_requests")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("judge_id", user.id)
      .eq("status", "pending");

    let formattedScore = null;
    if (scores && scores.length > 0) {
      // Map row-based scores into the unified JSON format the UI expects
      const totalScore = scores.reduce((acc, s) => acc + Number(s.score || 0), 0);
      formattedScore = {
        id: scores[0].id,
        created_at: scores[0].created_at,
        total_score: totalScore,
        criteria_scores: scores.map((s: any) => ({
          title: "Rubric Criteria",
          score: Number(s.score),
          max_score: 10,
          weight: 25,
        })),
        feedback: scores[0].feedback || "",
      };
    }

    return NextResponse.json({
      ok: true,
      data: formattedScore,
      isScored: (scores || []).length > 0,
      hasPendingCorrection: (corrections || []).length > 0,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in to submit scores.", code: "unauthorized" } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    const body = await req.json();
    const { submissionId, criteriaScores, feedback } = body;

    if (!submissionId || !Array.isArray(criteriaScores) || criteriaScores.length === 0) {
      return NextResponse.json(
        { ok: false, error: "submissionId and criteriaScores are required.", code: "validation" } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    // Immutability Check: Ensure not already scored
    const { data: existing } = await supabase
      .from("scores")
      .select("id")
      .eq("submission_id", submissionId)
      .eq("judge_id", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Submission already scored. Scores are immutable. Use Correction Request to fix mistakes." },
        { status: 400 }
      );
    }

    // Prepare array of rows to insert (one per rubric criteria)
    const scoreRows = criteriaScores.map((c: CriterionScoreInput, index: number) => {
      // Calculate weighted score for storage if needed, or store raw
      const rawScore = Number(c.score);
      return {
        submission_id: submissionId,
        judge_id: user.id,
        rubric_id: "00000000-0000-0000-0000-00000000000" + index, // Dummy UUID for fallback rubric
        score: rawScore,
        feedback: feedback || "",
      };
    });

    const { error: insertErr } = await supabase.from("scores").insert(scoreRows);

    if (insertErr) {
      return NextResponse.json(
        { ok: false, error: insertErr.message, code: "conflict" } satisfies ApiResult<never>,
        { status: 500 }
      );
    }

    // Update assignment status to completed
    await supabase
      .from("judge_assignments")
      .update({ status: "completed" })
      .eq("submission_id", submissionId)
      .eq("judge_id", user.id);

    return NextResponse.json({ ok: true, message: "Score submitted successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Internal server error submitting score.", code: "validation" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}