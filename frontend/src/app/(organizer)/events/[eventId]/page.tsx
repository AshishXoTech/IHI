"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Trophy,
  Users,
  Code2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  LayoutDashboard,
  Award,
  BarChart3,
  FileText,
  UserPlus,
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

export default function EventOverviewPage() {
  const routeParams = useParams();
  const rawEventId = (routeParams?.eventId as string) || "nexhack-2.0";
  // Format readable title (e.g. nexhack-2.0 -> NEXHACK 2.0)
  const eventTitle = rawEventId.replace(/-/g, " ").toUpperCase();

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

      {/* Floating Shapes */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="pointer-events-none absolute top-12 right-12 z-0 hidden lg:block h-16 w-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        variants={floatVariantsReverse}
        animate="animate"
        className="pointer-events-none absolute bottom-24 left-12 z-0 hidden lg:block h-14 w-14 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-white p-2"
      >
        <div className="h-full w-full rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Top Eyebrow & Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              ← Home
            </Link>
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              EVENT HUB · {rawEventId.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/events/${rawEventId}/dashboard`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <LayoutDashboard className="h-4 w-4" /> Organizer Dashboard
            </Link>
          </div>
        </div>

        {/* Display Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-emerald-100 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-900 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> LIVE · HACKING IN PROGRESS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase">
            {eventTitle} <span className="text-[var(--organizer-gold-deep)]">HUB.</span>
          </h1>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)] max-w-2xl">
            Autonomous intelligence & high-throughput hackathon execution environment.
          </p>
        </div>

        {/* Event Stats Bar */}
        <div
          className="mb-8 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
          style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Prize Pool
              </p>
              <p className="text-3xl font-black font-mono mt-1 text-[var(--organizer-gold-deep)]">$50,000</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Registered Hackers
              </p>
              <p className="text-3xl font-black font-mono mt-1">342</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Teams Active
              </p>
              <p className="text-3xl font-black font-mono mt-1">86</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Submissions Gate
              </p>
              <p className="text-3xl font-black font-mono mt-1">OPEN</p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)]">
                <LayoutDashboard className="h-5 w-5 text-[var(--organizer-gold-deep)]" />
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-tight">
                Console Dashboard
              </h3>
            </div>
            <p className="text-xs font-mono text-[var(--organizer-ink-muted)] mb-4">
              Monitor live analytics, real-time submission feeds, and team velocity health.
            </p>
            <Link
              href={`/events/${rawEventId}/dashboard`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              Open Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)]">
                <BarChart3 className="h-5 w-5 text-[var(--organizer-gold-deep)]" />
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-tight">
                Rubric Builder
              </h3>
            </div>
            <p className="text-xs font-mono text-[var(--organizer-ink-muted)] mb-4">
              Configure criterion weights, scoring scales, and API validation bounds.
            </p>
            <Link
              href={`/events/${rawEventId}/judging/rubric`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              Edit Rubric <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-1"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)]">
                <Award className="h-5 w-5 text-[var(--organizer-gold-deep)]" />
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-tight">
                Event Results
              </h3>
            </div>
            <p className="text-xs font-mono text-[var(--organizer-ink-muted)] mb-4">
              Review immutable scores, monitor judge completions, and publish leaderboards.
            </p>
            <Link
              href={`/events/${rawEventId}/results`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              View Results <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Participant CTAs */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-8 sm:p-10"
          style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                PARTICIPANT ACTIONS
              </span>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight">
                Ready to Submit Your Project?
              </h3>
              <p className="text-xs font-mono text-[var(--organizer-ink-secondary)]">
                Submit repo links, demo videos, and technical documentation before the hard countdown deadline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
              >
                <Users className="h-4 w-4" /> Find Team
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
              >
                <Code2 className="h-4 w-4" /> Submit Entry
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}