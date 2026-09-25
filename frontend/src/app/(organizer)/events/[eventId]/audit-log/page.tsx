"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  StatusBadge,
  Input,
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
import { organizerNavigation } from "@/components/layout/navigation";
import type { ApiResult, AuditLogItem } from "@/types/shared";
import { clsx } from "clsx";

/* ==========================================================================
   FILTERS & HELPERS
   ========================================================================== */

const ENTITY_FILTERS = [
  "all",
  "score",
  "correction_request",
  "event",
  "registration",
] as const;

type EntityFilter = (typeof ENTITY_FILTERS)[number];

type ViewMode = "timeline" | "table";

/** Map action / entity to a visual severity for the timeline node */
function getSeverity(log: AuditLogItem): "info" | "success" | "warning" | "critical" {
  const action = (log.action || "").toUpperCase();
  const entity = (log.entity_type || "").toLowerCase();

  if (
    action.includes("DELETE") ||
    action.includes("REVOKE") ||
    action.includes("BLOCK") ||
    action.includes("RUBRIC")
  ) {
    return "critical";
  }
  if (
    action.includes("PUBLISH") ||
    action.includes("SCORE") ||
    action.includes("APPROVE") ||
    action.includes("SUBMIT")
  ) {
    return "success";
  }
  if (
    action.includes("CORRECTION") ||
    action.includes("LOCK") ||
    action.includes("WARN") ||
    entity === "correction_request"
  ) {
    return "warning";
  }
  return "info";
}

function formatActor(actorId: string | null | undefined): string {
  if (!actorId) return "—";
  return `${actorId.slice(0, 8)}…`;
}

function formatEntityId(id: string | null | undefined): string {
  if (!id) return "";
  return `${id.slice(0, 8)}…`;
}

function formatPayload(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? {}, null, 0);
  } catch {
    return String(payload ?? "");
  }
}

function prettyPayload(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? {}, null, 2);
  } catch {
    return String(payload ?? "");
  }
}

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function AuditLogPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filter, setFilter] = useState<EntityFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q =
        filter === "all" ? "" : `?entity_type=${encodeURIComponent(filter)}`;
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/audit-log${q}`
      );
      const json = (await res.json()) as ApiResult<AuditLogItem[]>;
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Failed to load audit log.");
        setLogs([]);
        return;
      }
      setLogs(json.data || []);
    } catch {
      setError("Network error loading audit log.");
    } finally {
      setLoading(false);
    }
  }, [eventId, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter((log) => {
      const hay = [
        log.action,
        log.entity_type,
        log.entity_id,
        log.actor_id,
        formatPayload(log.payload),
        log.created_at,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [logs, search]);

  const counts = useMemo(() => ({ shown: filteredLogs.length }), [filteredLogs]);

  return (
    <DashboardShell
      role="organizer"
      userName="Alex Chen"
      userEmail="alex@stanford.edu"
      eventName="Event Audit"
      navigation={organizerNavigation}
    >
      <div data-register="tower" className="min-h-full">
        <div className="max-w-[1100px] mx-auto px-6 py-8 lg:px-10 space-y-8">
          {/* ======================================================================
              HEADER
              ====================================================================== */}
          <PageHeader
            breadcrumbs={[
              { label: "Events", href: "/dashboard" },
              { label: "Event", href: `/events/${eventId}/dashboard` },
              { label: "Audit Log" },
            ]}
            eyebrow="Security & Compliance"
            title="Immutable Audit Trail"
            description="Newest first. Read-only permanent record of scores, corrections, registrations, and system events."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/events/${eventId}/results`}>
                  <Button type="button" variant="secondary" size="sm">
                    Results
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

          {/* Error */}
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

          {/* ======================================================================
              CONTROLS: SEARCH · FILTER · VIEW TOGGLE
              ====================================================================== */}
          <Card padding="sm" variant="default" className="overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Search actions, actors, entity IDs, payload…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  inputSize="sm"
                  icon={<SearchIcon />}
                />
              </div>

              {/* Entity filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ENTITY_FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={clsx(
                      "rounded-full px-3 py-1.5 text-xs font-semibold capitalize tracking-wide transition-all duration-normal border",
                      filter === f
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {f === "all" ? "All" : f.replace(/_/g, " ")}
                  </button>
                ))}
              </div>

              {/* View mode */}
              <div className="flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)]">
                <button
                  type="button"
                  onClick={() => setViewMode("timeline")}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors",
                    viewMode === "timeline"
                      ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors",
                    viewMode === "table"
                      ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Table
                </button>
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] text-[var(--text-muted)] px-1">
              Showing {counts.shown} row{counts.shown === 1 ? "" : "s"}
              {filter !== "all" ? ` · filter: ${filter}` : ""}
              {search.trim() ? ` · search: “${search.trim()}”` : ""}
              {" · "}read-only · no write actions on this screen
            </p>
          </Card>

          {/* ======================================================================
              CONTENT
              ====================================================================== */}
          {loading ? (
            <Card padding="lg" variant="default" className="text-center py-16">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent)] animate-spin mb-4" />
              <p className="text-body-sm text-[var(--text-muted)]">
                Loading audit log…
              </p>
            </Card>
          ) : viewMode === "timeline" ? (
            /* ---------- TIMELINE VIEW ---------- */
            <div className="relative pt-2 pb-8">
              {/* Vertical spine */}
              <div className="absolute left-[19px] sm:left-[23px] top-2 bottom-0 w-px bg-[var(--border-default)]" />

              {filteredLogs.length === 0 ? (
                <div className="pl-14 sm:pl-16 py-12">
                  <p className="text-body-sm text-[var(--text-muted)]">
                    No audit entries for this filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredLogs.map((log, index) => (
                    <TimelineNode
                      key={log.id}
                      log={log}
                      index={index}
                      expanded={expandedId === log.id}
                      onToggle={() =>
                        setExpandedId((id) => (id === log.id ? null : log.id))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ---------- TABLE VIEW ---------- */
            <Card padding="none" variant="elevated" className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow interactive={false}>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Payload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableEmpty
                      colSpan={5}
                      message="No audit entries for this filter."
                    />
                  ) : (
                    filteredLogs.map((log) => {
                      const severity = getSeverity(log);
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs text-[var(--text-secondary)] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={clsx(
                                "inline-flex font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] border",
                                severity === "critical" &&
                                  "bg-[var(--signal-critical-bg)] text-[var(--signal-critical)] border-[var(--signal-critical)]/25",
                                severity === "success" &&
                                  "bg-[var(--signal-good-bg)] text-[var(--signal-good)] border-[var(--signal-good)]/25",
                                severity === "warning" &&
                                  "bg-[var(--signal-attention-bg)] text-[var(--signal-attention)] border-[var(--signal-attention)]/25",
                                severity === "info" &&
                                  "bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--accent)]/25"
                              )}
                            >
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-[var(--text-secondary)]">
                            <span className="text-[var(--text-primary)]">
                              {log.entity_type}
                            </span>
                            {log.entity_id ? (
                              <span className="text-[var(--text-muted)]">
                                {" "}
                                · {formatEntityId(log.entity_id)}
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-[var(--text-muted)]">
                            {formatActor(log.actor_id)}
                          </TableCell>
                          <TableCell className="max-w-[240px]">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId((id) =>
                                  id === log.id ? null : log.id
                                )
                              }
                              className="block w-full text-left font-mono text-[10px] text-[var(--text-muted)] truncate hover:text-[var(--text-primary)] transition-colors"
                              title="Click to expand"
                            >
                              {expandedId === log.id
                                ? prettyPayload(log.payload)
                                : formatPayload(log.payload)}
                            </button>
                            {expandedId === log.id && (
                              <pre className="mt-2 p-2 rounded-[var(--radius-sm)] bg-[var(--surface-bg)] border border-[var(--border-default)] text-[10px] font-mono text-[var(--text-secondary)] overflow-x-auto max-h-40 custom-scrollbar whitespace-pre-wrap break-all">
                                {prettyPayload(log.payload)}
                              </pre>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

/* ==========================================================================
   TIMELINE NODE
   ========================================================================== */

function TimelineNode({
  log,
  index,
  expanded,
  onToggle,
}: {
  log: AuditLogItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const severity = getSeverity(log);

  const dotClass =
    severity === "critical"
      ? "bg-[var(--signal-critical)] shadow-[0_0_10px_var(--signal-critical)]"
      : severity === "success"
      ? "bg-[var(--signal-good)] shadow-[0_0_10px_var(--signal-good)]"
      : severity === "warning"
      ? "bg-[var(--signal-attention)] shadow-[0_0_10px_var(--signal-attention)]"
      : "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]";

  const badgeClass =
    severity === "critical"
      ? "bg-[var(--signal-critical-bg)] text-[var(--signal-critical)] border-[var(--signal-critical)]/25"
      : severity === "success"
      ? "bg-[var(--signal-good-bg)] text-[var(--signal-good)] border-[var(--signal-good)]/25"
      : severity === "warning"
      ? "bg-[var(--signal-attention-bg)] text-[var(--signal-attention)] border-[var(--signal-attention)]/25"
      : "bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--accent)]/25";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.4),
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex items-start gap-5 sm:gap-6"
    >
      {/* Dot */}
      <div className="relative z-10 flex-shrink-0 mt-2 ml-3 sm:ml-4">
        <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)] scale-[1.8]" />
        <div className={clsx("relative h-2.5 w-2.5 rounded-full", dotClass)} />
      </div>

      {/* Card */}
      <Card
        padding="md"
        variant="default"
        className={clsx(
          "flex-1 min-w-0 transition-colors duration-normal hover:border-[var(--border-strong)]",
          severity === "critical" &&
            "border-[var(--signal-critical)]/30 bg-[var(--signal-critical-bg)]/20"
        )}
      >
        <div className="flex flex-col xl:flex-row xl:items-start gap-4 justify-between">
          <div className="space-y-2.5 min-w-0 flex-1">
            {/* Action + time */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={clsx(
                  "font-mono text-[11px] font-bold px-2 py-0.5 rounded-[var(--radius-sm)] border",
                  badgeClass
                )}
              >
                {log.action}
              </span>
              <StatusBadge
                status={
                  severity === "critical"
                    ? "critical"
                    : severity === "success"
                    ? "good"
                    : severity === "warning"
                    ? "attention"
                    : "neutral"
                }
                label={log.entity_type}
                size="sm"
                dot={false}
              />
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>

            {/* Entity + actor */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]">
              <span className="font-mono">
                <span className="text-[var(--text-muted)]">entity</span>{" "}
                <span className="text-[var(--text-primary)]">{log.entity_type}</span>
                {log.entity_id && (
                  <span className="text-[var(--text-muted)]">
                    {" "}
                    · {formatEntityId(log.entity_id)}
                  </span>
                )}
              </span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="font-mono">
                <span className="text-[var(--text-muted)]">actor</span>{" "}
                {formatActor(log.actor_id)}
              </span>
            </div>

            {/* Expand toggle */}
            <button
              type="button"
              onClick={onToggle}
              className="text-xs font-medium text-[var(--accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
            >
              {expanded ? "Hide payload" : "View payload"}
            </button>

            {expanded && (
              <pre className="mt-1 p-3 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] text-[10px] font-mono text-[var(--text-secondary)] overflow-x-auto max-h-48 custom-scrollbar whitespace-pre-wrap break-all">
                {prettyPayload(log.payload)}
              </pre>
            )}
          </div>

          {/* Hash strip */}
          <div className="w-full xl:w-52 flex-shrink-0">
            <div className="rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] p-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">
                Record ID
              </p>
              <p className="font-mono text-[11px] text-[var(--text-secondary)] break-all">
                {log.id}
              </p>
            </div>
          </div>
        </div>
      </Card>
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
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