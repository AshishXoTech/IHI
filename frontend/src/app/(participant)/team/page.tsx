"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { TeamDiscovery } from "@/components/teams/TeamDiscovery";
import { CreateTeamForm } from "@/components/teams/CreateTeamForm";

interface SoloParticipant {
  id?: string;
  user_id?: string;
  initials: string;
  name: string;
  skill: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamDiscoveryPage() {
  const router = useRouter();
  const [soloParticipants, setSoloParticipants] = useState<SoloParticipant[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [eventName, setEventName] = useState("Spring Innovation Challenge");
  const [loadingSidebar, setLoadingSidebar] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSidebarData() {
      setLoadingSidebar(true);
      try {
        // Load teams count
        const teamsRes = await fetch("/api/teams");
        const teamsJson = await teamsRes.json();
        if (mounted && teamsJson.ok) {
          const list = teamsJson.data ?? teamsJson.teams ?? [];
          setTeamCount(list.length);
        }

        // Load looking-for-team pool
        const lookingRes = await fetch("/api/teams/looking");
        if (lookingRes.ok) {
          const lookingJson = await lookingRes.json();
          const raw =
            lookingJson.data ?? lookingJson.participants ?? lookingJson ?? [];
          if (mounted && Array.isArray(raw)) {
            setSoloParticipants(
              raw.map((p: Record<string, unknown>) => {
                const name =
                  (p.user_name as string) ||
                  (p.name as string) ||
                  (p.display_name as string) ||
                  "Participant";
                const skills = p.skills || p.skill || [];
                const skillText = Array.isArray(skills)
                  ? (skills as string[]).slice(0, 2).join(", ") || "Open to any role"
                  : String(skills || "Open to any role");
                return {
                  id: (p.id as string) || (p.user_id as string),
                  user_id: p.user_id as string | undefined,
                  initials: getInitials(name),
                  name,
                  skill: skillText,
                };
              })
            );
          }
        }
      } catch {
        // Sidebar is non-critical — keep empty states
      } finally {
        if (mounted) setLoadingSidebar(false);
      }
    }

    loadSidebarData();
    return () => {
      mounted = false;
    };
  }, []);

  function handleCreated(teamId: string) {
    setIsCreateOpen(false);
    router.push(`/team/${teamId}`);
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      {/* Page Header */}
      <PageHeader
        eyebrow={eventName}
        title="Find your team"
        description="Join a team with room for your strengths, or start the one you need."
        actions={
          <Button
            size="sm"
            icon={<PlusIcon />}
            onClick={() => setIsCreateOpen(true)}
          >
            Create a team
          </Button>
        }
      />

      {/* KPI Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Open Teams"
          value={teamCount}
          accent="primary"
          helper="Accepting members"
        />
        <MetricCard
          label="Looking for Team"
          value={soloParticipants.length}
          accent="attention"
          helper="Solo participants"
        />
        <MetricCard
          label="Your Status"
          value="Solo"
          accent="secondary"
          helper="Not yet matched"
        />
        <MetricCard
          label="Avg Team Size"
          value="3.2"
          accent="good"
          helper="of 4 max seats"
        />
      </div>

      {/* Main layout: discovery + sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* Live Team Discovery (API-backed) */}
        <section className="min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                Discover Teams
              </h2>
              <p className="text-body-sm text-[var(--text-secondary)] mt-1">
                Browse open teams looking for your skill set.
              </p>
            </div>
            <StatusBadge status="good" label="Live" pulse size="sm" />
          </div>

          <TeamDiscovery
            onCreateClick={() => setIsCreateOpen(true)}
            onOpenTeam={(teamId) => router.push(`/team/${teamId}`)}
          />
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Still Looking Pool */}
          <Card padding="md" variant="default">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <p className="text-body-md font-semibold text-[var(--text-primary)]">
                  Still looking
                </p>
                <p className="mt-1 text-body-sm text-[var(--text-secondary)]">
                  Participants who haven&apos;t found a team yet.
                </p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-xs font-mono font-bold text-[var(--accent-text)]">
                {soloParticipants.length}
              </span>
            </div>

            {loadingSidebar ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 animate-pulse">
                    <div className="h-9 w-9 rounded-full bg-[var(--border-default)]" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 rounded bg-[var(--border-default)]" />
                      <div className="h-2.5 w-16 rounded bg-[var(--border-default)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : soloParticipants.length === 0 ? (
              <div className="mt-6 py-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--border-default)] text-lg">
                  👋
                </div>
                <p className="text-body-sm text-[var(--text-muted)]">
                  No solo participants listed right now.
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-1">
                {soloParticipants.map((person) => (
                  <li
                    key={person.id || person.name}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] p-2.5 -mx-1 hover:bg-[var(--surface-bg)] transition-colors cursor-pointer group"
                  >
                    <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-cyan-400 text-[11px] font-bold text-white shadow-sm">
                      {person.initials}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--signal-good)] ring-2 ring-[var(--surface)]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-text)] transition-colors">
                        {person.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {person.skill}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Invite
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Create CTA Card */}
          <Card
            padding="md"
            variant="default"
            className="relative overflow-hidden border-[var(--accent)]/25"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-subtle)] text-[var(--accent-text)]">
                <PlusIcon />
              </div>
              <p className="text-body-md font-semibold text-[var(--text-primary)]">
                Can&apos;t find the right fit?
              </p>
              <p className="mt-2 text-body-sm leading-relaxed text-[var(--text-secondary)]">
                Create a team and make the open role clear to the room. Others will find you.
              </p>
              <Button
                size="sm"
                className="mt-5 w-full"
                onClick={() => setIsCreateOpen(true)}
                icon={<PlusIcon />}
              >
                Create a team
              </Button>
            </div>
          </Card>

          {/* Tips Card */}
          <Card padding="md" variant="flat">
            <p className="text-label text-[var(--text-muted)] mb-3">Quick Tips</p>
            <ul className="space-y-2.5">
              {[
                "Add your skills so teams can find you faster",
                "Message team leads before requesting to join",
                "Teams of 3–4 perform best historically",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2.5 text-body-sm text-[var(--text-secondary)]"
                >
                  <span className="mt-1 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      {/* Create Team Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create a new team"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg animate-scale-in">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)] transition-colors shadow-[var(--shadow-card)]"
              aria-label="Close create team modal"
            >
              ✕
            </button>
            <CreateTeamForm
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

/* ==========================================================================
   INLINE ICON PRIMITIVES
   ========================================================================== */

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 2.5v9M2.5 7h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}