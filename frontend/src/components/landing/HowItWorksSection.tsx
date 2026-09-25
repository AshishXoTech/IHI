"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { HOW_IT_WORKS } from "@/lib/landing/content";
import { IsometricDecor } from "./IsometricDecor";

/**
 * HowItWorksSection — Connected 5-Stage Deterministic Pipeline
 * Visualizes the complete hackathon lifecycle from setup to podium.
 */

export function HowItWorksSection({ className = "" }: { className?: string }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const defaultSteps = [
    {
      n: "01",
      title: "Configure event",
      body: "Spin up rubrics, tracks, timeline, and eligibility gates with AI-guided templates.",
      gate: "GATE // RUBRIC_LOCKED",
    },
    {
      n: "02",
      title: "Open registration",
      body: "Live registration counts, drop-off signals, and automated eligibility validation.",
      gate: "GATE // ELIGIBILITY_PASS",
    },
    {
      n: "03",
      title: "Form teams",
      body: "Skill-based participant discovery pool with moderated join-request workflows.",
      gate: "GATE // TEAM_LOCKED",
    },
    {
      n: "04",
      title: "Judge submissions",
      body: "Rubric-locked scoring queue backed by FastAPI repository technical briefings.",
      gate: "GATE // SCORED_AUDITED",
    },
    {
      n: "05",
      title: "Publish results",
      body: "Readiness-gated single-click release. Zero spreadsheet reconciliation chaos.",
      gate: "RELEASE // PODIUM_READY",
    },
  ];

  const steps = HOW_IT_WORKS.steps
    ? HOW_IT_WORKS.steps.map((s, idx) => ({
        n: s.n || `0${idx + 1}`,
        title: s.title,
        body: s.body,
        gate: defaultSteps[idx]?.gate || "GATE // AUDITED",
      }))
    : defaultSteps;

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={clsx("relative overflow-hidden border-t border-gray-100 bg-white", className)}
    >
      <IsometricDecor variant="how" className="opacity-80" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Section Header ── */}
        <FadeInUp className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-dark">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {HOW_IT_WORKS.eyebrow ?? "Deterministic timeline"}
          </div>

          <h2
            id="how-it-works-heading"
            className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
          >
            {HOW_IT_WORKS.heading ?? "From setup to podium in five stages."}
          </h2>

          <p className="mt-4 font-body text-lg text-gray-600 leading-relaxed">
            Every step has an auditable readiness gate. Nothing advances until data is clean.
          </p>
        </FadeInUp>

        {/* ── Connected 5-Stage Pipeline ── */}
        <div className="relative mt-16">
          
          {/* Connector line behind steps on desktop */}
          <div className="hidden lg:block absolute top-[45px] left-[5%] right-[5%] h-[2px] bg-gray-200 -z-0" />

          <StaggerContainer
            as="ol"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 relative z-10"
            staggerDelay={0.08}
          >
            {steps.map((step, idx) => {
              const isHovered = activeStep === idx;

              return (
                <StaggerItem key={step.n} as="li" className="flex">
                  <div
                    onMouseEnter={() => setActiveStep(idx)}
                    onMouseLeave={() => setActiveStep(null)}
                    className={clsx(
                      "group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6",
                      "transition-all duration-300 ease-out",
                      isHovered
                        ? "border-black shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] -translate-y-1.5"
                        : "border-gray-200 shadow-xs hover:border-gray-300"
                    )}
                  >
                    {/* Top Step Number Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          "flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black transition-colors duration-300",
                          isHovered
                            ? "bg-black text-white"
                            : "bg-gray-100 text-black border border-gray-200"
                        )}
                      >
                        {step.n}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-gray-400 uppercase">
                        STAGE // 0{idx + 1}
                      </span>
                    </div>

                    {/* Step Title & Body */}
                    <div className="mt-6 flex-1">
                      <h3 className="font-display text-lg font-bold tracking-tight text-black group-hover:text-gold-dark transition-colors">
                        {step.title}
                      </h3>
                      <p className="mt-2 font-body text-xs text-gray-600 leading-relaxed">
                        {step.body}
                      </p>
                    </div>

                    {/* Bottom Status Gate Chip */}
                    <div className="mt-6 border-t border-gray-100 pt-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        {step.gate}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* ── Summary Footer Note ── */}
        <FadeInUp className="mt-12 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/80 px-6 py-4 font-mono text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span>FULL_LIFECYCLE_AUTOMATION // Zero manual spreadsheet transfers required</span>
          </div>
          <span className="hidden sm:inline font-bold text-black">STATUS: OPERATIONAL</span>
        </FadeInUp>

      </div>
    </section>
  );
}