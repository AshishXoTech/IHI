"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface ContributionHeatmapProps {
  userId: string;
}

// Generate deterministic dummy contributions for the past 52 weeks (364 days)
function generateYearData() {
  const weeks = 52;
  const daysPerWeek = 7;
  const grid: Array<Array<{ date: string; count: number; level: number }>> = [];

  const today = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const week: Array<{ date: string; count: number; level: number }> = [];
    for (let d = 0; d < daysPerWeek; d++) {
      const dayOffset = w * 7 + (6 - d);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - dayOffset);

      // Deterministic pseudo-randomness for realistic streak clustering
      const seed = (w * 13 + d * 7 + targetDate.getDate()) % 100;
      let count = 0;
      let level = 0;

      if (seed > 80) {
        count = Math.floor((seed % 8) + 5);
        level = 4;
      } else if (seed > 55) {
        count = Math.floor((seed % 4) + 3);
        level = 3;
      } else if (seed > 35) {
        count = Math.floor((seed % 3) + 1);
        level = 2;
      } else if (seed > 20) {
        count = 1;
        level = 1;
      }

      week.push({
        date: targetDate.toISOString().split("T")[0],
        count,
        level,
      });
    }
    grid.push(week);
  }

  return grid;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

export default function ContributionHeatmap({ userId }: ContributionHeatmapProps) {
  const contributionGrid = useMemo(() => generateYearData(), [userId]);

  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-[var(--organizer-gold-champagne)] border-[var(--organizer-border)]";
      case 2:
        return "bg-[var(--organizer-gold)] border-[var(--organizer-ink-primary)]";
      case 3:
        return "bg-[var(--organizer-gold-deep)] border-[var(--organizer-ink-primary)]";
      case 4:
        return "bg-[var(--organizer-ink-primary)] border-[var(--organizer-ink-primary)]";
      default:
        return "bg-[var(--organizer-surface-hover)] border-[var(--organizer-border-light)]";
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[680px]">
        {/* Month Headers */}
        <div className="flex justify-between pl-8 pr-2 pb-2 text-[9px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
          {MONTHS.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>

        {/* Heatmap Matrix */}
        <div className="flex gap-1.5">
          {/* Day-of-week labels */}
          <div className="flex flex-col justify-between pr-2 text-[9px] font-mono font-bold text-[var(--organizer-ink-muted)]">
            {DAYS.map((d, i) => (
              <span key={i} className="h-3 leading-3">
                {d}
              </span>
            ))}
          </div>

          {/* 52 Columns */}
          <div className="flex flex-1 gap-1">
            {contributionGrid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} contributions`}
                    className={`h-3 w-3 rounded-none border transition-transform hover:scale-125 hover:z-20 cursor-pointer ${getColorClass(
                      day.level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--organizer-border)] pt-3 text-[10px] font-mono text-[var(--organizer-ink-muted)]">
          <span className="font-bold uppercase">Learn how we calculate commits & evaluations</span>
          <div className="flex items-center gap-1.5">
            <span className="uppercase text-[9px]">LESS</span>
            <div className="h-3 w-3 border border-[var(--organizer-border-light)] bg-[var(--organizer-surface-hover)]" />
            <div className="h-3 w-3 border border-[var(--organizer-border)] bg-[var(--organizer-gold-champagne)]" />
            <div className="h-3 w-3 border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]" />
            <div className="h-3 w-3 border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-deep)]" />
            <div className="h-3 w-3 border border-[var(--organizer-ink-primary)] bg-[var(--organizer-ink-primary)]" />
            <span className="uppercase text-[9px]">MORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}