"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  RefreshCw,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart3,
  Code2,
  ShieldCheck,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const floatVariants: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatVariantsReverse: Variants = {
  animate: {
    y: [0, 15, 0],
    rotate: [0, -5, 5, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function OrganizerDashboardPage() {
  const routeParams = useParams();
  const rawEventId = (routeParams?.eventId as string) || "nexhack-2.0";
  const eventTitle = rawEventId.replace(/-/g, " ").toUpperCase();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white pb-24 overflow-hidden p-6">
      {/* Blueprint Graph-Paper Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
        }}
      />

      {/* Floating Motion Shapes */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="pointer-events-none absolute top-12 right-12 z-0 hidden lg:block h-16 w-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        variants={floatVariantsReverse}
        animate="animate"
        className="pointer-events-none absolute bottom-24 right-24 z-0 hidden lg:block h-14 w-14 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-white p-2"
      >
        <div className="h-full w-full rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Main Shell Container */}
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Top Eyebrow & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              ORGANIZER CONSOLE · {rawEventId.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[var(--organizer-ink-primary)] bg-emerald-100 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Live Operations
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/events/${rawEventId}/results`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Award className="h-3.5 w-3.5" /> Results
            </Link>
            <Link
              href={`/events/${rawEventId}/judging/rubric`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Rubric
            </Link>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Header Display Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase">
            {eventTitle} <span className="text-[var(--organizer-gold-deep)]">DASHBOARD.</span>
          </h1>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)] max-w-3xl">
            Registration, team velocity, submission telemetry, judging progress, and publish readiness in one unified console.
          </p>
        </div>

        {/* FIXED Telemetry Banner: Uses gold shadow & gold-light background to avoid double-line overlap */}
        <div
          className="mb-8 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] p-4 flex items-center justify-between gap-4"
          style={{ boxShadow: "4px 4px 0px 0px var(--organizer-gold)" }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-[var(--organizer-gold-deep)] flex-shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-primary)]">
              Dashboard API connected — showing live demo metrics for {rawEventId}.
            </span>
          </div>
          <span className="hidden sm:inline-flex border border-[var(--organizer-ink-primary)] bg-white px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-primary)]">
            DEMO DATA MODE
          </span>
        </div>

        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top 3 Metric Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Registration Health */}
            <motion.div
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  REGISTRATION HEALTH
                </span>
                <span className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-emerald-100 px-2 py-0.5 text-[9px] font-bold font-mono uppercase text-emerald-900">
                  <CheckCircle2 className="h-3 w-3 text-emerald-700" /> GOOD
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight">387</span>
                  <span className="text-sm font-bold font-mono text-[var(--organizer-ink-muted)]">/ 500</span>
                </div>
                <p className="text-xs font-mono font-bold uppercase text-[var(--organizer-gold-deep)]">
                  77.4% capacity reached
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-3 w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-0.5">
                <div className="h-full bg-[var(--organizer-gold)]" style={{ width: "77.4%" }} />
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[var(--organizer-border-light)] flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                <span>113 Slots Remaining</span>
                <Link href={`/events/${rawEventId}/registrations`} className="hover:text-[var(--organizer-ink-primary)] flex items-center gap-0.5">
                  View Roster <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            {/* 2. Team Formation */}
            <motion.div
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  TEAM FORMATION
                </span>
                <span className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-amber-100 px-2 py-0.5 text-[9px] font-bold font-mono uppercase text-amber-900">
                  <AlertTriangle className="h-3 w-3 text-amber-700" /> ATTENTION
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight">82</span>
                  <span className="text-sm font-bold font-mono text-[var(--organizer-ink-muted)]">TEAMS</span>
                </div>
                <p className="text-xs font-mono font-bold uppercase text-[var(--organizer-ink-secondary)]">
                  375 participants matched in teams
                </p>
              </div>

              {/* Looking for Team Pool Chip */}
              <div className="mt-4 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] p-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono uppercase text-[var(--organizer-ink-muted)] flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" /> Unmatched Pool
                </span>
                <span className="text-xs font-black font-mono text-[var(--organizer-gold-deep)]">
                  12 Hackers
                </span>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[var(--organizer-border-light)] flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                <span>Avg. Size: 4.5 Hackers</span>
                <Link href={`/events/${rawEventId}/teams`} className="hover:text-[var(--organizer-ink-primary)] flex items-center gap-0.5">
                  Manage Teams <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            {/* 3. Submissions Telemetry */}
            <motion.div
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  SUBMISSIONS TELEMETRY
                </span>
                <span className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-amber-100 px-2 py-0.5 text-[9px] font-bold font-mono uppercase text-amber-900">
                  <Clock className="h-3 w-3 text-amber-700" /> IN PROGRESS
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight">54</span>
                  <span className="text-sm font-bold font-mono text-[var(--organizer-ink-muted)]">/ 82 FINALIZED</span>
                </div>
                <p className="text-xs font-mono font-bold uppercase text-emerald-700">
                  66% completion rate
                </p>
              </div>

              {/* Countdown Bar */}
              <div className="mt-4 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono uppercase text-[var(--organizer-ink-muted)] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-red-600 animate-spin" /> Countdown
                </span>
                <span className="text-xs font-black font-mono text-red-600 tracking-wider">
                  03:59:48
                </span>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[var(--organizer-border-light)] flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                <span>19 Drafts In Progress</span>
                <Link href={`/events/${rawEventId}/submissions`} className="hover:text-[var(--organizer-ink-primary)] flex items-center gap-0.5">
                  View Submissions <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

          </div>

          {/* Bottom Grid: Judging Progress & Publish Readiness Gate */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Judging Progress Card */}
            <motion.div
              variants={cardVariants}
              className="md:col-span-6 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between border-b-2 border-[var(--organizer-border-light)] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    EVALUATION PIPELINE
                  </span>
                  <h3 className="text-xl font-black font-display uppercase tracking-tight mt-0.5">
                    Judging Progress
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
                  MOCK DATA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center mb-6">
                <div>
                  <span className="text-5xl font-black font-mono tracking-tight text-[var(--organizer-gold-deep)]">
                    39%
                  </span>
                  <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-[var(--organizer-ink-muted)] mt-1">
                    Evaluations Completed
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[var(--organizer-border-light)] pl-4">
                  <div className="flex justify-between text-xs font-mono font-bold uppercase">
                    <span className="text-[var(--organizer-ink-muted)]">Assigned Judges:</span>
                    <span>12</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono font-bold uppercase">
                    <span className="text-[var(--organizer-ink-muted)]">Active Queue:</span>
                    <span>21 Submissions</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono font-bold uppercase">
                    <span className="text-[var(--organizer-ink-muted)]">Avg Score:</span>
                    <span>8.4 / 10</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/events/${rawEventId}/judging`}
                className="w-full inline-flex items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
                style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
              >
                <Code2 className="h-4 w-4" /> Manage Judge Assignments
              </Link>
            </motion.div>

            {/* Publish Readiness Gate */}
            <motion.div
              variants={cardVariants}
              className="md:col-span-6 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between border-b-2 border-[var(--organizer-border-light)] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    SECURITY & INTEGRITY GATE
                  </span>
                  <h3 className="text-xl font-black font-display uppercase tracking-tight mt-0.5">
                    Publish Readiness
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-red-100 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-red-900">
                  <Lock className="h-3 w-3 text-red-700" /> BLOCKED
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                  <span>1 / 4 Gates Passed — Registration threshold met</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>Gate 2 — Submissions pending window close</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>Gate 3 — Judging progress incomplete (39% / 100%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>Gate 4 — Leaderboard verification awaiting publish</span>
                </div>
              </div>

              <Link
                href={`/events/${rawEventId}/results`}
                className="w-full inline-flex items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
                style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
              >
                <Sparkles className="h-4 w-4" /> Go to Publish Gate
              </Link>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}