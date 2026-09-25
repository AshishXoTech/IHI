import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "ihi_session";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "dev-insecure-secret-do-not-use-in-production-000000000";
const ISSUER = "ihi.auth";
const AUDIENCE = "ihi.app";

type Role = "participant" | "organizer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = (body.role === "organizer" ? "organizer" : "participant") as Role;

    if (!name || !email || password.length < 8) {
      return NextResponse.json(
        { error: "Name, email, and password (8+ chars) are required." },
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: `${role}_${Date.now()}`,
      email,
      role,
      name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime("7d")
      .sign(secret);

    // Role-based landing
    const redirectTo =
      role === "organizer" ? "/events/ashish01234/dashboard" : "/hackathons";

    const response = NextResponse.json({
      success: true,
      redirectUrl: redirectTo,
      user: { name, email, role },
    });

    const base = {
      path: "/",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set(COOKIE_NAME, token, { ...base, httpOnly: true });
    response.cookies.set("ihi_role", role, { ...base, httpOnly: false });
    response.cookies.set("ihi_user_email", email, { ...base, httpOnly: false });
    response.cookies.set("ihi_user_name", name, { ...base, httpOnly: false });

    return response;
  } catch {
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}