// frontend/src/components/landing/HeroSection.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-20 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        
        {/* ═══════════════════════════════════════
            LEFT COLUMN: Copy & Call To Actions
            ═══════════════════════════════════════ */}
        <div className="space-y-6 lg:col-span-7">
          {/* Sub-badge */}
          <div className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5"
            style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
          >
            <div className="h-2 w-2 rounded-full bg-[var(--organizer-gold-deep)] animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)]">
              HACKATHON OPERATING SYSTEM
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-black uppercase tracking-tighter text-[var(--organizer-ink-primary)] sm:text-6xl lg:text-7xl leading-[0.95]">
            THE WORLD’S MOST DETERMINISTIC{" "}
            <span className="text-[var(--organizer-gold-deep)]">HACKATHON ENGINE.</span>
          </h1>

          {/* Description */}
          <p className="max-w-xl font-mono text-xs sm:text-sm font-bold uppercase leading-relaxed tracking-wider text-[var(--organizer-ink-muted)]">
            IHI orchestrates registrations, team formation, submissions, and judging on one timeline. 50,000+ developers learn, build, and ship together without the spreadsheet chaos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/signup"
              className="group flex items-center gap-3 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] transition-all hover:-translate-y-1 hover:bg-[var(--organizer-gold-deep)] hover:text-white"
              style={{ boxShadow: "5px 5px 0px 0px var(--organizer-ink-primary)" }}
            >
              <span>LAUNCH AN EVENT</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#dashboard"
              className="flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] transition-all hover:-translate-y-1 hover:bg-[var(--organizer-gold-light)]"
              style={{ boxShadow: "5px 5px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Terminal className="h-4 w-4 text-[var(--organizer-ink-muted)]" />
              <span>SEE THE DASHBOARD</span>
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            RIGHT COLUMN: 3D Isometric {IHI} Engine Graphic
            ═══════════════════════════════════════ */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-[440px] aspect-square flex items-center justify-center"
          >
            {/* 3D Isometric Graphic Container */}
            <div className="relative w-full h-full flex items-center justify-center select-none">
              
              {/* Isometric SVG Illustration of 3D colorful {IHI} blocks */}
              <svg
                viewBox="0 0 500 400"
                className="w-full h-full drop-shadow-[8px_8px_0px_var(--organizer-ink-primary)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Isometric Base Grid Platform */}
                <path
                  d="M250 340 L440 230 L250 120 L60 230 Z"
                  fill="var(--organizer-surface)"
                  stroke="var(--organizer-ink-primary)"
                  strokeWidth="3"
                />

                {/* Left Bracket '{' Block */}
                <g transform="translate(90, 110)">
                  {/* Top face */}
                  <path d="M40 20 L70 0 L50 -15 L20 5 Z" fill="#E8D9A8" stroke="#0A0A0A" strokeWidth="2.5" />
                  {/* Front/Side 3D Faces */}
                  <path d="M20 5 L50 -15 L50 90 L20 110 Z" fill="#D5D0C0" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M50 -15 L70 0 L70 105 L50 90 Z" fill="#F0EFEA" stroke="#0A0A0A" strokeWidth="2.5" />
                </g>

                {/* Letter 'I' Red Block */}
                <g transform="translate(160, 95)">
                  <path d="M30 15 L50 0 L35 -15 L15 0 Z" fill="#FF7060" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M15 0 L35 -15 L35 110 L15 125 Z" fill="#E54D2E" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M35 -15 L50 0 L50 125 L35 110 Z" fill="#C03A1E" stroke="#0A0A0A" strokeWidth="2.5" />
                </g>

                {/* Letter 'H' Green Block */}
                <g transform="translate(225, 70)">
                  <path d="M45 20 L75 0 L55 -15 L25 5 Z" fill="#6EE7B7" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M25 5 L55 -15 L55 130 L25 150 Z" fill="#10B981" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M55 -15 L75 0 L75 145 L55 130 Z" fill="#047857" stroke="#0A0A0A" strokeWidth="2.5" />
                </g>

                {/* Letter 'I' Blue Block */}
                <g transform="translate(305, 55)">
                  <path d="M30 15 L50 0 L35 -15 L15 0 Z" fill="#60A5FA" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M15 0 L35 -15 L35 145 L15 160 Z" fill="#2563EB" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M35 -15 L50 0 L50 160 L35 145 Z" fill="#1D4ED8" stroke="#0A0A0A" strokeWidth="2.5" />
                </g>

                {/* Right Bracket '}' Block */}
                <g transform="translate(370, 40)">
                  <path d="M40 20 L70 0 L50 -15 L20 5 Z" fill="#E8D9A8" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M20 5 L50 -15 L50 160 L20 180 Z" fill="#D5D0C0" stroke="#0A0A0A" strokeWidth="2.5" />
                  <path d="M50 -15 L70 0 L70 175 L50 160 Z" fill="#F0EFEA" stroke="#0A0A0A" strokeWidth="2.5" />
                </g>
              </svg>

              {/* Floating Code Tech Badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-6 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--organizer-ink-primary)]"
              >
                GO
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 right-4 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--organizer-ink-primary)] text-[var(--organizer-gold-deep)]"
              >
                JS / TS
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 left-10 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--organizer-ink-primary)]"
              >
                PY / FASTAPI
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-12 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--organizer-ink-primary)]"
              >
                AI BRIEFING
              </motion.div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}