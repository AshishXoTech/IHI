"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RegistrationHealthModule } from "@/components/dashboard/RegistrationHealthModule";
import { TeamFormationHealthModule } from "@/components/dashboard/TeamFormationHealthModule";
import { SubmissionStatusModule } from "@/components/dashboard/SubmissionStatusModule";
import { JudgingProgressModule } from "@/components/dashboard/JudgingProgressModule";
import { PublishReadinessGate } from "@/components/dashboard/PublishReadinessGate";
import { Button, Card, StatusBadge } from "@/components/ui";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { organizerNavigation } from "@/components/layout/navigation";
import type {
  DashboardSummary,
  JudgingProgress,
  ReadinessCheck,
} from "@/components/dashboard/types";
import { clsx } from "clsx";

/* ==========================================================================
   MOCK DATA (used when NEXT_PUBLIC_USE_TEAM_MOCKS=true OR API unavailable)
   ========================================================================== */

const MOCK_SUMMARY: DashboardSummary = {
  event: {
    id: "mock-event-1",
    name: "IHI Demo Hackathon",
    maxParticipants: 500,
    submissionDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
  },
  registration: { total: 387, capacity: 500, utilizationPercent: 77.4 },
  teams: {
    totalTeams: 82,
    soloLookingCount: 12,
    totalParticipantsInTeams: 375,
  },
  submissions: {
    draftCount: 19,
    finalCount: 54,
    totalTeams: 82,
    completionPercent: 65.9,
  },
  serverTime: new Date().toISOString(),
};

const MOCK_JUDGING: JudgingProgress = {
  totalSubmissions: 54,
  scoredCount: 21,
  judgesActive: 6,
  averageScore: 7.3,
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

function buildReadinessChecks(
  summary: DashboardSummary,
  judging: JudgingProgress
): ReadinessCheck[] {
  const regOk =
    summary.registration.capacity === null ||
    (summary.registration.utilizationPercent ?? 0) >= 50;

  const teamsOk = summary.teams.soloLookingCount === 0;

  const subsOk =
    summary.submissions.totalTeams > 0 &&
    summary.submissions.completionPercent >= 95;

  const judgingOk =
    judging.totalSubmissions > 0 &&
    judging.scoredCount >= judging.totalSubmissions;

  return [
    {
      label: "Registration threshold met",
      passed: regOk,
      detail: regOk
        ? "Sufficient registrations recorded"
        : "Below 50% capacity",
    },
    {
      label: "All participants teamed",
      passed: teamsOk,
      detail: teamsOk
        ? "No solo participants remaining"
        : `${summary.teams.soloLookingCount} still looking`,
    },
    {
      label: "Submissions closed & complete",
      passed: subsOk,
      detail: subsOk
        ? `${summary.submissions.completionPercent}% finalized`
        : `${summary.submissions.completionPercent}% finalized — need ≥95%`,
    },
    {
      label: "Judging complete",
      passed: judgingOk,
      detail: judgingOk
        ? "All submissions scored"
        : `${judging.scoredCount}/${judging.totalSubmissions} scored`,
    },
  ];
}

function withFreshServerTime(base: DashboardSummary): DashboardSummary {
  return {
    ...base,
    serverTime: new Date().toISOString(),
    event: {
      ...base.event,
      // keep deadline relative if it was mock-based
      submissionDeadline: base.event.submissionDeadline,
    },
  };
}

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = use(params);
  const useMocks = process.env.NEXT_PUBLIC_USE_TEAM_MOCKS === "true";

  const [summary, setSummary] = useState<DashboardSummary | null>(
    useMocks ? withFreshServerTime(MOCK_SUMMARY) : null
  );
  const [judging, setJudging] = useState<JudgingProgress>(MOCK_JUDGING);
  const [loading, setLoading] = useState(!useMocks);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(useMocks);
  const [liveIndicator, setLiveIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const reFetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Data fetch (soft-fail on 404) ─────────────────────────────────────── */
  const fetchSummary = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (useMocks) {
        setSummary(withFreshServerTime(MOCK_SUMMARY));
        setJudging(MOCK_JUDGING);
        setUsingFallback(true);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!opts?.silent) {
        // keep existing UI visible during background refresh
        if (!summary) setLoading(true);
        else setRefreshing(true);
      }

      try {
        const candidates = [
          `/api/dashboard/${encodeURIComponent(eventId)}`,
          `/api/events/${encodeURIComponent(eventId)}/dashboard`,
        ];

        let loaded: DashboardSummary | null = null;
        let lastStatus = 0;

        for (const url of candidates) {
          const res = await fetch(url, { cache: "no-store" });
          lastStatus = res.status;

          if (res.ok) {
            const json = await res.json();
            // Support raw body or { ok, data } envelope
            const data = (json?.data ?? json) as DashboardSummary;
            if (data?.event || data?.registration) {
              loaded = data;
              break;
            }
          }

          // Try next candidate only on 404
          if (res.status !== 404) {
            throw new Error(`HTTP ${res.status}`);
          }
        }

        if (loaded) {
          setSummary(loaded);
          // Optional judging block if API returns it
          const j = (loaded as unknown as { judging?: JudgingProgress }).judging;
          if (j) setJudging(j);
          setUsingFallback(false);
          setError(null);
        } else {
          // API missing — keep page usable with demo metrics
          setSummary(
            withFreshServerTime({
              ...MOCK_SUMMARY,
              event: { ...MOCK_SUMMARY.event, id: eventId },
            })
          );
          setJudging(MOCK_JUDGING);
          setUsingFallback(true);
          setError(
            lastStatus === 404
              ? "Dashboard API not available yet — showing demo metrics."
              : `Could not load dashboard (HTTP ${lastStatus}). Showing demo metrics.`
          );
        }
      } catch (err) {
        console.error("[dashboard] fetch error", err);
        setSummary(
          withFreshServerTime({
            ...MOCK_SUMMARY,
            event: { ...MOCK_SUMMARY.event, id: eventId },
          })
        );
        setJudging(MOCK_JUDGING);
        setUsingFallback(true);
        setError(
          err instanceof Error
            ? `${err.message} — showing demo metrics.`
            : "Unable to load dashboard data — showing demo metrics."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId, useMocks, summary]
  );

  // Initial load
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once per event
  }, [eventId, useMocks]);

  /* ── Supabase Realtime ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (useMocks) return;

    const supabase = createClient();
    const channel = supabase.channel(`dashboard-live-${eventId}`);

    const debouncedRefetch = () => {
      if (reFetchTimer.current) clearTimeout(reFetchTimer.current);
      reFetchTimer.current = setTimeout(() => {
        fetchSummary({ silent: true });
        setLiveIndicator(true);
        setTimeout(() => setLiveIndicator(false), 1500);
      }, 400);
    };

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
          filter: `event_id=eq.${eventId}`,
        },
        debouncedRefetch
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `event_id=eq.${eventId}`,
        },
        debouncedRefetch
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
          filter: `event_id=eq.${eventId}`,
        },
        debouncedRefetch
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[dashboard] Realtime subscribed");
        }
      });

    return () => {
      supabase.removeChannel(channel);
      if (reFetchTimer.current) clearTimeout(reFetchTimer.current);
    };
  }, [eventId, useMocks, fetchSummary]);

  /* ── Loading (first paint only) ────────────────────────────────────────── */
  if (loading && !summary) {
    return (
      <DashboardShell
        role="organizer"
        userName="Alex Chen"
        userEmail="alex@stanford.edu"
        eventName="Loading…"
        navigation={organizerNavigation}
      >
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent)] animate-spin" />
            <p className="text-body-sm text-[var(--text-muted)]">
              Loading dashboard…
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!summary) {
    return (
      <DashboardShell
        role="organizer"
        userName="Alex Chen"
        userEmail="alex@stanford.edu"
        eventName="Dashboard"
        navigation={organizerNavigation}
      >
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <Card padding="lg" className="max-w-md text-center space-y-4">
            <p className="text-body-md text-[var(--signal-critical)]">
              {error ?? "No data available"}
            </p>
            <Button onClick={() => fetchSummary()} icon={<RefreshIcon />}>
              Retry
            </Button>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const checks = buildReadinessChecks(summary, judging);
  const allReady = checks.every((c) => c.passed);

  return (
    <DashboardShell
      role="organizer"
      userName="Alex Chen"
      userEmail="alex@stanford.edu"
      eventName={summary.event.name}
      navigation={organizerNavigation}
      headerActions={
        <div className="flex items-center gap-2">
          <Link href={`/events/${eventId}/results`}>
            <Button size="sm" variant="secondary">
              Results
            </Button>
          </Link>
          <Link href={`/events/${eventId}/audit-log`}>
            <Button size="sm" variant="ghost">
              Audit log
            </Button>
          </Link>
        </div>
      }
    >
      <div data-register="tower" className="min-h-full">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10 space-y-8">
          {/* Header */}
          <PageHeader
            breadcrumbs={[
              { label: "Events", href: "/dashboard" },
              { label: summary.event.name },
              { label: "Dashboard" },
            ]}
            eyebrow="Live Operations"
            title={summary.event.name}
            description="Registration, teams, submissions, judging, and publish readiness in one view."
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5" role="status">
                  <span
                    className={clsx(
                      "inline-block h-2 w-2 rounded-full transition-opacity duration-300",
                      liveIndicator
                        ? "bg-[var(--signal-good)] opacity-100"
                        : "bg-[var(--signal-good)] opacity-40"
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {useMocks || usingFallback ? "Demo data" : "Live"}
                  </span>
                </div>

                <StatusBadge
                  status={allReady ? "good" : "attention"}
                  label={allReady ? "Publish ready" : "In progress"}
                  pulse={!allReady}
                  size="sm"
                />

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fetchSummary()}
                  loading={refreshing}
                  icon={<RefreshIcon />}
                  aria-label="Refresh dashboard data"
                >
                  Refresh
                </Button>
              </div>
            }
          />

          {/* Soft banner when API missing — never a hard crash */}
          {error && (
            <Card
              padding="sm"
              className={clsx(
                usingFallback
                  ? "border-[var(--signal-attention)]/40 bg-[var(--signal-attention-bg)]"
                  : "border-[var(--signal-critical)]/40 bg-[var(--signal-critical-bg)]"
              )}
              role="status"
            >
              <p
                className={clsx(
                  "text-body-sm font-medium flex items-center gap-2",
                  usingFallback
                    ? "text-[var(--signal-attention)]"
                    : "text-[var(--signal-critical)]"
                )}
              >
                <AlertIcon />
                {error}
              </p>
            </Card>
          )}

          {/* Module grid — original components preserved */}
          <div className="grid gap-5 lg:grid-cols-3">
            <RegistrationHealthModule data={summary.registration} />
            <TeamFormationHealthModule data={summary.teams} />
            <SubmissionStatusModule
              data={summary.submissions}
              deadline={summary.event.submissionDeadline}
              serverTime={summary.serverTime}
            />

            <div className="lg:col-span-1">
              <JudgingProgressModule data={judging} />
            </div>
            <div className="lg:col-span-2">
              <PublishReadinessGate checks={checks} />
            </div>
          </div>

          {/* Quick navigation */}
          <Card padding="md" variant="default">
            <p className="text-label text-[var(--text-muted)] mb-3">Quick links</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Registrations", href: `/events/${eventId}/registrations` },
                { label: "Teams", href: `/events/${eventId}/teams` },
                { label: "Submissions", href: `/events/${eventId}/submissions` },
                { label: "Rubric", href: `/events/${eventId}/judging/rubric` },
                { label: "Assign judges", href: `/events/${eventId}/judging/assign` },
                { label: "Results", href: `/events/${eventId}/results` },
                { label: "Audit log", href: `/events/${eventId}/audit-log` },
              ].map((l) => (
                <Link key={l.href} href={l.href}>
                  <Button size="sm" variant="secondary">
                    {l.label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
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

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5v4.5M8 11.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}