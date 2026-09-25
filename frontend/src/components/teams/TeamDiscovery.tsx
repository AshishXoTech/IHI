"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { TeamCard } from "./TeamCard";
import { SkillFilter } from "./SkillFilter";
import { CreateTeamForm } from "./CreateTeamForm";
import type { Team } from "@/types/shared";
import { clsx } from "clsx";

// Usage:
//   <TeamDiscovery />                          // fully self-contained
//   <TeamDiscovery teams={teams} onCreateClick={...} onJoinTeam={...} />

interface TeamDiscoveryProps {
  teams?: Team[];
  eventId?: string;
  myTeamId?: string | null;
  onCreateClick?: () => void;
  onOpenTeam?: (teamId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  className?: string;
}

export function TeamDiscovery({
  teams: teamsProp,
  eventId,
  myTeamId: myTeamIdProp,
  onCreateClick,
  onOpenTeam,
  onJoinTeam,
  className,
}: TeamDiscoveryProps) {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>(teamsProp ?? []);
  const [myTeamId, setMyTeamId] = useState<string | null | undefined>(myTeamIdProp);
  const [loading, setLoading] = useState(!teamsProp);
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hideFull, setHideFull] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep in sync if parent passes teams later
  useEffect(() => {
    if (teamsProp) setTeams(teamsProp);
  }, [teamsProp]);

  useEffect(() => {
    if (myTeamIdProp !== undefined) setMyTeamId(myTeamIdProp);
  }, [myTeamIdProp]);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const qs = eventId ? `?event_id=${encodeURIComponent(eventId)}` : "";
      const res = await fetch(`/api/teams${qs}`);
      const json = await res.json();

      if (json.ok) {
        const list: Team[] = json.data ?? json.teams ?? [];
        setTeams(list);
      } else {
        setError(json.error || "Failed to load teams.");
      }
    } catch {
      setError("Network error while loading teams.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Self-fetch when parent didn't provide teams
  useEffect(() => {
    if (!teamsProp) {
      fetchTeams();
    }
  }, [teamsProp, fetchTeams]);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    teams.forEach((t) => {
      (t.skills_wanted ?? []).forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [teams]);

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const max = t.max_members ?? 4;
      const count = t.member_count ?? 0;
      const isFull = t.status === "full" || count >= max;

      if (hideFull && isFull) return false;

      if (query) {
        const q = query.toLowerCase();
        const hay = `${t.name} ${t.description ?? ""} ${t.track ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (selectedSkills.length > 0) {
        const wanted = t.skills_wanted ?? [];
        if (!selectedSkills.some((s) => wanted.includes(s))) return false;
      }

      return true;
    });
  }, [teams, query, selectedSkills, hideFull]);

  function handleCreateClick() {
    if (onCreateClick) {
      onCreateClick();
      return;
    }
    setIsCreateOpen(true);
  }

  function handleOpenTeam(teamId: string) {
    if (onOpenTeam) {
      onOpenTeam(teamId);
      return;
    }
    router.push(`/team/${teamId}`);
  }

  async function handleJoinTeam(teamId: string) {
    if (onJoinTeam) {
      onJoinTeam(teamId);
      return;
    }

    try {
      setJoiningId(teamId);
      setError(null);
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (!res.ok || (!json.ok && !json.success)) {
        setError(json.error || "Could not join team.");
        return;
      }

      setMyTeamId(teamId);
      router.push(`/team/${teamId}`);
    } catch {
      setError("Network error while joining team.");
    } finally {
      setJoiningId(null);
    }
  }

  function handleCreated(teamId: string) {
    setIsCreateOpen(false);
    setMyTeamId(teamId);
    // Refresh list then enter workspace
    fetchTeams().finally(() => {
      router.push(`/team/${teamId}`);
    });
  }

  return (
    <div className={clsx("flex flex-col gap-5", className)}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Find a team
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Browse open teams or start your own. Last-slot joins are concurrency-safe.
          </p>
        </div>
        {!myTeamId && (
          <Button variant="primary" onClick={handleCreateClick}>
            Create a team
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Search teams"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, track, description…"
        />

        <SkillFilter
          skills={allSkills}
          selected={selectedSkills}
          onChange={setSelectedSkills}
        />

        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={hideFull}
            onChange={(e) => setHideFull(e.target.checked)}
            className="rounded border-[var(--border-default)] text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          />
          Hide full teams
        </label>
      </div>

      {error && (
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[var(--text-muted)] py-10 text-center animate-pulse">
          Loading teams…
        </p>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <p className="text-sm text-[var(--text-muted)]">
            {teams.length === 0
              ? "No teams yet. Be the first to create one."
              : "No teams match your filters."}
          </p>
          {!myTeamId && teams.length === 0 && (
            <Button variant="primary" onClick={handleCreateClick}>
              Create a team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isMember={team.id === myTeamId}
              joinDisabled={Boolean(myTeamId) || joiningId === team.id}
              onOpen={() => handleOpenTeam(team.id)}
              onRequestJoin={() => handleJoinTeam(team.id)}
            />
          ))}
        </div>
      )}

      {/* Built-in Create Team Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg relative">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-neutral-900 border border-white/20 text-white text-sm hover:bg-neutral-800"
              aria-label="Close"
            >
              ✕
            </button>
            <CreateTeamForm
              eventId={eventId}
              onCreated={handleCreated}
              onSuccess={handleCreated}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}