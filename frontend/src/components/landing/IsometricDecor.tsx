"use client";

import React from "react";
import { clsx } from "clsx";

/**
 * IsometricDecor — MLH-inspired living mini-world
 * Fills empty right-rail space with animated 3D-ish objects.
 * Pure SVG + CSS. No WebGL. Lightweight & premium.
 */
export function IsometricDecor({
  className,
  variant = "features",
}: {
  className?: string;
  variant?: "features" | "solution" | "how";
}) {
  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block",
        "select-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Soft fade so it never fights text */}
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/80" />

      <svg
        viewBox="0 0 420 640"
        className="absolute right-0 top-1/2 h-[min(640px,80vh)] w-auto -translate-y-1/2 translate-x-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Ground grid (isometric feel) ── */}
        <g opacity="0.12" stroke="#0A0A0A" strokeWidth="1">
          <path d="M40 480 L220 390 L400 480 L220 570 Z" />
          <path d="M100 450 L220 390 L340 450" />
          <path d="M70 510 L220 570 L370 510" />
        </g>

        {/* ── Floating puzzle block (gold) ── */}
        <g className="origin-center animate-float-slow" style={{ transformOrigin: "180px 200px" }}>
          <IsometricBox x={120} y={160} size={70} top="#E4C65A" left="#C9A227" right="#A4841C" />
          {/* Tiny crates on top */}
          <IsometricBox x={135} y={145} size={22} top="#FAFAFA" left="#E5E5E5" right="#D4D4D4" />
          <IsometricBox x={158} y={138} size={18} top="#FAFAFA" left="#E5E5E5" right="#D4D4D4" />
        </g>

        {/* ── Green gear platform ── */}
        <g className="origin-center animate-float" style={{ transformOrigin: "300px 140px", animationDuration: "7s", animationDelay: "0.5s" }}>
          <IsometricBox x={250} y={110} size={90} top="#2FB67C" left="#1E875A" right="#166B48" />
          {/* Spinning gear */}
          <g className="animate-spin-slow" style={{ transformOrigin: "295px 100px" }}>
            <Gear cx={295} cy={100} r={28} color="#A3A3A3" />
            <Gear cx={318} cy={118} r={14} color="#D4D4D4" />
          </g>
        </g>

        {/* ── Blue server / AI node ── */}
        <g className="origin-center animate-float-slow" style={{ transformOrigin: "320px 280px", animationDuration: "8s", animationDelay: "1s" }}>
          <IsometricBox x={270} y={250} size={85} top="#5B8AF5" left="#3E6FF3" right="#2A50BD" />
          {/* Screen face */}
          <path d="M275 275 L320 252 L320 310 L275 333 Z" fill="#0A0A0A" opacity="0.85" />
          <path d="M280 285 L310 268" stroke="#2FB67C" strokeWidth="2" strokeLinecap="round" />
          <path d="M280 295 L305 280" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M280 305 L312 286" stroke="#3E6FF3" strokeWidth="1.5" strokeLinecap="round" />
          {/* Antenna */}
          <path d="M310 248 L310 230" stroke="#0A0A0A" strokeWidth="2" />
          <circle cx={310} cy={226} r={4} fill="#E4574C" />
        </g>

        {/* ── Red accent block ── */}
        <g className="origin-center animate-float" style={{ transformOrigin: "140px 340px", animationDuration: "6.5s", animationDelay: "0.8s" }}>
          <IsometricBox x={100} y={310} size={55} top="#F07169" left="#E4574C" right="#B8362B" />
          <path d="M115 335 L140 320" stroke="#FAFAFA" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* ── Connecting dashed lines (data streams) ── */}
        <g stroke="#0A0A0A" strokeWidth="1.25" strokeDasharray="4 4" opacity="0.25">
          <path d="M190 230 L270 200" />
          <path d="M190 230 L300 280" />
          <path d="M155 365 L280 320" />
          <path d="M300 200 L310 250" />
        </g>

        {/* ── Tiny stick figures ── */}
        <TinyPerson x={200} y={400} />
        <TinyPerson x={245} y={385} wave />
        <TinyPerson x={330} y={360} />
        {/* Person climbing */}
        <TinyPerson x={355} y={240} />
        <path d="M360 280 L360 320" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        {/* ── Floating code chip ── */}
        <g className="animate-float" style={{ transformOrigin: "100px 250px", animationDuration: "5s", animationDelay: "1.2s" }}>
          <rect x={70} y={230} width={50} height={36} rx={4} fill="#FAFAFA" stroke="#0A0A0A" strokeWidth="2" />
          <text x={78} y={252} fontFamily="monospace" fontSize="11" fontWeight="700" fill="#0A0A0A">
            {"</>"}
          </text>
        </g>

        {/* ── Pulsing node ── */}
        <g>
          <circle cx={220} cy={300} r={8} fill="#C9A227" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={220} cy={300} r={14} fill="none" stroke="#C9A227" strokeWidth="1.5" opacity="0.4">
            <animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ── Small floating labels ── */}
        <g opacity="0.5" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#737373">
          <text x={90} y={120}>AI_CORE</text>
          <text x={340} y={400}>GATE_OK</text>
          <text x={60} y={420}>TEAM_01</text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Primitives ─── */

function IsometricBox({
  x,
  y,
  size,
  top,
  left,
  right,
}: {
  x: number;
  y: number;
  size: number;
  top: string;
  left: string;
  right: string;
}) {
  const w = size;
  const h = size * 0.55;
  const d = size * 0.5;
  // Simple isometric diamond box
  return (
    <g>
      {/* Top face */}
      <path
        d={`M${x} ${y} L${x + w / 2} ${y - h / 2} L${x + w} ${y} L${x + w / 2} ${y + h / 2} Z`}
        fill={top}
        stroke="#0A0A0A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Left face */}
      <path
        d={`M${x} ${y} L${x + w / 2} ${y + h / 2} L${x + w / 2} ${y + h / 2 + d} L${x} ${y + d} Z`}
        fill={left}
        stroke="#0A0A0A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Right face */}
      <path
        d={`M${x + w} ${y} L${x + w / 2} ${y + h / 2} L${x + w / 2} ${y + h / 2 + d} L${x + w} ${y + d} Z`}
        fill={right}
        stroke="#0A0A0A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Gear({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const teeth = 8;
  const outer = r;
  const inner = r * 0.7;
  const hole = r * 0.28;
  let path = "";
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.85) / teeth) * Math.PI * 2;
    const cmd = i === 0 ? "M" : "L";
    path += `${cmd}${cx + Math.cos(a0) * outer} ${cy + Math.sin(a0) * outer} `;
    path += `L${cx + Math.cos(a1) * outer} ${cy + Math.sin(a1) * outer} `;
    path += `L${cx + Math.cos(a2) * inner} ${cy + Math.sin(a2) * inner} `;
    path += `L${cx + Math.cos(a3) * inner} ${cy + Math.sin(a3) * inner} `;
  }
  path += "Z";
  return (
    <g>
      <path d={path} fill={color} stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={hole} fill="#FAFAFA" stroke="#0A0A0A" strokeWidth="1.5" />
    </g>
  );
}

function TinyPerson({ x, y, wave = false }: { x: number; y: number; wave?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" fill="#0A0A0A">
      <circle cx={0} cy={-16} r={4} />
      <path d="M0 -12 L0 2" fill="none" />
      <path d={wave ? "M0 -6 L-7 0 M0 -6 L8 -10" : "M0 -6 L-6 2 M0 -6 L6 2"} fill="none" />
      <path d="M0 2 L-5 14 M0 2 L5 14" fill="none" />
    </g>
  );
}