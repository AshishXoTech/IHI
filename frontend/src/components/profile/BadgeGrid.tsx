"use client";

import React from "react";
import type { Badge } from "@/types/participant-hub";

const TIER_STYLE = {
  common: "border-[var(--organizer-border)] bg-[var(--organizer-surface-hover)] text-[var(--organizer-ink-secondary)]",
  uncommon: "border-[var(--organizer-gold-champagne)] bg-[var(--organizer-gold-light)] text-[var(--organizer-gold-deep)]",
  rare: "border-[var(--organizer-gold)] bg-[var(--organizer-surface)] text-[var(--organizer-gold-deep)] shadow-sm",
  epic: "border-[var(--organizer-gold-deep)] bg-[var(--organizer-surface)] text-[var(--organizer-gold-deep)] shadow-md",
  legendary: "border-[var(--organizer-gold)] bg-[var(--organizer-ink-primary)] text-[var(--organizer-gold)] shadow-lg animate-pulse",
};

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((b) => {
        const isUnlocked = b.unlocked ?? true;
        const tierStyle = isUnlocked
          ? TIER_STYLE[b.tier] || TIER_STYLE.common
          : "border-[var(--organizer-border-light)] bg-[var(--organizer-surface-hover)] text-[var(--organizer-ink-muted)] opacity-60 grayscale";

        return (
          <div
            key={b.id}
            className={`rounded-xl border p-4 flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 ${tierStyle}`}
          >
            <span className="text-2xl flex-shrink-0 select-none">{b.icon_symbol}</span>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className={`text-xs font-bold font-display truncate ${isUnlocked && b.tier === 'legendary' ? 'text-[var(--organizer-gold)]' : 'text-[var(--organizer-ink-primary)]'}`}>
                  {b.title}
                </h4>
                {!isUnlocked && <span className="text-[10px] text-[var(--organizer-ink-muted)]">ðŸ”’</span>}
              </div>
              <p className={`text-[10px] line-clamp-2 leading-relaxed ${isUnlocked && b.tier === 'legendary' ? 'text-[var(--organizer-gold-champagne)]' : 'text-[var(--organizer-ink-secondary)]'}`}>
                {b.description}
              </p>
              <span className={`inline-block text-[9px] font-mono uppercase tracking-widest pt-1 font-semibold ${isUnlocked && b.tier === 'legendary' ? 'text-[var(--organizer-gold)]' : 'text-[var(--organizer-ink-muted)]'}`}>
                {b.tier}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
