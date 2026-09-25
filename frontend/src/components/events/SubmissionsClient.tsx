'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { GridBackground } from '@/components/dashboard/GridBackground';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { organizerNavigation } from '@/components/layout/navigation';
import { getAuthSession, type UserProfile } from '@/lib/auth';
import {
  submissionsAPI,
  type SubmissionRow,
  type SubmissionStatus,
  type SubmissionsPayload,
} from '@/lib/api';

function formatClock(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

function formatWhen(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusStyles(status: SubmissionStatus) {
  switch (status) {
    case 'submitted':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'draft':
      return 'bg-amber-50 border-amber-200 text-amber-800';
    default:
      return 'bg-red-50 border-red-200 text-red-700';
  }
}

function statusLabel(status: SubmissionStatus) {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'draft':
      return 'Draft';
    default:
      return 'Missing';
  }
}

export function SubmissionsClient({ eventId }: { eventId: string }) {
  const [user, setUser] = useState<UserProfile>({
    name: 'Organizer',
    email: 'organizer@platform.com',
  });

  const [data, setData] = useState<SubmissionsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locking, setLocking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | SubmissionStatus>('All');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const session = getAuthSession();
    if (session?.name) setUser(session);
  }, []);

  // Tick every second for deadline countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await submissionsAPI.get(eventId);
      setData(payload);
    } catch (e: any) {
      setData(null);
      setError(e?.message || 'Could not load submissions');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const secondsLeft = useMemo(() => {
    if (!data?.deadlineAt) return null;
    const end = new Date(data.deadlineAt).getTime();
    if (Number.isNaN(end)) return null;
    return Math.floor((end - now) / 1000);
  }, [data?.deadlineAt, now]);

  const rows: SubmissionRow[] = data?.submissions ?? [];

  const filtered = rows.filter((row) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      row.teamName.toLowerCase().includes(q) ||
      (row.track || '').toLowerCase().includes(q) ||
      (row.title || '').toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = data?.stats ?? {
    totalTeams: 0,
    submitted: 0,
    drafts: 0,
    missing: 0,
  };

  const handleLock = async () => {
    if (
      !confirm(
        'Lock submissions for this event? Participants will no longer be able to edit.'
      )
    ) {
      return;
    }
    setLocking(true);
    try {
      await submissionsAPI.lock(eventId);
      await load();
    } catch (e: any) {
      alert(e?.message || 'Failed to lock submissions');
    } finally {
      setLocking(false);
    }
  };

  const openRepo = (url?: string | null) => {
    if (!url) return;
    const href = url.startsWith('http') ? url : `https://${url}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen bg-[#F9F9F6]">
      <GridBackground />

      <DashboardShell
        role="organizer"
        userName={user.name}
        userEmail={user.email}
        eventName={user.eventName || 'Event Console'}
        navigation={organizerNavigation}
      >
        <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6E5E0] pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6A24A] font-bold">
                Event ID: {eventId}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight mt-1">
                Submissions
              </h1>
              <p className="text-xs text-[#706F6B] mt-1 font-sans">
                Live project pipeline — data from participant submissions.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {secondsLeft !== null && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm ${
                    secondsLeft <= 0
                      ? 'border-[#E6E5E0] bg-[#FAF9F5] text-[#706F6B]'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {secondsLeft > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                    </span>
                  )}
                  <span className="font-mono text-sm font-bold tracking-tight">
                    {secondsLeft <= 0 ? '00:00:00' : formatClock(secondsLeft)}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                    {secondsLeft <= 0 ? 'Closed' : 'Remaining'}
                  </span>
                </div>
              )}

              <button
                onClick={() => load()}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6E5E0] bg-white hover:bg-[#FAF9F5] text-xs font-mono font-bold text-[#0A0A0A] transition-all disabled:opacity-50"
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>

              <button
                onClick={handleLock}
                disabled={locking || loading}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6E5E0] bg-[#0A0A0A] hover:bg-[#C6A24A] text-white text-xs font-mono font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {locking ? 'Locking…' : 'Lock Submissions'}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-mono">
              <strong className="font-bold">Could not load live data:</strong>{' '}
              {error}
              <button
                onClick={() => load()}
                className="ml-3 underline font-bold hover:text-red-950"
              >
                Retry
              </button>
            </div>
          )}

          {/* Metrics — real stats only */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Teams"
              value={loading && !data ? '—' : String(stats.totalTeams)}
              accent="neutral"
            />
            <MetricCard
              label="Final Submitted"
              value={loading && !data ? '—' : String(stats.submitted)}
              accent="success"
              helper={
                stats.totalTeams
                  ? `${Math.round((stats.submitted / stats.totalTeams) * 100)}% of teams`
                  : undefined
              }
            />
            <MetricCard
              label="Drafts Saved"
              value={loading && !data ? '—' : String(stats.drafts)}
              accent="warning"
            />
            <MetricCard
              label="Missing"
              value={loading && !data ? '—' : String(stats.missing)}
              accent="critical"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E6E5E0] shadow-sm">
            <div className="relative w-full sm:w-80">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706F6B]"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M14 14l-3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search team, track, or title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E6E5E0] bg-[#FAF9F5] text-xs text-[#0A0A0A] placeholder:text-[#706F6B] focus:outline-none focus:border-[#C6A24A] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {(['All', 'submitted', 'draft', 'missing'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-[#0A0A0A] text-white shadow-sm'
                      : 'bg-white border border-[#E6E5E0] text-[#706F6B] hover:border-[#C6A24A]/50 hover:text-[#0A0A0A]'
                  }`}
                >
                  {status === 'All' ? 'All' : statusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#E6E5E0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0EFEA] bg-[#FAF9F5]">
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">
                      Team
                    </th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">
                      Status
                    </th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">
                      Repo
                    </th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">
                      Last saved
                    </th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {loading && !data ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <p className="font-mono text-xs text-[#706F6B]">
                          Loading live submissions…
                        </p>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filtered.length > 0 ? (
                        filtered.map((row, i) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, delay: i * 0.03 }}
                            className="group hover:bg-[#FAF9F5] transition-colors"
                          >
                            <td className="px-5 py-4">
                              <p className="font-serif font-bold text-sm text-[#0A0A0A] group-hover:text-[#C6A24A] transition-colors">
                                {row.teamName}
                              </p>
                              <p className="font-mono text-[9px] text-[#706F6B] mt-0.5">
                                {[row.track, row.title].filter(Boolean).join(' · ') ||
                                  '—'}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${statusStyles(
                                  row.status
                                )}`}
                              >
                                {statusLabel(row.status)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {row.repoUrl ? (
                                <button
                                  onClick={() => openRepo(row.repoUrl)}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0A0A0A] hover:text-[#C6A24A] underline decoration-[#E6E5E0] underline-offset-4"
                                >
                                  View Repo
                                </button>
                              ) : (
                                <span className="text-[11px] font-mono text-[#706F6B]">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 font-mono text-[10px] text-[#706F6B]">
                              {formatWhen(row.lastSavedAt || row.submittedAt)}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                disabled={row.status === 'missing'}
                                onClick={() => openRepo(row.demoUrl || row.repoUrl)}
                                className="px-3 py-1.5 rounded border border-[#E6E5E0] bg-white text-[10px] font-mono font-bold text-[#0A0A0A] hover:bg-[#FAF9F5] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                View project
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="py-16 flex flex-col items-center justify-center text-center">
                              <h3 className="font-serif text-lg font-bold text-[#0A0A0A]">
                                {error
                                  ? 'No live data'
                                  : rows.length === 0
                                  ? 'No submissions yet'
                                  : 'No matches'}
                              </h3>
                              <p className="text-xs text-[#706F6B] mt-1 max-w-sm">
                                {rows.length === 0 && !error
                                  ? 'When participants submit projects, they will appear here automatically.'
                                  : 'Try clearing filters or refreshing.'}
                              </p>
                              {(searchQuery || statusFilter !== 'All') && (
                                <button
                                  onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('All');
                                  }}
                                  className="mt-4 px-3 py-1.5 rounded bg-[#FAF9F5] border border-[#E6E5E0] text-[10px] font-mono font-bold"
                                >
                                  Clear filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}