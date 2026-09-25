import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const judgeEmail = email || "judge@university.edu";

    const cookieStore = await cookies();

    // Set judge session cookies
    cookieStore.set("ihi_role", "judge", { path: "/", httpOnly: false });
    cookieStore.set("ihi_user_email", judgeEmail, { path: "/", httpOnly: false });
    cookieStore.set("ihi_judge_session", "active", { path: "/", httpOnly: false });

    return NextResponse.json({ success: true, redirect: "/judge/queue" });
  } catch (error) {
    console.error("Direct judge login error:", error);
    return NextResponse.json({ error: "Failed to set judge session" }, { status: 500 });
  }
}