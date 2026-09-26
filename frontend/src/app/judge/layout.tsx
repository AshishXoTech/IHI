"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] flex flex-col font-sans">
      {/* Top Judge Navigation Header */}
      <header className="sticky top-0 z-50 bg-[var(--organizer-surface)] border-b-2 border-[var(--organizer-ink-primary)] px-4 sm:px-6 py-3 shadow-[0_2px_0_0_var(--organizer-ink-primary)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Brand Mark */}
          <div className="flex items-center gap-4">
            <Link href="/judge/queue" className="flex items-center gap-3 group">
              <div
                className="flex items-center justify-center px-3 py-1 bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] font-display font-black text-xl text-[var(--organizer-gold-deep)] tracking-tighter transition-transform group-hover:-translate-y-0.5"
                style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
              >
                {"{ihi}"}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] leading-none mb-1">
                  INNOVATIVE HACK INTELLIGENCE
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-primary)] leading-none">
                  EVALUATION PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Right Session Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)]">
              <Shield className="w-3.5 h-3.5 text-[var(--organizer-gold-deep)]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-gold-deep)]">
                SECURE JUDGE NODE
              </span>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] hover:bg-[var(--organizer-gold)] transition-all"
              style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              END SESSION
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}