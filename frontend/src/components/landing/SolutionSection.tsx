"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { SOLUTION } from "@/lib/landing/content";
import { IsometricDecor } from "./IsometricDecor";

/**
 * SolutionSection — World-Class State Machine & Pipeline Visualization
 * Shows how IHI treats hackathons as an audited, deterministic pipeline.
 */

// Pipeline stage definition for the interactive visualizer
const PIPELINE_STAGES = [
  { id: "reg", label: "Registration", gate: "Eligibility Gate", status: "CLEAN", color: "#3E6FF3" },
  { id: "team", label: "Team Formation", gate: "Skill Matcher", status: "LOCKED", color: "#3E6FF3" },
  { id: "sub", label: "Submission", gate: "Atomic Countdown", status: "VERIFIED", color: "#2FB67C" },
  { id: "ai", label: "AI Briefing", gate: "Repo Risk Scanner", status: "BRIEFED", color: "#C9A227" },
  { id: "judge", label: "Judging Queue", gate: "Rubric Parity", status: "SCORED", color: "#2FB67C" },
  { id: "pub", label: "Publish Results", gate: "Readiness Gate", status: "RELEASED", color: "#E4574C" },
];

function InteractivePipelineVisual() {
  const [activeStage, setActiveStage] = useState(2); // Default to Submission

  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 p-6 backdrop-blur-md md:p-8 shadow-sm">
      {/* Top console bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>IHI_PIPELINE // EVENT_STATE_MACHINE</span>
        </div>
        <span className="font-mono text-[11px] text-gray-500">
          Deterministic Readiness: <span className="font-bold text-emerald-600">100% AUDITABLE</span>
        </span>
      </div>

      {/* Interactive horizontal pipeline nodes */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isActive = idx === activeStage;
          const isPassed = idx < activeStage;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={clsx(
                "group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-300",
                isActive
                  ? "border-black bg-white shadow-md -translate-y-1 ring-2 ring-gold/40"
                  : isPassed
                  ? "border-gray-200 bg-white/60 hover:border-gray-300"
                  : "border-gray-200 bg-gray-100/50 opacity-60 hover:opacity-100"
              )}
            >
              {/* Stage Number & Status indicator */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-gray-400">
                  0{idx + 1}
                </span>
                <span
                  className={clsx(
                    "inline-flex rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase",
                    isPassed || isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {isPassed ? "PASS" : stage.status}
                </span>
              </div>

              {/* Title */}
              <div className="mt-4">
                <p className="font-display text-xs font-bold text-black group-hover:text-gold-dark">
                  {stage.label}
                </p>
                <p className="mt-1 font-mono text-[10px] text-gray-500 truncate">
                  {stage.gate}
                </p>
              </div>

              {/* Connector line on active */}
              {isActive && (
                <div className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail Panel */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4 font-mono text-xs text-gray-700">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white font-bold text-[10px]">
            0{activeStage + 1}
          </span>
          <div>
            <span className="font-bold text-black">
              {PIPELINE_STAGES[activeStage].label}:
            </span>{" "}
            <span className="text-gray-600">
              State transitions require clean data gates. No manual overrides allowed without audit trail.
            </span>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 font-mono text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
          GATE_STATUS: OK
        </div>
      </div>
    </div>
  );
}

export function SolutionSection({ className = "" }: { className?: string }) {
  const pillars = SOLUTION.pillars ?? [
    {
      title: "Deterministic gates",
      body: "Every stage transition is auditable, reversible, and explicitly gated.",
    },
    {
      title: "AI copilot",
      body: "Briefings surface technical risk signals before they become incidents.",
    },
    {
      title: "Judge-first UX",
      body: "Rubric parity enforced at the schema level, not by convention.",
    },
  ];

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className={clsx("relative overflow-hidden border-t border-gray-100 bg-white", className)}
    >
      <IsometricDecor variant="solution" className="opacity-90" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Top Narrative ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeInUp className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {SOLUTION.eyebrow ?? "The solution"}
            </div>

            <h2
              id="solution-heading"
              className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
            >
              {SOLUTION.heading ?? "One deterministic pipeline, end to end."}
            </h2>
          </FadeInUp>

          <FadeInUp className="lg:col-span-7 lg:pt-10">
            <p className="max-w-2xl font-body text-lg leading-relaxed text-gray-600 sm:text-xl">
              {SOLUTION.body ??
                "IHI models every event as a strict state machine: registration → team formation → submission → judging → publish. Each stage has explicit readiness gates. Nothing advances until the data underneath is clean."}
            </p>
          </FadeInUp>
        </div>

        {/* ── Interactive State Machine Pipeline Visual ── */}
        <FadeInUp>
          <InteractivePipelineVisual />
        </FadeInUp>

        {/* ── 3 Pillar Cards ── */}
        <StaggerContainer
          as="ul"
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
          staggerDelay={0.12}
        >
          {pillars.map((pillar, index) => (
            <StaggerItem key={pillar.title} as="li">
              <article
                className={clsx(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8",
                  "shadow-[0_1px_0_rgba(0,0,0,0.04)]",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
                )}
              >
                {/* Top color indicator */}
                <div
                  className={clsx(
                    "absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
                    index === 0 && "bg-emerald-500",
                    index === 1 && "bg-gold",
                    index === 2 && "bg-blue-600"
                  )}
                />

                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-gray-400">
                    PILLAR // 0{index + 1}
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      index === 0 && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      index === 1 && "bg-gold/10 text-gold-dark border-gold/30",
                      index === 2 && "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {index === 0 && "GATED"}
                    {index === 1 && "INTELLIGENCE"}
                    {index === 2 && "PARITY"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-black">
                  {pillar.title}
                </h3>

                {/* Body */}
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-gray-600">
                  {pillar.body}
                </p>

                {/* Bottom status */}
                <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 font-mono text-[10px] font-semibold text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>
                    {index === 0 && "Audit trail: APPEND_ONLY"}
                    {index === 1 && "Backend: FASTAPI_LLM"}
                    {index === 2 && "Schema: LOCKED"}
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}