import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/auth/schemas";
import { hashPassword } from "@/lib/auth/password";
import { signSession } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/cookies";
import { authErr, AuthError } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json(
        { error: firstIssue, code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const { role, name, password } = parsed.data;
    // Always normalize email (lowercase & trimmed)
    const email = parsed.data.email.trim().toLowerCase();

    const supabase = await createClient();

    // Check if user already exists in database
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      throw authErr.accountExists();
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        name,
        role,
        password_hash: hashedPassword,
      })
      .select("id, email, name, role")
      .single();

    if (insertError || !newUser) {
      console.error("[api/auth/signup] Supabase DB Insert Error:", insertError);
      return NextResponse.json(
        { 
          error: `Database error: ${insertError?.message || "Could not save user account to Supabase."}`, 
          code: "DB_INSERT_FAILED",
          details: insertError 
        },
        { status: 500 }
      );
    }

    const sessionUser = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    // Issue JWT & set httpOnly cookie
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
    console.error("[api/auth/signup] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}