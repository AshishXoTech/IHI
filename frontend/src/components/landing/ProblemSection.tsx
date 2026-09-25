"use client";

import React from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { PROBLEM } from "@/lib/landing/content";

/**
 * ProblemSection — World-class kinetic problem statement
 * Split narrative + 3 physical "failure mode" cards.
 * No fake stats. No filler. Pure product tension.
 */

const FAILURE_ICONS: Record<string, React.ReactNode> = {
  // Fallbacks keyed loosely — we'll map by index for reliability
};

function FailureIcon({ index }: { index: number }) {
  // 0 = Fragmented tooling, 1 = Opaque judging, 2 = Last-mile chaos
  if (index === 0) {
    return (
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Broken chain / disconnected surfaces */}
        <div className="absolute left-0 top-2 h-3 w-3 rounded-sm border-2 border-red-400 bg-red-50" />
        <div className="absolute left-4 top-2 h-3 w-3 rounded-sm border-2 border-gray-300 bg-gray-50 opacity-60" />
        <div className="absolute left-8 top-2 h-3 w-3 rounded-sm border-2 border-gray-200 bg-white opacity-40" />
        <div className="absolute left-1.5 top-5 h-0.5 w-8 -rotate-12 bg-red-300" />
        <div className="absolute bottom-1 left-2 font-mono text-[9px] font-bold text-red-400">×</div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Opaque score bars */}
        <div className="flex items-end gap-1">
          <div className="h-6 w-2 rounded-sm bg-gray-200" />
          <div className="h-9 w-2 rounded-sm bg-gray-300" />
          <div className="h-4 w-2 rounded-sm bg-gray-200" />
          <div className="h-7 w-2 rounded-sm bg-red-300/80" />
        </div>
        <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-mono text-[8px] font-black text-white">
          ?
        </div>
      </div>
    );
  }
  // index 2 — Last-mile chaos (burning clock)
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50">
        <span className="font-mono text-xs font-black text-amber-600">11:59</span>
      </div>
      <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
    </div>
  );
}

export function ProblemSection({ className = "" }: { className?: string }) {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className={clsx("relative border-t border-gray-100 bg-white", className)}
    >
      {/* Soft blueprint grid — very light */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 30% 20%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 20%, black 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Top narrative ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left label + heading */}
          <FadeInUp className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-red-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              {PROBLEM.eyebrow ?? "The problem"}
            </div>

            <h2
              id="problem-heading"
              className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
            >
              {PROBLEM.heading ?? "Hackathon ops shouldn't be a fire drill."}
            </h2>
          </FadeInUp>

          {/* Right body copy */}
          <FadeInUp className="lg:col-span-7 lg:pt-10">
            <p className="max-w-2xl font-body text-lg leading-relaxed text-gray-600 sm:text-xl">
              {PROBLEM.body ??
                "Most events are held together by three spreadsheets, a Slack thread, and one exhausted organiser. Registrations drift, teams fracture at the deadline, judges score in incompatible units, and the winners' list ships hours late."}
            </p>
          </FadeInUp>
        </div>

        {/* ── Failure mode cards ── */}
        <StaggerContainer
          as="ul"
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
          staggerDelay={0.12}
        >
          {(PROBLEM.points ?? [
            {
              title: "Fragmented tooling",
              body: "Forms, docs, chat, and scoring live in four disconnected surfaces.",
            },
            {
              title: "Opaque judging",
              body: "Rubrics vary judge-to-judge; correction workflows barely exist.",
            },
            {
              title: "Last-mile chaos",
              body: "Publishing results requires manual reconciliation under time pressure.",
            },
          ]).map((point, index) => (
            <StaggerItem key={point.title} as="li">
              <article
                className={clsx(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8",
                  "shadow-[0_1px_0_rgba(0,0,0,0.04)]",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                )}
              >
                {/* Top accent bar — reveals on hover */}
                <div
                  className={clsx(
                    "absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
                    index === 0 && "bg-red-400",
                    index === 1 && "bg-amber-400",
                    index === 2 && "bg-orange-500"
                  )}
                />

                {/* Index + Icon row */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] font-bold tracking-widest text-gray-300">
                    0{index + 1}
                  </span>
                  <FailureIcon index={index} />
                </div>

                {/* Title */}
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-black">
                  {point.title}
                </h3>

                {/* Body */}
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-gray-500">
                  {point.body}
                </p>

                {/* Bottom mono status line */}
                <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {index === 0 && "4 surfaces · 0 sync"}
                    {index === 1 && "no parity · no audit"}
                    {index === 2 && "manual · irreversible"}
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── Bottom tension line ── */}
        <FadeInUp className="mt-16 flex flex-col items-start gap-3 border-t border-gray-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs font-medium tracking-wide text-gray-400">
            // These aren't edge cases. They're the default.
          </p>
          <p className="font-body text-sm font-semibold text-gray-700">
            IHI exists because the fire drill became the product.
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}