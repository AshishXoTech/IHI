import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult } from "@/types/shared";
import type { ParticipantProfile } from "@/types/participant-hub";

const DEFAULT_PROFILE: ParticipantProfile = {
  id: "demo-id-1",
  user_id: "demo-user-1",
  username: "jordan_kim",
  display_name: "Jordan Kim",
  headline: "Full-Stack Builder & System Architect",
  bio: "Building decentralized infrastructure and real-time developer tools. 3x hackathon winner.",
  avatar_url: null,
  tech_stack: ["TypeScript", "Next.js", "React", "PostgreSQL", "TailwindCSS", "Python"],
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  portfolio_url: "https://ihi.io",
  rating: 1820,
  rank_title: "Innovator",
  hackathons_participated: 6,
  hackathons_won: 3,
  total_submissions: 6,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId || userId === "demo" || userId === "me") {
      return NextResponse.json({ ok: true, data: DEFAULT_PROFILE });
    }

    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("participant_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({ ok: true, data: profile as ParticipantProfile });
    }

    // Return default profile with requested user_id
    return NextResponse.json({
      ok: true,
      data: { ...DEFAULT_PROFILE, user_id: userId },
    });
  } catch {
    return NextResponse.json({ ok: true, data: DEFAULT_PROFILE });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await req.json();
    const supabase = await createClient();

    const updates = {
      headline: body.headline,
      bio: body.bio,
      tech_stack: Array.isArray(body.tech_stack) ? body.tech_stack : [],
      github_url: body.github_url,
      linkedin_url: body.linkedin_url,
      portfolio_url: body.portfolio_url,
      updated_at: new Date().toISOString(),
    };

    const { data } = await supabase
      .from("participant_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      data: data || { ...DEFAULT_PROFILE, ...updates },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
