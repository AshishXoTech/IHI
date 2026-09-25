"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { RefreshCw, FileText, Lock, AlertCircle, Award, BarChart3, ArrowLeft } from "lucide-react";
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

export default function EventResultsPage() {
  const routeParams = useParams();
  const eventId = (routeParams?.eventId as string) || "1";
  const [isAuthenticated] = useState(true);

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
        className="pointer-events-none absolute bottom-24 right-24 z-0 hidden lg:block h-12 w-12 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-white p-2"
      >
        <div className="h-full w-full rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Top Eyebrow & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/events/${eventId}/dashboard`}
              className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              EVENTS / RESULTS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <FileText className="h-3.5 w-3.5" /> Audit log
            </button>
            <Link
              href={`/events/${eventId}/judging/rubric`}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Rubric
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Display Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase">
            EVENT <span className="text-[var(--organizer-gold-deep)]">RESULTS.</span>
          </h1>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)] max-w-3xl">
            Rankings computed server-side from immutable scores (rubric weights). Review before publishing.
          </p>
        </div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Authentication Alert */}
          {!isAuthenticated && (
            <motion.div
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-amber-50 p-4 flex items-center gap-3"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
                Authentication required.
              </span>
            </motion.div>
          )}

          {/* Scoring Completion Box */}
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 md:p-8"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Radial Completion Gauge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--organizer-border-light)] pb-6 md:pb-0 md:pr-6">
                <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-[var(--organizer-border)] bg-[var(--organizer-bg)]">
                  <div className="text-center">
                    <span className="block text-3xl font-black font-mono">0%</span>
                    <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                      COMPLETE
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Gates */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black font-display uppercase tracking-tight">
                      Scoring Completion
                    </h3>
                    <p className="text-xs font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                      0 / 0 submissions with ≥1 score
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 border-2 border-[var(--organizer-ink-primary)] bg-amber-100 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-amber-900">
                    <Lock className="h-3 w-3" /> Blocked — Incomplete Scoring
                  </span>
                </div>

                <p className="text-xs font-mono text-[var(--organizer-ink-secondary)] leading-relaxed">
                  Publish is structurally disabled until completion reaches 100% (every submission has at least one judge score). The server re-checks this gate on publish — the button alone is not the security boundary.
                </p>

                <div className="pt-2">
                  <button
                    disabled
                    className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-gray-200 px-6 py-3 text-xs font-bold font-mono uppercase tracking-wider text-gray-400 cursor-not-allowed opacity-60"
                    style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    <Award className="h-4 w-4" /> Publish Results
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Empty Leaderboard Card */}
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-12 text-center"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] mb-4">
              <Award className="h-8 w-8 text-[var(--organizer-gold-deep)]" />
            </div>
            <h3 className="text-lg font-black font-display uppercase tracking-tight mb-1">
              No Submissions To Rank Yet
            </h3>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)]">
              Once judges begin submitting evaluations, the live calculated leaderboard will render here.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}