"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { TeamWorkspace } from "@/components/teams/TeamWorkspace";
import { createClient } from "@/lib/supabase/client";
import type { Team, TeamMember, TeamChatMessage } from "@/types/shared";

export default function TeamWorkspacePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const router = useRouter();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        if (mounted) setCurrentUserId(user.id);

        // 1) Team details via API
        const teamsRes = await fetch("/api/teams");
        const teamsJson = await teamsRes.json();
        const list: Team[] = teamsJson.data ?? teamsJson.teams ?? [];
        const found = list.find((t) => t.id === teamId) ?? null;

        // Fallback: direct table read if API list misses it
        if (!found) {
          const { data: row } = await supabase
            .from("teams")
            .select("*")
            .eq("id", teamId)
            .maybeSingle();

          if (row && mounted) {
            setTeam({
              id: row.id,
              event_id: row.event_id,
              name: row.name,
              description: row.description ?? null,
              skills_wanted: row.skills_wanted ?? row.skills_needed ?? [],
              track: row.track ?? null,
              max_members: row.max_members ?? row.max_size ?? 4,
              status: row.status ?? (row.is_locked ? "locked" : "forming"),
              lead_user_id: row.lead_user_id ?? row.created_by ?? "",
              member_count: 0,
              created_at: row.created_at,
            });
          }
        } else if (mounted) {
          setTeam(found);
        }

        // 2) Members
        const { data: memRows } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", teamId)
          .order("joined_at", { ascending: true });

        if (mounted) {
          const mapped: TeamMember[] = (memRows ?? []).map((m: any) => ({
            id: m.id,
            team_id: m.team_id,
            user_id: m.user_id,
            role: ((m.role as string) === "leader" ? "lead" : m.role || "member") as "lead" | "member",
            display_name:
              m.user_id === user.id
                ? "You"
                : m.display_name || m.sender_name || "Team Member",
            skills: m.skills ?? [],
            joined_at: m.joined_at || new Date().toISOString(),
          }));
          setMembers(mapped);

          // Keep member_count in sync on team object
          setTeam((prev) =>
            prev
              ? {
                  ...prev,
                  member_count: mapped.length,
                  lead_user_id:
                    prev.lead_user_id ||
                    mapped.find((x) => x.role === "lead")?.user_id ||
                    "",
                }
              : prev
          );
        }

        // 3) Optional initial chat messages
        const { data: msgRows } = await supabase
          .from("team_messages")
          .select("*")
          .eq("team_id", teamId)
          .order("created_at", { ascending: true });

        if (mounted && msgRows) {
          setMessages(
            msgRows.map((row: any) => ({
              id: row.id,
              team_id: row.team_id,
              user_id: row.user_id || row.sender_id || "",
              display_name: row.display_name || row.sender_name || "Team Member",
              body: row.body || row.content || "",
              reported: row.reported ?? row.is_flagged ?? false,
              created_at: row.created_at,
            }))
          );
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load team workspace.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (teamId) load();

    return () => {
      mounted = false;
    };
  }, [teamId, router]);

  async function handleLeave() {
    if (!team) return;

    const isLead = members.some(
      (m) =>
        m.user_id === currentUserId &&
        ((m.role as string) === "lead" || (m.role as string) === "leader")
    );

    const confirmMessage =
      isLead && members.length > 1
        ? "You are the team lead. Leaving will promote the next member. Continue?"
        : "Are you sure you want to leave this team?";

    if (!window.confirm(confirmMessage)) return;

    setLeaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${team.id}/leave`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || (!json.ok && !json.data?.left)) {
        setError(json.error || "Failed to leave team.");
        return;
      }

      router.push("/team");
      router.refresh();
    } catch {
      setError("Network error while leaving team.");
    } finally {
      setLeaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--ihi-surface-50)] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl text-sm text-[var(--ihi-surface-500)] animate-pulse">
          Loading team workspace…
        </div>
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="min-h-screen bg-[var(--ihi-surface-50)] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-sm text-[var(--destructive)]">
            {error || "Team not found."}
          </p>
          <Button onClick={() => router.push("/team")}>← Back to teams</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ihi-surface-50)] px-5 py-10 text-[var(--ihi-surface-900)] sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b border-[var(--ihi-surface-200)] pb-5">
          <p className="text-sm text-[var(--ihi-surface-500)]">
            Spring Innovation Challenge <span className="mx-1.5">/</span> Teams{" "}
            <span className="mx-1.5">/</span> {team.name}
          </p>
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/team")}
            >
              ← Back to team discovery
            </Button>
          </div>
        </header>

        <TeamWorkspace
          team={team}
          members={members}
          messages={messages}
          currentUserId={currentUserId}
          onLeave={handleLeave}
          leaving={leaving}
        />
      </div>
    </main>
  );
}