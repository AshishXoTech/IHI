import { NextResponse } from "next/server";
import { verifyMagicToken } from "@/lib/auth/magic";
import { signSession } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/cookies";
import { AUTH } from "@/lib/auth/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=MAGIC_LINK_INVALID", AUTH.APP_URL)
    );
  }

  try {
    const claims = await verifyMagicToken(token);

    // Create session JWT explicitly scoped to judge role + eventId
    const sessionToken = await signSession(
      {
        sub: `judge-${claims.email}-${claims.eventId}`,
        email: claims.email,
        role: "judge",
        eventId: claims.eventId,
        name: claims.email.split("@")[0],
      },
      AUTH.JUDGE_SESSION_TTL_SECONDS
    );

    await setSessionCookie(sessionToken, {
      ttlSeconds: AUTH.JUDGE_SESSION_TTL_SECONDS,
    });

    // Redirect directly to the judging queue for that event
    const judgeTargetUrl = new URL(
      `/judge/queue?eventId=${encodeURIComponent(claims.eventId)}`,
      AUTH.APP_URL
    );

    return NextResponse.redirect(judgeTargetUrl);
  } catch (err) {
    console.error("[api/auth/magic/verify] Verification failed:", err);
    return NextResponse.redirect(
      new URL("/login?error=MAGIC_LINK_EXPIRED", AUTH.APP_URL)
    );
  }
}