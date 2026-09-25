"use client";

import React from "react";
import { clsx } from "clsx";

/**
 * Floating tech stack icons — MLH-inspired, white theme, gold accents.
 * Pure CSS animations (no heavy JS). Respects prefers-reduced-motion.
 */

type IconSpec = {
  label: string;
  x: string;      // left %
  y: string;      // top %
  size: number;   // px
  delay: string;  // animation-delay
  duration?: string;
  rotate?: number;
};

const ICONS: IconSpec[] = [
  { label: "JS",   x: "6%",  y: "18%", size: 52, delay: "0s",  duration: "6s",  rotate: -8 },
  { label: "TS",   x: "88%", y: "14%", size: 48, delay: "1.2s", duration: "7s",  rotate: 12 },
  { label: "PY",   x: "12%", y: "68%", size: 56, delay: "0.6s", duration: "8s",  rotate: 6 },
  { label: "REACT",x: "78%", y: "62%", size: 64, delay: "1.8s", duration: "5.5s", rotate: -14 },
  { label: "GO",   x: "4%",  y: "42%", size: 44, delay: "2.4s", duration: "7.5s", rotate: 4 },
  { label: "RS",   x: "90%", y: "40%", size: 46, delay: "0.3s", duration: "6.5s", rotate: -6 },
  { label: "DOCKER", x: "22%", y: "12%", size: 40, delay: "1.5s", duration: "9s", rotate: 10 },
  { label: "NODE", x: "70%", y: "78%", size: 42, delay: "2.1s", duration: "6.8s", rotate: -4 },
];

function TechBadge({
  label,
  size,
  rotate = 0,
  className,
}: {
  label: string;
  size: number;
  rotate?: number;
  className?: string;
}) {
  // Simple monogram-style badges (no external image deps)
  const short = label.length > 4 ? label.slice(0, 2) : label;

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-2xl border border-gray-200 bg-white/80 shadow-premium backdrop-blur-md",
        "font-mono font-bold tracking-tight text-gray-800",
        "transition-transform duration-500 will-change-transform",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.28),
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      {short}
    </div>
  );
}

export function FloatingTechIcons({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      {ICONS.map((icon) => (
        <div
          key={icon.label}
          className="absolute animate-float-slow opacity-[0.55] hover:opacity-90"
          style={{
            left: icon.x,
            top: icon.y,
            animationDelay: icon.delay,
            animationDuration: icon.duration ?? "6s",
          }}
        >
          <TechBadge label={icon.label} size={icon.size} rotate={icon.rotate} />
        </div>
      ))}

      {/* Soft radial fades so icons never collide with text */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.85)_70%,white_100%)]" />
    </div>
  );
}