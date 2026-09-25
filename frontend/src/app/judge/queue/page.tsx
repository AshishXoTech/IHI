"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button, Card, StatusBadge } from "@/components/ui";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { judgeNavigation } from "@/components/layout/navigation";
import type { ApiResult, AssignedSubmissionItem } from "@/types/shared";

type FilterTab = "all" | "unscored" | "scored" | "corrections";

export default function JudgeQueuePage() {
  const [items, setItems] = useState<AssignedSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/judging/queue");
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
  }, []);

  // Filtered Queue Calculation
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

  // Telemetry KPIs
  const totalAssigned = items.length;
  const unscoredCount = items.filter((i) => !i.is_scored).length;
  const scoredCount = items.filter((i) => i.is_scored).length;
  const correctionCount = items.filter((i) => i.has_pending_correction).length;

  return (
    <DashboardShell
      role="judge"
      userName="Dr. Priya Rao"
      userEmail="priya@ihi.io"
      eventName="Evaluation Portal"
      navigation={judgeNavigation}
    >
      <div data-register="tower" className="min-h-full p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
        {/* Page Header */}
        <PageHeader
          eyebrow="Judge Portal"
          title="Assigned Submissions Queue"
          description="Evaluate submissions assigned to your rubric. Priority projects appear first."
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

        {/* Telemetry KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Assigned"
            value={totalAssigned}
            accent="primary"
            helper="All active assignments"
          />
          <MetricCard
            label="Pending Evaluation"
            value={unscoredCount}
            accent="attention"
            helper="Awaiting your score"
          />
          <MetricCard
            label="Completed Scores"
            value={scoredCount}
            accent="good"
            helper={`${totalAssigned ? Math.round((scoredCount / totalAssigned) * 100) : 0}% completion`}
          />
          <MetricCard
            label="Correction Requests"
            value={correctionCount}
            accent="critical"
            helper="Needs score revision"
          />
        </div>

        {/* Filter Tab Row */}
        <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4 overflow-x-auto">
          {[
            { id: "all", label: "All Projects", count: totalAssigned },
            { id: "unscored", label: "Unscored", count: unscoredCount },
            { id: "scored", label: "Completed", count: scoredCount },
            { id: "corrections", label: "Corrections Pending", count: correctionCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-body-sm font-semibold transition-all duration-normal ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-[var(--surface-bg)] text-[var(--text-muted)]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Card
            padding="md"
            variant="default"
            className="border-[var(--destructive)]/40 bg-[var(--destructive-subtle)] text-[var(--destructive)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-body-sm font-medium">{error}</p>
            </div>
          </Card>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card
                key={n}
                padding="lg"
                variant="default"
                className="animate-pulse space-y-3"
              >
                <div className="h-5 bg-[var(--border-default)] rounded w-1/3" />
                <div className="h-4 bg-[var(--border-default)] rounded w-1/4" />
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty Queue State */
          <Card
            padding="lg"
            variant="default"
            className="text-center py-16 space-y-4 max-w-lg mx-auto"
          >
            <div className="h-12 w-12 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] flex items-center justify-center mx-auto text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                No Submissions Found
              </h3>
              <p className="text-body-sm text-[var(--text-secondary)] mt-1">
                {activeTab === "all"
                  ? "There are currently no projects assigned to your queue."
                  : `No projects match the "${activeTab}" filter at this moment.`}
              </p>
            </div>
            <div className="pt-2">
              <Link href="/submit">
                <Button variant="secondary" size="sm">
                  Go to Submit Project →
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Submissions List */
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <Card
                key={item.assignment_id}
                padding="lg"
                variant="interactive"
                className="group"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-[var(--text-muted)] font-semibold">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-text)] transition-colors">
                        {item.project_title}
                      </h2>
                      <StatusBadge
                        status={item.is_scored ? "good" : "attention"}
                        label={item.is_scored ? "Scored" : "Unscored"}
                        pulse={!item.is_scored}
                      />
                      {item.has_pending_correction && (
                        <StatusBadge
                          status="critical"
                          label="Correction Pending Review"
                          size="sm"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-body-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <UsersIcon /> {item.team_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      href={`/judge/queue/${item.submission_id}${
                        item.event_id ? `?eventId=${item.event_id}` : ""
                      }`}
                    >
                      <Button
                        variant={item.is_scored ? "secondary" : "primary"}
                        size="md"
                        icon={<ChevronRightIcon />}
                        iconPosition="right"
                      >
                        {item.is_scored
                          ? "View Score / Request Fix"
                          : "Score Project"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

/* ==========================================================================
   INLINE ICON PRIMITIVES
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

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--text-muted)]">
      <path
        d="M4.667 7a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667zM9.333 7a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667zM1.75 12.25c0-1.75 1.75-2.917 3.5-2.917s3.5 1.167 3.5 2.917M8.75 12.25c0-1.75 1.75-2.917 3.5-2.917s3.5 1.167 3.5 2.917"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5.25 3.5L8.75 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}