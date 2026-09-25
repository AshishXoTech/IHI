"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Card,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { organizerNavigation } from "@/components/layout/navigation";
import type { ApiResult, ResultsSummary } from "@/types/shared";
import { clsx } from "clsx";

export default function EventResultsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [summary, setSummary] = useState<ResultsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/results`);
      const json = (await res.json()) as ApiResult<ResultsSummary>;
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Failed to load results.");
        setSummary(null);
        return;
      }
      setSummary(json.data);
    } catch {
      setError("Network error loading results.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async () => {
    // Structural gate: never call API if not publishable
    if (!summary?.is_publishable) return;

    setPublishing(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/results`, {
        method: "POST",
      });
      const json = (await res.json()) as ApiResult<unknown>;
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Publish failed.");
        return;
      }
      setSuccess("Results published. Event status is now results_published.");
      await load();
    } catch {
      setError("Network error publishing results.");
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = Boolean(summary?.is_publishable) && !publishing;
  const alreadyPublished = summary?.event_status === "results_published";
  const completion = summary?.completion_percentage ?? 0;

  const rankings = summary?.rankings ?? [];
  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);

  return (
    <DashboardShell
      role="organizer"
      userName="Alex Chen"
      userEmail="alex@stanford.edu"
      eventName={summary?.event_name || "Event Results"}
      navigation={organizerNavigation}
    >
      <div data-register="tower" className="min-h-full">
        <div className="max-w-[1200px] mx-auto px-6 py-8 lg:px-10 space-y-8">
          {/* ==========================================================================
              HEADER
              ========================================================================== */}
          <PageHeader
            breadcrumbs={[
              { label: "Events", href: "/dashboard" },
              { label: summary?.event_name || "Event", href: `/events/${eventId}/dashboard` },
              { label: "Results" },
            ]}
            eyebrow="Event Closure"
            title="Final Results & Leaderboard"
            description="Rankings computed server-side from immutable scores (rubric weights). Review before publishing."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/events/${eventId}/audit-log`}>
                  <Button type="button" variant="secondary" size="sm">
                    Audit log
                  </Button>
                </Link>
                <Link href={`/events/${eventId}/judging/rubric`}>
                  <Button type="button" variant="secondary" size="sm">
                    Rubric
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={load}
                  loading={loading}
                  icon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </div>
            }
          />

          {/* Alerts */}
          {error && (
            <Card
              padding="sm"
              className="border-[var(--signal-critical)]/40 bg-[var(--signal-critical-bg)]"
              role="alert"
            >
              <p className="text-body-sm font-medium text-[var(--signal-critical)] flex items-center gap-2">
                <AlertIcon /> {error}
              </p>
            </Card>
          )}
          {success && (
            <Card
              padding="sm"
              className="border-[var(--signal-good)]/40 bg-[var(--signal-good-bg)]"
              role="status"
            >
              <p className="text-body-sm font-medium text-[var(--signal-good)] flex items-center gap-2">
                <CheckIcon /> {success}
              </p>
            </Card>
          )}

          {/* ==========================================================================
              PUBLISH READINESS GATE
              ========================================================================== */}
          <Card padding="none" variant="elevated" className="overflow-hidden">
            <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Progress Ring */}
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <ProgressRing
                  value={completion}
                  label={`${completion}%`}
                  sublabel="Complete"
                  accent={completion >= 100 ? "good" : completion >= 70 ? "attention" : "primary"}
                  size={140}
                />
              </div>

              {/* Status + Actions */}
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <p className="text-label text-[var(--text-muted)] mb-1">Scoring Completion</p>
                  <p className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                    {summary?.total_scored_submissions ?? 0}
                    <span className="text-[var(--text-muted)] font-normal">
                      {" "}/ {summary?.total_submissions ?? 0}
                    </span>
                    <span className="text-body-sm font-normal text-[var(--text-secondary)] ml-2">
                      submissions with ≥1 score
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge
                    status={
                      alreadyPublished
                        ? "good"
                        : summary?.is_publishable
                        ? "good"
                        : "attention"
                    }
                    label={
                      alreadyPublished
                        ? "Results already published"
                        : summary?.is_publishable
                        ? "Ready to publish"
                        : "Blocked — incomplete scoring"
                    }
                    pulse={!alreadyPublished && Boolean(summary?.is_publishable)}
                  />
                </div>

                {!summary?.is_publishable && !alreadyPublished && (
                  <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                    Publish is structurally disabled until completion reaches 100%
                    (every submission has at least one judge score). The server
                    re-checks this gate on publish — the button alone is not the
                    security boundary.
                  </p>
                )}
              </div>

              {/* Publish CTA */}
              <div className="flex-shrink-0">
                <Button
                  type="button"
                  size="lg"
                  loading={publishing}
                  disabled={!canPublish || alreadyPublished}
                  aria-disabled={!canPublish || alreadyPublished}
                  onClick={handlePublish}
                  icon={alreadyPublished ? <CheckIcon /> : <PublishIcon />}
                  iconPosition="right"
                  title={
                    alreadyPublished
                      ? "Already published"
                      : !summary?.is_publishable
                      ? "Disabled until every submission has at least one score"
                      : "Publish results"
                  }
                >
                  {alreadyPublished ? "Published" : "Publish Results"}
                </Button>
              </div>
            </div>
          </Card>

          {/* ==========================================================================
              LOADING STATE
              ========================================================================== */}
          {loading ? (
            <Card padding="lg" variant="default" className="text-center py-16">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent)] animate-spin mb-4" />
              <p className="text-body-sm text-[var(--text-muted)]">
                Computing rankings on server…
              </p>
            </Card>
          ) : rankings.length === 0 ? (
            <Card padding="lg" variant="default" className="text-center py-16">
              <p className="text-body-md text-[var(--text-secondary)]">
                No submissions to rank yet.
              </p>
            </Card>
          ) : (
            <>
              {/* ==========================================================================
                  PODIUM — TOP 3 (Animated)
                  ========================================================================== */}
              {topThree.length > 0 && (
                <section>
                  <h3 className="text-label text-[var(--text-muted)] mb-6">Top Winners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* 2nd */}
                    {topThree[1] && (
                      <PodiumCard
                        data={topThree[1]}
                        rank={2}
                        delay={0.15}
                        heightClass="h-44"
                      />
                    )}
                    {/* 1st */}
                    {topThree[0] && (
                      <PodiumCard
                        data={topThree[0]}
                        rank={1}
                        delay={0}
                        heightClass="h-56"
                        isGold
                      />
                    )}
                    {/* 3rd */}
                    {topThree[2] && (
                      <PodiumCard
                        data={topThree[2]}
                        rank={3}
                        delay={0.3}
                        heightClass="h-36"
                      />
                    )}
                  </div>
                </section>
              )}

              {/* ==========================================================================
                  FULL LEADERBOARD TABLE
                  ========================================================================== */}
              <section>
                <h3 className="text-label text-[var(--text-muted)] mb-4">
                  Full Leaderboard
                </h3>
                <Card padding="none" variant="elevated" className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow interactive={false}>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">Scores</TableHead>
                        <TableHead className="text-right">Weighted Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!rankings.length ? (
                        <TableEmpty colSpan={5} message="No submissions to rank." />
                      ) : (
                        <AnimatePresence>
                          {rankings.map((r, index) => (
                            <motion.tr
                              key={r.submission_id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: Math.min(index * 0.04, 0.6),
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={clsx(
                                "border-b border-[var(--border-default)] last:border-0",
                                "hover:bg-[var(--surface-bg)]/80 transition-colors",
                                r.rank <= 3 && "bg-[var(--accent-subtle)]/40"
                              )}
                            >
                              <TableCell>
                                <span
                                  className={clsx(
                                    "inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold",
                                    r.rank === 1 &&
                                      "bg-[var(--accent)] text-white shadow-sm",
                                    r.rank === 2 &&
                                      "bg-[var(--surface-bg)] border border-[var(--border-strong)] text-[var(--text-primary)]",
                                    r.rank === 3 &&
                                      "bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-secondary)]",
                                    r.rank > 3 && "text-[var(--text-secondary)]"
                                  )}
                                >
                                  {r.rank}
                                </span>
                              </TableCell>
                              <TableCell>
                                <p className="text-body-sm font-semibold text-[var(--text-primary)]">
                                  {r.project_title}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="text-body-sm text-[var(--text-secondary)]">
                                  {r.team_name}
                                </p>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="font-mono text-body-sm text-[var(--text-muted)] tabular-nums">
                                  {r.score_count}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-mono text-body-md font-bold text-[var(--text-primary)] tabular-nums">
                                  {r.final_average_score}
                                  <span className="text-xs font-normal text-[var(--text-muted)]">
                                    %
                                  </span>
                                </span>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </section>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

/* ==========================================================================
   PODIUM CARD
   ========================================================================== */

interface RankingRow {
  rank: number;
  submission_id: string;
  project_title: string;
  team_name: string;
  score_count: number;
  final_average_score: number;
}

function PodiumCard({
  data,
  rank,
  delay,
  heightClass,
  isGold = false,
}: {
  data: RankingRow;
  rank: number;
  delay: number;
  heightClass: string;
  isGold?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 32 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "relative rounded-t-[var(--radius-lg)] border border-b-0 border-[var(--border-default)]",
        "flex flex-col justify-end p-6 overflow-hidden",
        heightClass,
        isGold
          ? "bg-[var(--surface-raised)] border-[var(--accent)]/40 z-10 shadow-[var(--shadow-overlay)]"
          : "bg-[var(--surface)]"
      )}
    >
      {isGold && (
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/10 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={clsx(
            "h-11 w-11 rounded-full flex items-center justify-center font-display font-bold text-lg mb-3 shadow-sm",
            isGold
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-secondary)]"
          )}
        >
          {rank}
        </div>
        <h4
          className={clsx(
            "font-display font-semibold truncate max-w-full",
            isGold
              ? "text-heading-sm text-[var(--text-primary)]"
              : "text-body-md text-[var(--text-primary)]"
          )}
        >
          {data.project_title}
        </h4>
        <p className="text-xs text-[var(--text-muted)] mt-1 truncate max-w-full">
          {data.team_name}
        </p>
        <div className="mt-4 pt-3 border-t border-[var(--border-default)]/60 w-full flex justify-center">
          <p className="font-mono font-bold text-body-lg tabular-nums text-[var(--text-primary)]">
            {data.final_average_score}
            <span className="text-xs font-normal text-[var(--text-muted)]">%</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   ICONS
   ========================================================================== */

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12.25 7a5.25 5.25 0 11-1.54-3.71L12.25 5M12.25 1.75V5h-3.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 11.667V2.333m0 0L3.5 5.833m3.5-3.5l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <path
        d="M3.5 8.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}