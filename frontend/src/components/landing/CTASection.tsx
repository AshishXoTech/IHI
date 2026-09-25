"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";

/**
 * CTASection — Final punch
 * Dark stage. Gold action. Zero ambiguity.
 */

export function CTASection({ className = "" }: { className?: string }) {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className={clsx("relative border-t border-gray-100 bg-white", className)}
    >
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        <FadeInUp>
          <div className="relative overflow-hidden rounded-[28px] border border-gray-800 bg-black px-6 py-16 text-center sm:px-12 md:px-16 md:py-24 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]">
            
            {/* Blueprint grid (subtle on black) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Giant watermark IHI behind content */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
              aria-hidden="true"
            >
              <div className="flex -rotate-12 items-center gap-3 opacity-[0.06] sm:gap-5">
                <span className="font-display text-[8rem] font-black text-white sm:text-[12rem] md:text-[16rem]">
                  {"{"}
                </span>
                <span
                  className="font-display text-[9rem] font-black tracking-tighter sm:text-[14rem] md:text-[18rem]"
                  style={{ color: "#E4574C" }}
                >
                  I
                </span>
                <span
                  className="font-display text-[9rem] font-black tracking-tighter sm:text-[14rem] md:text-[18rem]"
                  style={{ color: "#2FB67C" }}
                >
                  H
                </span>
                <span
                  className="font-display text-[9rem] font-black tracking-tighter sm:text-[14rem] md:text-[18rem]"
                  style={{ color: "#3E6FF3" }}
                >
                  I
                </span>
                <span className="font-display text-[8rem] font-black text-white sm:text-[12rem] md:text-[16rem]">
                  {"}"}
                </span>
              </div>
            </div>

            {/* Soft gold glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              
              {/* Live pill */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-light">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                Free tier · Deploy in 60 seconds
              </div>

              {/* Headline */}
              <h2
                id="cta-heading"
                className="max-w-3xl font-display text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
              >
                Ready to run a{" "}
                <span className="text-gradient-gold">flawless event?</span>
              </h2>

              {/* Body */}
              <p className="mx-auto mt-6 max-w-xl font-body text-base text-gray-400 sm:text-lg leading-relaxed">
                Stop chasing spreadsheets. Launch your next hackathon on a
                deterministic timeline — registrations to results, fully audited.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="group inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gold px-10 font-body text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_12px_40px_-8px_rgba(201,162,39,0.5)]"
                >
                  Launch an event
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/demo"
                  className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-xl border-2 border-gray-700 bg-transparent px-10 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white/5"
                >
                  See the dashboard
                </Link>
              </div>

              {/* Trust micro-line */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free Community tier
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Magic-link judges
                </span>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}