"use client";

import React from "react";
import Link from "next/link";
import { Hero3DGraphic } from "./Hero3DGraphic";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-gray-100 pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-8 lg:px-12">
        
        {/* LEFT — Copy + CTAs */}
        <div className="relative z-20 flex flex-col items-start text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-gold-dark shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Hackathon Operating System
          </div>

          <h1 className="font-display text-5xl font-black tracking-tight text-black sm:text-6xl lg:text-7xl leading-[1.05]">
            The World&apos;s Most <br />
            Deterministic <br />
            <span className="text-[#3E6FF3]">Hackathon Engine.</span>
          </h1>

          <p className="mt-6 max-w-xl font-body text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
            IHI orchestrates registrations, team formation, submissions, and
            judging on one timeline. 50,000+ developers learn, build, and ship
            together without the spreadsheet chaos.
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-8 font-body text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_10px_40px_-10px_rgba(201,162,39,0.5)] sm:w-auto"
            >
              Launch an Event
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
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-transparent px-8 font-body text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:border-black hover:bg-gray-50 sm:w-auto"
            >
              See the Dashboard
            </Link>
          </div>
        </div>

        {/* RIGHT — 3D graphic (contained, no overflow) */}
        <div className="relative z-10 hidden h-[420px] w-full lg:block lg:h-[520px]">
          <Hero3DGraphic />
        </div>
      </div>
    </section>
  );
}