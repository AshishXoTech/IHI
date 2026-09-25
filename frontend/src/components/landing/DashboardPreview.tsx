"use client";

import React from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";

/**
 * DashboardPreview — World-class product proof
 * A realistic organizer cockpit mock that looks shippable.
 */

function Sparkline({ points, color = "#C9A227" }: { points: number[]; color?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const step = w / (points.length - 1);

  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricTile({
  label,
  value,
  delta,
  sparkline,
  accent = "gold",
}: {
  label: string;
  value: string;
  delta: string;
  sparkline: number[];
  accent?: "gold" | "green" | "blue" | "red";
}) {
  const accentMap = {
    gold: { text: "text-gold-dark", bar: "#C9A227", bg: "bg-gold/10", border: "border-gold/20" },
    green: { text: "text-emerald-700", bar: "#2FB67C", bg: "bg-emerald-50", border: "border-emerald-200" },
    blue: { text: "text-blue-700", bar: "#3E6FF3", bg: "bg-blue-50", border: "border-blue-200" },
    red: { text: "text-red-600", bar: "#E4574C", bg: "bg-red-50", border: "border-red-200" },
  }[accent];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className={clsx("rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold", accentMap.bg, accentMap.text, accentMap.border, "border")}>
          {delta}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="font-display text-3xl font-black tracking-tight text-black tabular-nums">
          {value}
        </span>
        <Sparkline points={sparkline} color={accentMap.bar} />
      </div>
    </div>
  );
}

function ProgressBar({ track, pct, color }: { track: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-body text-sm font-medium text-gray-700">{track}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-gray-900">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function PublishRing({ value = 87 }: { value?: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="140" height="140" className="-rotate-90" aria-hidden="true">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#F5F5F5" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#C9A227"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-black text-black tabular-nums">{value}%</span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Ready
        </span>
      </div>
    </div>
  );
}

export function DashboardPreview({ className = "" }: { className?: string }) {
  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className={clsx("relative border-t border-gray-100 bg-gray-50/50", className)}
    >
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Header ── */}
        <FadeInUp className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            The Interface
          </div>

          <h2
            id="dashboard-heading"
            className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
          >
            Dashboards worthy of{" "}
            <span className="text-gradient-gold">world-class events.</span>
          </h2>

          <p className="mt-4 font-body text-lg text-gray-600 leading-relaxed">
            Every stakeholder gets a purpose-built cockpit designed for clarity and speed.
          </p>
        </FadeInUp>

        {/* ── Mock Window ── */}
        <FadeInUp className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]">
            
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-3 backdrop-blur-sm">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex flex-1 justify-center">
                <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-1 font-mono text-[11px] text-gray-500 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ihi.app/organizer/dashboard
                </div>
              </div>
              <div className="w-14" /> {/* balance traffic lights */}
            </div>

            {/* Dashboard body */}
            <div className="p-5 md:p-8">
              
              {/* KPI row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricTile
                  label="Registrations"
                  value="1,247"
                  delta="↑ 12%"
                  sparkline={[10, 18, 15, 28, 22, 35, 42, 38, 55]}
                  accent="gold"
                />
                <MetricTile
                  label="Teams Formed"
                  value="284"
                  delta="↑ 8%"
                  sparkline={[5, 8, 12, 10, 18, 22, 20, 28, 32]}
                  accent="green"
                />
                <MetricTile
                  label="Submissions"
                  value="196"
                  delta="↑ 24%"
                  sparkline={[2, 4, 8, 12, 10, 18, 25, 30, 36]}
                  accent="blue"
                />
                <MetricTile
                  label="Avg Score"
                  value="7.8"
                  delta="↑ 3%"
                  sparkline={[6.2, 6.5, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8]}
                  accent="red"
                />
              </div>

              {/* Detail row */}
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                
                {/* Judging progress */}
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-gray-50/50 p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-display text-sm font-bold text-black">Judging Progress</p>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Live tracks
                    </span>
                  </div>
                  <div className="space-y-4">
                    <ProgressBar track="AI / ML Track" pct={92} color="#C9A227" />
                    <ProgressBar track="Web3 Track" pct={78} color="#3E6FF3" />
                    <ProgressBar track="Sustainability" pct={65} color="#2FB67C" />
                    <ProgressBar track="Design" pct={88} color="#E4574C" />
                  </div>
                </div>

                {/* Publish readiness */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Publish Readiness
                  </p>
                  <PublishRing value={87} />
                  <p className="mt-3 text-center font-body text-xs text-gray-500">
                    All gates green.<br />
                    <span className="font-semibold text-black">Ready to release.</span>
                  </p>
                </div>
              </div>

              {/* Bottom status bar */}
              <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  EVENT_STATE: JUDGING_IN_PROGRESS · 4 tracks active
                </div>
                <div className="font-mono text-[11px] font-semibold text-gray-500">
                  Last sync: 2s ago · Append-only scores ✓
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Caption */}
        <FadeInUp className="mt-8 text-center">
          <p className="font-mono text-xs text-gray-400">
            // Real organizer cockpit — not a concept mock
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}