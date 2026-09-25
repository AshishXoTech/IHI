import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/schemas";
import { verifyPassword } from "@/lib/auth/password";
import { signSession } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/cookies";
import { authErr, AuthError } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs"; // Required for bcryptjs

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw authErr.invalidCreds();
    }

    const { role, password } = parsed.data;
    // Always normalize email (lowercase & trimmed)
    const email = parsed.data.email.trim().toLowerCase();

    // Reject judge attempting password login (judges use magic links only)
    if ((role as string) === "judge") {
      throw authErr.forbidden();
    }

    const supabase = await createClient();

    // Query user record by email
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password_hash, name, role")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[api/auth/login] Supabase query error:", error);
    }

    if (!user || !user.password_hash) {
      throw authErr.invalidCreds();
    }

    // Check if role matches
    if (user.role !== role) {
      return NextResponse.json(
        { 
          error: `This account is registered as a "${user.role.toUpperCase()}". Please switch tabs to ${user.role}.`, 
          code: "ROLE_MISMATCH" 
        },
        { status: 400 }
      );
    }

    // Verify password hash
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw authErr.invalidCreds();
    }

    // Issue JWT & set httpOnly cookie
    const sessionUser = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name || user.email.split("@")[0],
    };

    const token = await signSession(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status }
      );
    }
    console.error("[api/auth/login] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}