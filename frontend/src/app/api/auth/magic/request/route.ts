import { NextResponse } from "next/server";
import { magicRequestSchema } from "@/lib/auth/schemas";
import { signMagicToken, buildMagicUrl } from "@/lib/auth/magic";
import { sendJudgeMagicEmail } from "@/lib/auth/email";
import { authErr, AuthError } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = magicRequestSchema.safeParse(body);

    if (!parsed.success) {
      throw authErr.invalidEmail();
    }

    const { email, eventId } = parsed.data;

    const supabase = await createClient();

    // Verify judge is invited for this event (or dev mode bypass)
    const { data: invite } = await supabase
      .from("judge_invites")
      .select("id")
      .eq("email", email)
      .eq("event_id", eventId)
      .single();

    const { data: event } = await supabase
      .from("events")
      .select("name")
      .eq("id", eventId)
      .maybeSingle();

    const eventName = event?.name || `Hackathon #${eventId}`;

    if (!invite && process.env.NODE_ENV === "production") {
      // Security best practice: do not leak whether email is invited
      return NextResponse.json({
        success: true,
        message: "If you are registered as a judge, a magic link has been sent.",
      });
    }

    // Generate single-use magic token (15-min TTL)
    const magicToken = await signMagicToken({
      email,
      eventId,
      purpose: "judge-magic",
    });

    const magicUrl = buildMagicUrl(magicToken);

    // Send email via Resend (or log to server console in dev)
    const emailResult = await sendJudgeMagicEmail({
      to: email,
      eventName,
      url: magicUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Magic link generated successfully.",
      ...(emailResult.devUrl ? { devMagicUrl: emailResult.devUrl } : {}),
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status }
      );
    }
    console.error("[api/auth/magic/request] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}