"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, StatusBadge } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { clsx } from "clsx";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface LeaderboardEntry {
  rank: number;
  submission_id: string;
  project_title: string;
  team_name: string;
  track?: string;
  final_average_score: number;
  is_mine?: boolean;
}

interface MyResult {
  rank: number;
  project_title: string;
  team_name: string;
  score: number;
  track?: string;
  certificate_id: string;
  event_name: string;
  participant_name: string;
  issued_at: string;
  published: boolean;
}

/* ==========================================================================
   MOCK FALLBACK (replace with API when live)
   ========================================================================== */

const MOCK_MINE: MyResult = {
  rank: 12,
  project_title: "Signal Foundry",
  team_name: "Team Cortex",
  score: 7.1,
  track: "Infrastructure",
  certificate_id: "IHI-2026-SIC-0x9fa4b2",
  event_name: "Spring Innovation Challenge",
  participant_name: "Jordan Kim",
  issued_at: "2026-04-24",
  published: true,
};

const MOCK_BOARD: LeaderboardEntry[] = [
  { rank: 1, submission_id: "1", project_title: "NeuroLens", team_name: "Team Cortex", track: "AI/ML", final_average_score: 9.4 },
  { rank: 2, submission_id: "2", project_title: "GreenLedger", team_name: "Team Verde", track: "Web3", final_average_score: 8.9 },
  { rank: 3, submission_id: "3", project_title: "MediSync", team_name: "Team Pulse", track: "AI/ML", final_average_score: 8.7 },
  { rank: 4, submission_id: "4", project_title: "AquaGuard", team_name: "Team Hydro", track: "Sustainability", final_average_score: 8.2 },
  { rank: 5, submission_id: "5", project_title: "EduChain", team_name: "Team Spark", track: "Web3", final_average_score: 7.8 },
  { rank: 12, submission_id: "12", project_title: "Signal Foundry", team_name: "Team Cortex", track: "Infrastructure", final_average_score: 7.1, is_mine: true },
];

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function ParticipantResultsPage() {
  const [mine, setMine] = useState<MyResult | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Prefer live API when available; fall back to mock for demo
      const res = await fetch("/api/events/current/results/me").catch(() => null);
      if (res?.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          setMine(json.data.mine);
          setBoard(json.data.leaderboard || []);
          return;
        }
      }
      // Demo fallback
      setMine(MOCK_MINE);
      setBoard(MOCK_BOARD);
    } catch {
      setError("Could not load results.");
      setMine(MOCK_MINE);
      setBoard(MOCK_BOARD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Hook to real PDF endpoint when ready:
      // const res = await fetch(`/api/certificates/${mine?.certificate_id}`);
      await new Promise((r) => setTimeout(r, 1200));
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyId = async () => {
    if (!mine?.certificate_id) return;
    try {
      await navigator.clipboard.writeText(mine.certificate_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="p-6 lg:p-10 max-w-[1200px] mx-auto min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent)] animate-spin" />
          <p className="text-body-sm text-[var(--text-muted)]">Loading results…</p>
        </div>
      </div>
    );
  }

  /* ---------- Not published yet ---------- */
  if (mine && !mine.published) {
    return (
      <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-8">
        <PageHeader
          eyebrow="Event Closure"
          title="Results"
          description="Final standings will appear here once organizers publish them."
        />
        <Card padding="lg" variant="default" className="text-center py-16 max-w-lg mx-auto">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--border-default)] text-xl">
            ⏳
          </div>
          <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
            Results not published yet
          </h2>
          <p className="mt-2 text-body-sm text-[var(--text-secondary)]">
            Organizers are still finalizing scores. Check back soon — your certificate will unlock automatically when results go live.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-8">
      <PageHeader
        eyebrow="Event Concluded"
        title="Final Results & Certificate"
        description="Thank you for participating. View standings and download your verified achievement certificate."
        actions={
          <StatusBadge status="good" label="Results Published" pulse={false} />
        }
      />

      {error && (
        <Card padding="sm" className="border-[var(--signal-critical)]/40 bg-[var(--signal-critical-bg)]" role="alert">
          <p className="text-body-sm font-medium text-[var(--signal-critical)]">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ======================================================================
            LEFT: CERTIFICATE
            ====================================================================== */}
        <div className="xl:col-span-5 space-y-5">
          <h3 className="text-label text-[var(--text-muted)]">Your Achievement</h3>

          {mine && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Certificate document — A4-ish aspect */}
              <Card
                padding="none"
                variant="elevated"
                className="relative overflow-hidden border-[var(--border-strong)] aspect-[1.414/1] flex flex-col justify-between ihi-noise-layer"
              >
                {/* Soft accent wash */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--accent)]/10 blur-3xl pointer-events-none" />

                {/* Top bar */}
                <div className="relative z-10 p-5 sm:p-6 flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] text-[11px] font-bold text-white shadow-sm">
                      I
                    </span>
                    <div>
                      <p className="text-xs font-display font-bold tracking-tight text-[var(--text-primary)]">
                        IHI VERIFIED
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        Innovative Hack Intelligence
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[8px] text-[var(--text-muted)] uppercase tracking-widest">
                      Certificate ID
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-text)] transition-colors"
                      title="Copy ID"
                    >
                      {copied ? "Copied ✓" : mine.certificate_id}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="relative z-10 px-5 sm:px-8 text-center space-y-3 flex-1 flex flex-col justify-center">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--accent-text)]">
                    Certificate of Participation
                  </p>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Presented to
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">
                      {mine.participant_name}
                    </h2>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      For the project
                    </p>
                    <p className="text-body-md font-semibold text-[var(--text-secondary)]">
                      “{mine.project_title}”
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {mine.team_name}
                      {mine.track ? ` · ${mine.track}` : ""}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Final standing
                    </p>
                    <p className="font-mono text-heading-sm font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                      #{mine.rank}
                      <span className="text-body-sm font-normal text-[var(--text-muted)] ml-2">
                        · {mine.score} / 10
                      </span>
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 p-5 sm:p-6 flex justify-between items-end border-t border-[var(--border-default)]/60 bg-[var(--surface-bg)]/50">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Event
                    </p>
                    <p className="text-xs font-medium text-[var(--text-primary)]">
                      {mine.event_name}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">
                      {mine.issued_at}
                    </p>
                  </div>
                  <StatusBadge status="good" label="Verified" size="sm" />
                </div>
              </Card>
            </motion.div>
          )}

          <Button
            onClick={handleDownload}
            loading={downloading}
            className="w-full"
            size="lg"
            icon={<DownloadIcon />}
            disabled={!mine}
          >
            Download PDF Certificate
          </Button>

          <p className="text-xs text-center text-[var(--text-muted)] leading-relaxed">
            This certificate is permanently tied to your IHI account and can be
            verified by ID. Share it on LinkedIn or your portfolio.
          </p>
        </div>

        {/* ======================================================================
            RIGHT: LEADERBOARD
            ====================================================================== */}
        <div className="xl:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-label text-[var(--text-muted)]">Global Leaderboard</h3>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {board.length} ranked
            </span>
          </div>

          <Card padding="none" variant="default" className="overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--border-default)] bg-[var(--surface-bg)] text-label text-[var(--text-muted)]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Project</div>
              <div className="col-span-3">Track</div>
              <div className="col-span-3 text-right">Score</div>
            </div>

            <ul className="divide-y divide-[var(--border-default)]">
              {/* Your row pinned first if present */}
              {mine && (
                <li
                  className={clsx(
                    "grid grid-cols-12 gap-3 px-5 py-4 items-center",
                    "bg-[var(--accent-subtle)] border-l-4 border-l-[var(--accent)]"
                  )}
                >
                  <div className="col-span-2 sm:col-span-1 text-center font-mono font-bold text-[var(--accent-text)]">
                    #{mine.rank}
                  </div>
                  <div className="col-span-6 sm:col-span-5 min-w-0">
                    <p className="text-body-sm font-bold text-[var(--text-primary)] truncate">
                      {mine.project_title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">Your team · {mine.team_name}</p>
                  </div>
                  <div className="hidden sm:flex sm:col-span-3">
                    {mine.track && (
                      <span className="px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--accent)]/30 text-[10px] text-[var(--accent-text)] font-mono">
                        {mine.track}
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-right font-mono font-bold text-[var(--text-primary)] tabular-nums">
                    {mine.score}
                    <span className="text-[var(--text-muted)] font-normal text-xs"> / 10</span>
                  </div>
                </li>
              )}

              {board
                .filter((e) => !e.is_mine)
                .map((item, index) => (
                  <motion.li
                    key={item.submission_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 * Math.min(index, 8),
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-[var(--surface-bg)] transition-colors"
                  >
                    <div className="col-span-2 sm:col-span-1 text-center">
                      <span
                        className={clsx(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold",
                          item.rank === 1 && "bg-[var(--accent)] text-white",
                          item.rank === 2 &&
                            "bg-[var(--surface-bg)] border border-[var(--border-strong)] text-[var(--text-primary)]",
                          item.rank === 3 &&
                            "bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-secondary)]",
                          item.rank > 3 && "text-[var(--text-secondary)]"
                        )}
                      >
                        {item.rank}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-5 min-w-0">
                      <p className="text-body-sm font-semibold text-[var(--text-primary)] truncate">
                        {item.project_title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{item.team_name}</p>
                    </div>
                    <div className="hidden sm:flex sm:col-span-3">
                      {item.track && (
                        <span className="px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-default)] text-[10px] text-[var(--text-secondary)] font-mono">
                          {item.track}
                        </span>
                      )}
                    </div>
                    <div className="col-span-4 sm:col-span-3 text-right font-mono font-bold text-[var(--text-primary)] tabular-nums">
                      {item.final_average_score}
                      <span className="text-[var(--text-muted)] font-normal text-xs"> / 10</span>
                    </div>
                  </motion.li>
                ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ICONS
   ========================================================================== */

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 11v1.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5V11m6-9v8m0 0l-3-3m3 3l3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}