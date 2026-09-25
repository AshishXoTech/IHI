'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { GridBackground } from '@/components/dashboard/GridBackground';
import { CommandKModal } from '@/components/dashboard/CommandKModal';
import { AssignJudgesModal } from '@/components/dashboard/AssignJudgesModal';
import { organizerNavigation } from '@/components/layout/navigation';
import { dashboardAPI } from '@/lib/api';
import { getAuthSession, type UserProfile } from '@/lib/auth';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

const ALL_ACTIVITIES = [
  { id: 1, title: 'New submission', desc: 'Team Nebula uploaded "AI Study Assistant"', time: '2m ago', type: 'submission' as const },
  { id: 2, title: 'Judge scored', desc: 'Dr. Rao marked 4 project rubrics', time: '8m ago', type: 'score' as const },
  { id: 3, title: 'Team formed', desc: 'Team Quantum reached maximum allocation (4 members)', time: '12m ago', type: 'team' as const },
  { id: 4, title: 'Hacker verified', desc: '23 international travel grants checked and updated', time: '18m ago', type: 'verified' as const },
];

export function OrganizerDashboardClient() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [commandKOpen, setCommandKOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState<'all' | 'submission' | 'score' | 'team'>('all');
  
  // Real User Session State (Loads from Login / Signup)
  const [user, setUser] = useState<UserProfile>({
    name: 'Organizer',
    email: 'organizer@platform.com',
    eventName: 'Stanford TreeHacks 2025',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [metrics, setMetrics] = useState({
    registrations: 1247,
    teams: 284,
    submissions: 196,
    judging: 72,
  });

  // 1. Load User Session on Mount
  useEffect(() => {
    const session = getAuthSession();
    if (session && session.name) {
      setUser(session);
    }
  }, []);

  // 2. Real-Time Clock
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Fetch Dashboard Metrics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardAPI.getMetrics() as {
          metrics?: Partial<typeof metrics>;
        };
        if (data?.metrics) {
          setMetrics((current) => ({ ...current, ...data.metrics }));
        }
      } catch (error) {
        // Fallback to initial local state
      }
    };
    fetchDashboardData();
  }, []);

  // 4. Keyboard Shortcut Listener (⌘K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandKOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // 5. CSV Export Action
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await dashboardAPI.exportData().catch(() => new Promise((res) => setTimeout(res, 800)));
      const csvContent = 'Metric,Value\nRegistrations,1247\nTeams Formed,284\nSubmissions,196';
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `IHI_Dashboard_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredActivities = ALL_ACTIVITIES.filter(
    (item) => feedFilter === 'all' || item.type === feedFilter
  );

  // Extract first name for greeting (e.g. "Ashish Kumar Jha" -> "Ashish")
  const firstName = user.name ? user.name.trim().split(' ')[0] : 'Organizer';

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      <CommandKModal isOpen={commandKOpen} onClose={() => setCommandKOpen(false)} />
      <AssignJudgesModal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} />

      <DashboardShell
        role="organizer"
        userName={user.name}
        userEmail={user.email}
        eventName={user.eventName || 'Stanford TreeHacks 2025'}
        navigation={organizerNavigation}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandKOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E6E5E0] bg-white hover:bg-[#FAF9F5] text-xs font-mono font-bold text-[#706F6B] transition-all shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="px-1.5 py-0.5 rounded border border-[#E6E5E0] text-[9px] bg-[#FAF9F5]">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => router.push('/events/new')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#0A0A0A] hover:bg-[#C6A24A] text-white shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
            >
              <PlusIcon />
              New Event
            </button>
          </div>
        }
      >
        <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Greeting (Dynamic First Name) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6E5E0] pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6A24A] font-bold">
                Command Center
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight mt-1">
                Welcome back, {firstName}
              </h1>
              <p className="text-xs text-[#706F6B] mt-1 font-sans">
                Here's the live pulse of your active intelligence streams.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentTime && (
                <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E6E5E0] bg-white font-mono text-[11px] text-[#2C2C2A] shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A24A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A24A]" />
                  </span>
                  {currentTime}
                </div>
              )}
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6E5E0] bg-white hover:bg-[#FAF9F5] text-xs font-mono font-bold text-[#0A0A0A] transition-all disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={staggerItem}>
              <MetricCard
                label="Registrations"
                value={metrics.registrations.toLocaleString()}
                delta={{ value: 12, trend: 'up' }}
                accent="primary"
                sparkline={[100, 120, 115, 140, 135, 180, 220, 240, 260]}
                helper="vs. last 24h interval"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <MetricCard
                label="Teams Formed"
                value={metrics.teams.toLocaleString()}
                delta={{ value: 8, trend: 'up' }}
                accent="secondary"
                sparkline={[20, 25, 30, 35, 45, 55, 70, 85, 95]}
                helper="86% completion threshold"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <MetricCard
                label="Submissions"
                value={metrics.submissions.toLocaleString()}
                delta={{ value: 24, trend: 'up' }}
                accent="success"
                sparkline={[5, 10, 15, 25, 40, 60, 90, 140, 196]}
                helper="of 284 teams expected"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <MetricCard
                label="Judging Progress"
                value={`${metrics.judging}%`}
                delta={{ value: 5, trend: 'up' }}
                accent="warning"
                sparkline={[20, 35, 42, 50, 58, 65, 72]}
                helper="42 of 58 panels completed"
              />
            </motion.div>
          </motion.div>

          {/* Core Display Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard
              title="Registration Health"
              eyebrow="Real-Time Streams"
              className="lg:col-span-2"
              actions={
                <button className="text-xs font-mono font-bold text-[#C6A24A] hover:text-[#A07F32] transition-colors">
                  View Details →
                </button>
              }
            >
              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Verified', value: '1,189', color: 'border-emerald-100 text-emerald-800 bg-emerald-50/50' },
                  { label: 'Pending', value: '42', color: 'border-amber-100 text-amber-800 bg-amber-50/50' },
                  { label: 'Blocked', value: '16', color: 'border-red-100 text-red-800 bg-red-50/50' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-lg border p-3 bg-white hover:shadow-sm transition-all ${s.color}`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-80">
                      {s.label}
                    </span>
                    <p className="mt-1 font-serif text-xl font-black tabular-nums">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-6">
                <span className="font-mono text-[10px] text-[#706F6B] block uppercase tracking-wider">
                  Demographic Distribution
                </span>
                {['MIT', 'Stanford', 'CMU', 'Berkeley'].map((school, i) => {
                  const count = [312, 278, 189, 156][i];
                  const pct = (count / 1247) * 100;
                  return (
                    <div key={school} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#0A0A0A] font-medium">{school}</span>
                        <span className="text-[#706F6B]">{count} applicants</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#F0EFEA]">
                        <motion.div
                          className="h-full rounded-full bg-[#C6A24A]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Publish Readiness" eyebrow="Gate Check">
              <div className="flex flex-col items-center py-1">
                <ProgressRing value={87} label="87%" sublabel="Launch Ready" />

                <div className="mt-5 w-full space-y-2 border-t border-[#F0EFEA] pt-4">
                  {[
                    { label: 'Judging matrix complete', done: true },
                    { label: 'Rubric structures locked', done: true },
                    { label: 'Conflict flags cleared', done: true },
                    { label: 'Final winners confirmed', done: false },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2.5 text-xs text-[#2C2C2A]">
                      <span
                        className={
                          c.done
                            ? 'flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#F7F3E3] text-[#A07F32] font-bold text-[10px]'
                            : 'flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#E6E5E0] text-[#706F6B] text-[10px]'
                        }
                      >
                        {c.done ? '✓' : '○'}
                      </span>
                      <span className={c.done ? 'text-[#0A0A0A] font-medium' : 'text-[#706F6B]'}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Activity Feed + AI Briefing */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard
              title="Live Event Activity"
              eyebrow="Activity Stream"
              actions={
                <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-lg border border-[#E6E5E0]">
                  {(['all', 'submission', 'score', 'team'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFeedFilter(filter)}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold capitalize transition-all ${
                        feedFilter === filter
                          ? 'bg-[#0A0A0A] text-white'
                          : 'text-[#706F6B] hover:text-[#0A0A0A]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {filteredActivities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-[#FAF9F5] border border-transparent hover:border-[#E6E5E0] transition-all duration-200"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[#F7F3E3] text-[#A07F32]">
                      <ActivityIcon type={a.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-serif font-bold text-[#0A0A0A]">{a.title}</p>
                      <p className="truncate text-xs text-[#706F6B] mt-0.5">{a.desc}</p>
                    </div>
                    <span className="flex-shrink-0 font-mono text-[9px] text-[#706F6B]">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Intelligence Briefing"
              eyebrow="Gemini Insights Engine"
              actions={
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="text-[10px] font-mono font-bold bg-[#FAF9F5] hover:bg-[#F7F3E3] text-[#706F6B] hover:text-[#A07F32] px-2.5 py-1 rounded-md border border-[#E6E5E0] hover:border-[#C6A24A]/40 transition-all"
                >
                  Recalculate
                </button>
              }
            >
              <div className="relative overflow-hidden rounded-xl border border-[#E6E5E0] bg-white p-4">
                <div className="absolute inset-y-0 left-0 w-[4px] bg-gradient-to-b from-[#C6A24A] to-[#A07F32]" />

                <div className="flex items-start gap-3 pl-1">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A] text-[#C6A24A]">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed text-[#2C2C2A] font-serif">
                      Submission velocity has elevated by{' '}
                      <strong className="text-[#C6A24A] font-bold">142%</strong> over the past 6
                      hours. We recommend assigning 2 additional judges to the{' '}
                      <span className="underline decoration-[#C6A24A] decoration-2 font-semibold text-[#0A0A0A]">
                        AI/ML track
                      </span>{' '}
                      to maintain consistent review metrics.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setAssignModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#C6A24A] text-white text-[10px] font-mono font-bold transition-all shadow-sm"
                      >
                        Assign Judges
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-[#E6E5E0] hover:bg-[#FAF9F5] text-[10px] font-mono font-bold text-[#706F6B] transition-all">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function ActivityIcon({
  type,
}: {
  type: 'submission' | 'score' | 'team' | 'verified';
}) {
  switch (type) {
    case 'submission':
      return (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 2h5l3 3v7H3V2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 2v3h3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'score':
      return (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 2l1.2 2.4L11 5l-2 2 .5 2.8L7 8.8 4.5 9.8 5 7 3 5l2.8-.6L7 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'team':
      return (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 12c0-1.7 1.3-3 3-3s3 1.3 3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'verified':
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 7l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}