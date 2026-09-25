import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardEntry } from "@/types/shared";

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    user_id: "usr-1",
    username: "ada_lovelace",
    display_name: "Ada Lovelace",
    avatar_url: null,
    rating: 2450,
    rank_title: "Grandmaster",
    tech_stack: ["Rust", "C++", "Algorithm Design", "Assembly"],
    hackathons_won: 8,
    hackathons_participated: 10,
  },
  {
    rank: 2,
    user_id: "usr-2",
    username: "linus_torvalds",
    display_name: "Linus Torvalds",
    avatar_url: null,
    rating: 2310,
    rank_title: "Legend",
    tech_stack: ["C", "Linux Kernel", "Git", "Systems"],
    hackathons_won: 6,
    hackathons_participated: 7,
  },
  {
    rank: 3,
    user_id: "usr-3",
    username: "jordan_kim",
    display_name: "Jordan Kim",
    avatar_url: null,
    rating: 1820,
    rank_title: "Innovator",
    tech_stack: ["TypeScript", "Next.js", "PostgreSQL", "Python"],
    hackathons_won: 3,
    hackathons_participated: 6,
  },
  {
    rank: 4,
    user_id: "usr-4",
    username: "alex_chen",
    display_name: "Alex Chen",
    avatar_url: null,
    rating: 1740,
    rank_title: "Builder",
    tech_stack: ["React", "FastAPI", "Docker", "PyTorch"],
    hackathons_won: 2,
    hackathons_participated: 5,
  },
  {
    rank: 5,
    user_id: "usr-5",
    username: "priya_sharma",
    display_name: "Priya Sharma",
    avatar_url: null,
    rating: 1680,
    rank_title: "Builder",
    tech_stack: ["Solidity", "Ethers.js", "TypeScript", "GraphQL"],
    hackathons_won: 2,
    hackathons_participated: 4,
  },
  {
    rank: 6,
    user_id: "usr-6",
    username: "marcus_vance",
    display_name: "Marcus Vance",
    avatar_url: null,
    rating: 1590,
    rank_title: "Contributor",
    tech_stack: ["Go", "Kubernetes", "gRPC", "Redis"],
    hackathons_won: 1,
    hackathons_participated: 3,
  },
  {
    rank: 7,
    user_id: "usr-7",
    username: "elena_rostova",
    display_name: "Elena Rostova",
    avatar_url: null,
    rating: 1520,
    rank_title: "Contributor",
    tech_stack: ["Vue.js", "Node.js", "MongoDB", "TailwindCSS"],
    hackathons_won: 1,
    hackathons_participated: 3,
  },
];

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: profiles } = await supabase
      .from("participant_profiles")
      .select("*")
      .order("rating", { ascending: false })
      .limit(50);

    if (profiles && profiles.length > 0) {
      const dbRankings: LeaderboardEntry[] = profiles.map((p, idx) => ({
        rank: idx + 1,
        user_id: p.user_id,
        username: p.username || `builder_${p.user_id.slice(0, 5)}`,
        display_name: p.username || "Anonymous Builder",
        avatar_url: p.avatar_url,
        rating: p.rating,
        rank_title: p.rank_title,
        tech_stack: p.tech_stack || [],
        hackathons_won: p.hackathons_won || 0,
        hackathons_participated: p.hackathons_participated || 1,
      }));
      return NextResponse.json({ ok: true, data: dbRankings });
    }

    return NextResponse.json({ ok: true, data: SEED_LEADERBOARD });
  } catch {
    return NextResponse.json({ ok: true, data: SEED_LEADERBOARD });
  }
}