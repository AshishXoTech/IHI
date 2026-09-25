"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * ParachuteHacker — Premium floating character
 * Paper-in-air physics · slow scroll drift · single right-side instance
 */
export function ParachuteHacker({ className }: { className?: string }) {
  const [scrollY, setScrollY] = useState(0);
  const [tick, setTick] = useState(0);

  // Slow scroll tracking
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Continuous gentle sway clock (paper float)
  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    const loop = (now: number) => {
      setTick((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Paper-float math
  const driftY = scrollY * 0.08; // slow vertical travel with page
  const bob = Math.sin(tick * 0.7) * 14; // slow up-down
  const sway = Math.sin(tick * 0.45) * 10; // horizontal drift
  const tilt = Math.sin(tick * 0.5) * 6; // rotate like paper
  const roll = Math.cos(tick * 0.35) * 3; // subtle 3D roll feel

  return (
    <div
      className={clsx(
        "pointer-events-none fixed z-20 select-none",
        "right-3 sm:right-6 md:right-10 lg:right-14",
        "top-[22%]",
        "hidden sm:block", // hide on very small phones
        className
      )}
      style={{
        transform: `
          translate3d(${sway}px, ${driftY + bob}px, 0)
          rotate(${tilt}deg)
          rotateY(${roll}deg)
        `,
        transition: "transform 0.1s linear",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <CharacterSVG />
    </div>
  );
}

function CharacterSVG() {
  return (
    <svg
      width="120"
      height="168"
      viewBox="0 0 120 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
    >
      {/* ═══════ PARACHUTE CANOPY ═══════ */}
      {/* Main dome */}
      <path
        d="M10 48 C10 18, 110 18, 110 48 L100 54 C100 32, 20 32, 20 54 Z"
        fill="#C9A227"
        stroke="#0A0A0A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Canopy depth (underside) */}
      <path
        d="M20 54 C20 42, 100 42, 100 54 L96 58 C96 48, 24 48, 24 58 Z"
        fill="#A4841C"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Panel seams */}
      <path d="M35 22 L35 52" stroke="#0A0A0A" strokeWidth="1.5" opacity="0.3" />
      <path d="M50 16 L50 54" stroke="#0A0A0A" strokeWidth="1.5" opacity="0.3" />
      <path d="M70 16 L70 54" stroke="#0A0A0A" strokeWidth="1.5" opacity="0.3" />
      <path d="M85 22 L85 52" stroke="#0A0A0A" strokeWidth="1.5" opacity="0.3" />
      {/* Highlight shine */}
      <path
        d="M22 36 C30 26, 48 22, 58 22"
        stroke="#E4C65A"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Small brand dot on canopy */}
      <circle cx="60" cy="34" r="3" fill="#0A0A0A" opacity="0.15" />

      {/* ═══════ SUSPENSION LINES ═══════ */}
      <path d="M28 54 L52 92" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M45 54 L56 92" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M75 54 L64 92" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M92 54 L68 92" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" />

      {/* ═══════ HARNESS ═══════ */}
      <path
        d="M50 92 L50 100 M70 92 L70 100 M50 96 H70"
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* ═══════ HEAD ═══════ */}
      <circle cx="60" cy="108" r="11" fill="#0A0A0A" />
      {/* Face highlight (gives volume) */}
      <circle cx="57" cy="106" r="3.5" fill="#2A2A2A" />
      {/* Hair / hoodie bump */}
      <path
        d="M50 102 C52 94, 68 94, 70 102"
        fill="#0A0A0A"
      />
      {/* Cute side hair flick */}
      <path
        d="M48 105 C44 100, 44 108, 48 110"
        fill="#0A0A0A"
      />

      {/* ═══════ BODY / HOODIE ═══════ */}
      <path
        d="M46 118 C46 112, 74 112, 74 118 L74 138 C74 142, 46 142, 46 138 Z"
        fill="#3E6FF3"
        stroke="#0A0A0A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Hoodie pocket */}
      <path
        d="M52 128 H68 V134 H52 Z"
        fill="#2A50BD"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Zipper line */}
      <path d="M60 118 V138" stroke="#0A0A0A" strokeWidth="1.25" opacity="0.4" />

      {/* ═══════ ARMS ═══════ */}
      {/* Left arm */}
      <path
        d="M46 122 C38 126, 32 132, 30 136"
        stroke="#0A0A0A"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right arm holding laptop */}
      <path
        d="M74 122 C82 124, 88 128, 90 132"
        stroke="#0A0A0A"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ═══════ LAPTOP ═══════ */}
      {/* Screen */}
      <rect
        x="24"
        y="132"
        width="28"
        height="18"
        rx="2"
        fill="#FAFAFA"
        stroke="#0A0A0A"
        strokeWidth="2.5"
      />
      {/* Dark display */}
      <rect x="27" y="135" width="22" height="11" rx="1" fill="#0A0A0A" />
      {/* Code lines on screen (animated feel via static glow) */}
      <path d="M29 138 H43" stroke="#2FB67C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 141 H39" stroke="#C9A227" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M29 144 H41" stroke="#3E6FF3" strokeWidth="1.25" strokeLinecap="round" />
      {/* Laptop base / keyboard */}
      <path
        d="M22 150 H56 L54 154 H24 Z"
        fill="#E5E5E5"
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Glow under laptop */}
      <ellipse cx="39" cy="156" rx="14" ry="3" fill="#C9A227" opacity="0.2" />

      {/* ═══════ LEGS ═══════ */}
      <path
        d="M54 142 L50 160"
        stroke="#0A0A0A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M66 142 L72 160"
        stroke="#0A0A0A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Shoes */}
      <path d="M44 160 H56" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M66 160 H78" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" />

      {/* ═══════ MOTION LINES (air feel) ═══════ */}
      <path d="M8 70 H16" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M6 80 H12" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M104 75 H114" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M108 85 H116" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}