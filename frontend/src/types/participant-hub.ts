export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  rating: number;
  rank_title: string;
  tech_stack: string[];
  hackathons_won: number;
  hackathons_participated: number;
}
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
export interface ParticipantProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  rating: number;
  rank_title: string;
  hackathons_participated: number;
  hackathons_won: number;
  total_submissions: number;
  created_at: string;
  updated_at: string;
}
export type BadgeTier = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon_symbol: string;
  tier: BadgeTier;
  unlocked?: boolean;
}
