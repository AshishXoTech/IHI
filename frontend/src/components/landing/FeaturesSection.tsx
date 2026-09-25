"use client";

import React from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { FEATURES } from "@/lib/landing/content";
import { IsometricDecor } from "./IsometricDecor";

/**
 * FeaturesSection — World-Class Bento Grid Layout
 * Replaces generic bullet cards with purpose-built UI widgets per feature.
 */

// Custom interactive visual preview widgets inside each Bento Box
function FeatureWidget({ index }: { index: number }) {
  if (index === 0) {
    // AI-Powered Submission Briefings
    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 p-3.5 font-mono text-[11px] text-gray-300 shadow-inner">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-gray-500">
          <span className="flex items-center gap-1.5 text-gold-light font-bold">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            IHI_AI_BRIEFING // REPO_SCAN
          </span>
          <span className="text-[9px] uppercase tracking-wider text-gray-500">FastAPI + Python</span>
        </div>
        <div className="mt-2.5 space-y-1.5 text-[10px]">
          <div className="flex justify-between">
            <span className="text-gray-400">Target: github.com/team-alpha/ihi-app</span>
            <span className="text-emerald-400 font-bold">PASS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duplicate Code Risk:</span>
            <span className="text-gray-200">1.2% (Low)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Commit Velocity:</span>
            <span className="text-gold-light">48 commits / 24h</span>
          </div>
        </div>
        <div className="mt-2.5 rounded bg-gray-900 px-2 py-1 text-[9px] text-gray-400 border border-gray-800">
          <span className="text-gold-light font-bold">SUMMARY:</span> Clean original architecture. Full stack Next.js + FastAPI.
        </div>
      </div>
    );
  }

  if (index === 1) {
    // Weighted Rubric Parity
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-gray-800">Technical Execution</span>
          <span className="font-bold text-gold-dark">40% Weight</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-gold rounded-full w-[85%]" />
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="font-bold text-gray-800">Innovation & Impact</span>
          <span className="font-bold text-blue-600">35% Weight</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full w-[70%]" />
        </div>
      </div>
    );
  }

  if (index === 2) {
    // Team Discovery Pool
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-2">
          <span>TEAM_DISCOVERY</span>
          <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">4 LOOKING</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">TS</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black ring-2 ring-white">PY</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">UX</span>
          </div>
          <span className="font-body text-xs font-medium text-gray-600">Match score: <strong className="text-black">98%</strong></span>
        </div>
      </div>
    );
  }

  if (index === 3) {
    // Realtime Signals
    return (
      <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-xs">
        <div>
          <div className="text-[10px] text-gray-400 uppercase">Active Submissions</div>
          <div className="font-display text-lg font-bold text-black">196 / 200</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase">Countdown</div>
          <div className="font-mono text-xs font-bold text-red-600 animate-pulse">00:14:32</div>
        </div>
      </div>
    );
  }

  if (index === 4) {
    // Append-Only Audit Trail
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 font-mono text-[10px] space-y-1.5 text-gray-600">
        <div className="flex justify-between items-center text-gray-400 pb-1 border-b border-gray-100">
          <span>AUDIT_LOG_APPEND</span>
          <span className="text-emerald-600 font-bold">IMMUTABLE</span>
        </div>
        <div className="truncate"><span className="text-gray-400">hash:</span> 0x9f8b...3e2a</div>
        <div className="truncate"><span className="text-gray-400">action:</span> SCORE_SUBMITTED [Judge #14]</div>
      </div>
    );
  }

  // index 5 — Magic Link Auth
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/5 p-3 font-mono text-xs text-gray-800">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold text-black font-bold">⚡</span>
      <div className="flex-1 truncate">
        <div className="font-bold text-[11px] text-black">Passwordless Magic Auth</div>
        <div className="text-[10px] text-gray-500 truncate">ihi_session // HTTP-only cookie</div>
      </div>
    </div>
  );
}

export function FeaturesSection({ className = "" }: { className?: string }) {
  const cards = FEATURES.cards ?? [
    {
      title: "AI-Powered Submission Briefings",
      body: "FastAPI intelligence automatically scans submitted GitHub repositories, analyzing commit velocity, tech stack, and duplicate risk before judges even open the project.",
    },
    {
      title: "Weighted Rubric Schema Parity",
      body: "Enforce exact criterion weights and score ranges at the schema level. Eliminates judge unit drift across AI, Web3, and Open Track categories.",
    },
    {
      title: "Skill-Based Team Discovery",
      body: "Participant discovery pool with moderated join requests and skill tags. Prevents solo-builder drop-offs before submission cutoff.",
    },
    {
      title: "Atomic Submission Gates",
      body: "Server-authoritative countdowns and readiness checks. Late writes are rejected atomically so deadlines remain strictly defensible.",
    },
    {
      title: "Append-Only Audit Logging",
      body: "Scores and correction requests are permanently tracked in append-only tables. Full transparency for post-event verification and dispute resolution.",
    },
    {
      title: "Passwordless Magic Auth for Judges",
      body: "Judges receive secure, event-scoped magic links via email. Zero password fatigue, instant access directly into their scoring queue.",
    },
  ];

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={clsx("relative overflow-hidden border-t border-gray-100 bg-white", className)}
    >
      <IsometricDecor variant="features" className="opacity-20" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Section Header ── */}
        <FadeInUp className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-dark">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {FEATURES.eyebrow ?? "Platform capabilities"}
          </div>

          <h2
            id="features-heading"
            className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
          >
            {FEATURES.heading ?? "Built for operators. Tuned for participants."}
          </h2>

          <p className="mt-4 font-body text-lg text-gray-600 leading-relaxed">
            {FEATURES.body ??
              "Every feature maps to a real hackathon failure mode. Zero generic project-management abstractions."}
          </p>
        </FadeInUp>

        {/* ── Bento Grid ── */}
        <StaggerContainer
          as="div"
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.08}
        >
          {cards.map((card, i) => {
            // Give Feature #0 (AI Briefings) a wider span on desktop for Bento emphasis
            const isFeatured = i === 0;

            return (
              <StaggerItem
                key={card.title}
                as="div"
                className={clsx(
                  isFeatured && "lg:col-span-2",
                  "flex"
                )}
              >
                <div
                  className={clsx(
                    "group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8",
                    "shadow-[0_1px_0_rgba(0,0,0,0.04)]",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1 hover:border-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
                  )}
                >
                  {/* Subtle top indicator */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      FEATURE // 0{i + 1}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-md">
                      {i === 0 ? "AI NATIVE" : i === 1 ? "PRECISION" : i === 2 ? "DISCOVERY" : i === 3 ? "ATOMIC" : i === 4 ? "AUDITED" : "MAGIC AUTH"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="mt-5 flex-1">
                    <h3 className="font-display text-xl font-bold tracking-tight text-black group-hover:text-black">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 font-body text-sm text-gray-600 leading-relaxed">
                      {card.body}
                    </p>
                  </div>

                  {/* Purpose-built visual UI widget */}
                  <FeatureWidget index={i} />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}