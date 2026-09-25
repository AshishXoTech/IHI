"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { TeamMemberList } from "./TeamMemberList";
import { TeamChat } from "./TeamChat";
import type { Team, TeamMember, TeamChatMessage } from "@/types/shared";
import { clsx } from "clsx";

interface TeamWorkspaceProps {
  team: Team;
  members: TeamMember[];
  messages?: TeamChatMessage[];
  currentUserId: string;
  onLeave?: () => void;
  leaving?: boolean;
  className?: string;
}

export function TeamWorkspace({
  team,
  members,
  messages = [],
  currentUserId,
  onLeave,
  leaving: leavingProp,
  className,
}: TeamWorkspaceProps) {
  const router = useRouter();
  const [leavingInternal, setLeavingInternal] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const leaving = leavingProp ?? leavingInternal;

  const isLead = members.some(
    (m) =>
      m.user_id === currentUserId &&
      ((m.role as string) === "lead" || (m.role as string) === "leader")
  );

  const statusLabel =
    team.status === "forming"
      ? "Forming"
      : team.status === "full"
        ? "Full"
        : team.status === "locked"
          ? "Locked"
          : "Open";

  const statusTone =
    team.status === "full"
      ? "attention"
      : team.status === "locked"
        ? "critical"
        : "good";

  async function handleLeave() {
    if (onLeave) {
      onLeave();
      return;
    }

    const confirmMessage =
      isLead && members.length > 1
        ? "You are the team lead. Leaving will promote the next member. Continue?"
        : "Are you sure you want to leave this team?";

    if (!window.confirm(confirmMessage)) return;

    setLeavingInternal(true);
    setLeaveError(null);

    try {
      const res = await fetch(`/api/teams/${team.id}/leave`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || (!json.ok && !json.data?.left)) {
        setLeaveError(json.error || "Failed to leave team.");
        return;
      }

      router.push("/team");
      router.refresh();
    } catch {
      setLeaveError("Network error while leaving team.");
    } finally {
      setLeavingInternal(false);
    }
  }

  return (
    <div className={clsx("flex flex-col gap-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-[var(--surface-bg)] p-4 rounded-xl border border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
              {team.name}
            </h1>
            <StatusBadge status={statusTone as any} label={statusLabel} />
          </div>
          {team.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
              {team.description}
            </p>
          )}
          <p className="text-xs text-[var(--text-muted)] mt-1 tabular-nums">
            {team.member_count ?? members.length}/{team.max_members ?? 4} members
            {team.track ? ` · Track: ${team.track}` : ""}
            {isLead ? " · You are team lead" : ""}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/submit?teamId=${team.id}`)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            🚀 Submit Project
          </Button>

          <Button
            variant="destructive"
            size="sm"
            loading={leaving}
            onClick={handleLeave}
          >
            Leave team
          </Button>
        </div>
      </div>

      {leaveError && (
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {leaveError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card padding="md" className="h-fit">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Team Members
          </h2>
          <TeamMemberList members={members} currentUserId={currentUserId} />
        </Card>

        <TeamChat
          teamId={team.id}
          currentUserId={currentUserId}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}