"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageHeader } from "@/components/layout/PageHeader";
import type { ApiResult, AssignedSubmissionItem } from "@/types/shared";

type FilterTab = "all" | "unscored" | "scored" | "corrections";

function JudgeQueueContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";

  const [items, setItems] = useState<AssignedSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = eventId
        ? `/api/judging/queue?eventId=${encodeURIComponent(eventId)}`
        : "/api/judging/queue";
      const res = await fetch(url);
      const json = (await res.json()) as ApiResult<AssignedSubmissionItem[]>;
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Failed to load assigned queue.");
        return;
      }
      setItems(json.data || []);
    } catch {
      setError("Network error loading queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case "unscored":
        return items.filter((item) => !item.is_scored);
      case "scored":
        return items.filter((item) => item.is_scored);
      case "corrections":
        return items.filter((item) => item.has_pending_correction);
      default:
        return items;
    }
  }, [items, activeTab]);

  const totalAssigned = items.length;
  const unscoredCount = items.filter((i) => !i.is_scored).length;
  const scoredCount = items.filter((i) => i.is_scored).length;
  const correctionCount = items.filter((i) => i.has_pending_correction).length;

  return (
    <div className="mx-auto min-h-full max-w-[1400px] space-y-8 p-6 lg:p-10">
      
      {/* Header slightly translucent to let bg through */}
      <div className="rounded-2xl border border-gray-800 bg-black/40 p-6 backdrop-blur-md">
        <PageHeader
          eyebrow="Judge Portal"
          title="Assigned Submissions Queue"
          description={
            eventId
              ? `Evaluate submissions for event ${eventId}. Priority projects appear first.`
              : "Evaluate submissions assigned to your rubric. Priority projects appear first."
          }
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadQueue}
              loading={loading}
              icon={<RefreshIcon />}
            >
              Refresh Queue
            </Button>
          }
        />
        {/* Event scope chip */}
        {eventId && (
          <p className="mt-4 font-body text-sm text-gray-400">
            Scoped event:{" "}
            <span className="rounded border border-gold/30 bg-gold/10 px-1.5 py-0.5 font-mono text-xs text-gold-light">
              {eventId}
            </span>
          </p>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Assigned" value={totalAssigned} accent="primary" helper="All active assignments" />
        <MetricCard label="Pending Evaluation" value={unscoredCount} accent="attention" helper="Awaiting your score" />
        <MetricCard label="Completed Scores" value={scoredCount} accent="good" helper={`${totalAssigned ? Math.round((scoredCount / totalAssigned) * 100) : 0}% completion`} />
        <MetricCard label="Correction Requests" value={correctionCount} accent="critical" helper="Needs score revision" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-800 pb-4">
        {(
          [
            { id: "all" as const, label: "All Projects", count: totalAssigned },
            { id: "unscored" as const, label: "Unscored", count: unscoredCount },
            { id: "scored" as const, label: "Completed", count: scoredCount },
            { id: "corrections" as const, label: "Corrections Pending", count: correctionCount },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gold text-black shadow-sm"
                : "border border-gray-800 bg-black/50 backdrop-blur text-gray-400 hover:border-gray-500 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${activeTab === tab.id ? "bg-black/20 text-black" : "bg-gray-800 text-gray-400"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Error / Loading / Empty States */}
      {error && (
        <Card padding="md" variant="default" className="border-gray-600 bg-gray-900/80 backdrop-blur-md text-white">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} padding="lg" variant="default" className="animate-pulse space-y-3 border-gray-800 bg-gray-900/60 backdrop-blur-md">
              <div className="h-5 w-1/3 rounded bg-gray-800" />
              <div className="h-4 w-1/4 rounded bg-gray-800" />
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card padding="lg" variant="default" className="mx-auto max-w-lg space-y-4 border-gray-800 bg-gray-900/60 backdrop-blur-md py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">
            🎯
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-white">No Submissions Found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {activeTab === "all" ? "There are currently no projects assigned to your queue." : `No projects match the "${activeTab}" filter at this moment.`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const scoreHref = `/judge/queue/${item.submission_id}${item.event_id || eventId ? `?eventId=${encodeURIComponent(String(item.event_id || eventId))}` : ""}`;
            return (
              <Card key={item.assignment_id} padding="lg" variant="interactive" className="group border-gray-800 bg-gray-900/60 backdrop-blur-md hover:bg-gray-900/90 transition-colors">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-500">#{String(index + 1).padStart(2, "0")}</span>
                      <h2 className="truncate font-display text-lg font-semibold text-white transition-colors group-hover:text-gold-light">
                        {item.project_title}
                      </h2>
                      <StatusBadge status={item.is_scored ? "good" : "attention"} label={item.is_scored ? "Scored" : "Unscored"} pulse={!item.is_scored} />
                      {item.has_pending_correction && <StatusBadge status="critical" label="Correction Pending Review" size="sm" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><UsersIcon /> {item.team_name}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link href={scoreHref}>
                      <Button variant={item.is_scored ? "secondary" : "primary"} size="md" icon={<ChevronRightIcon />} iconPosition="right">
                        {item.is_scored ? "View Score / Request Fix" : "Score Project"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Wrap in Suspense to satisfy Next.js useSearchParams requirements
export default function JudgeQueuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-gray-500 flex items-center justify-center">Loading queue...</div>}>
      <JudgeQueueContent />
    </Suspense>
  );
}

/* ==========================================================================
   INLINE ICONS
   ========================================================================== */
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.25 7a5.25 5.25 0 11-1.54-3.71L12.25 5M12.25 1.75V5h-3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-500" aria-hidden="true">
      <path d="M4.667 7a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667zM9.333 7a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667zM1.75 12.25c0-1.75 1.75-2.917 3.5-2.917s3.5 1.167 3.5 2.917M8.75 12.25c0-1.75 1.75-2.917 3.5-2.917s3.5 1.167 3.5 2.917" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.25 3.5L8.75 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}