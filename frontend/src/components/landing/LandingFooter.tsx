"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative border-t border-gray-200 bg-white">
      {/* Top thin gold accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">

          {/* ── LEFT: Brand Block ── */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            
            {/* Big spaced IHI logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-display text-3xl font-black text-gray-300">
                {"{"}
              </span>

              <div className="flex items-baseline gap-[5px]">
                <span
                  className="font-display text-4xl font-black leading-none"
                  style={{ color: "#E4574C", textShadow: "3px 3px 0 #B8362B" }}
                >
                  I
                </span>
                <span
                  className="font-display text-4xl font-black leading-none"
                  style={{ color: "#2FB67C", textShadow: "3px 3px 0 #1E875A" }}
                >
                  H
                </span>
                <span
                  className="font-display text-4xl font-black leading-none"
                  style={{ color: "#3E6FF3", textShadow: "3px 3px 0 #2A50BD" }}
                >
                  I
                </span>
              </div>

              <span className="font-display text-3xl font-black text-gray-300">
                {"}"}
              </span>
            </Link>

            {/* Full form — properly spaced below */}
            <p className="mt-3 font-body text-sm font-semibold tracking-wide text-gray-500">
              Innovative Hack Intelligence
            </p>

            {/* Tagline */}
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-gray-500">
              The deterministic operating system for modern hackathons.
              Registrations to results — one clean timeline.
            </p>

            {/* Social / status row */}
            <div className="mt-8 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>

          {/* ── RIGHT: Link Columns ── */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-black">
                Product
              </h4>
              <ul className="mt-4 space-y-3">
                {["Features", "Pricing", "Dashboard", "Changelog"].map((l) => (
                  <li key={l}>
                    <Link href={`#${l.toLowerCase()}`} className="font-body text-sm text-gray-500 transition-colors hover:text-black">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-black">
                Platform
              </h4>
              <ul className="mt-4 space-y-3">
                {["Judging", "Teams", "Submissions", "AI Briefing"].map((l) => (
                  <li key={l}>
                    <Link href="#" className="font-body text-sm text-gray-500 transition-colors hover:text-black">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-black">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((l) => (
                  <li key={l}>
                    <Link href="#" className="font-body text-sm text-gray-500 transition-colors hover:text-black">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-black">
                Legal
              </h4>
              <ul className="mt-4 space-y-3">
                {["Privacy", "Terms", "Security"].map((l) => (
                  <li key={l}>
                    <Link href="#" className="font-body text-sm text-gray-500 transition-colors hover:text-black">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-gray-400">
            © {new Date().getFullYear()} IHI — Innovative Hack Intelligence. All rights reserved.
          </p>
          <p className="font-mono text-xs text-gray-400">
            Built for organisers who ship results.
          </p>
        </div>
      </div>
    </footer>
  );
}