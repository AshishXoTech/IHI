"use client";

import React from "react";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";

/**
 * IHIEngineScene — Full-width isometric world
 * Sits between Features and Dashboard.
 * Giant 3D I H I + conveyors + tiny people + tech blocks.
 */
export function IHIEngineScene({ className = "" }: { className?: string }) {
  return (
    <section
      id="engine"
      aria-label="IHI Hackathon Engine"
      className={clsx(
        "relative overflow-hidden border-t border-gray-100 bg-[#F7F7F5]",
        className
      )}
    >
      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        {/* Label */}
        <FadeInUp className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            The Hackathon Intelligence Engine
          </div>
          <p className="mt-4 font-body text-sm text-gray-500">
            One living system — from idea to podium.
          </p>
        </FadeInUp>

        {/* Scene stage */}
        <FadeInUp>
          <div className="relative mx-auto h-[340px] w-full max-w-5xl sm:h-[420px] md:h-[480px] lg:h-[520px]">
            <EngineSVG />
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Full isometric SVG scene
   ═══════════════════════════════════════════════════════════ */

function EngineSVG() {
  return (
    <svg
      viewBox="0 0 1000 560"
      className="h-full w-full drop-shadow-sm"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Conveyor rails ── */}
      <g stroke="#C4C4C0" strokeWidth="14" strokeLinecap="round" opacity="0.9">
        <path d="M40 380 C200 320, 350 300, 480 310" />
        <path d="M480 310 C620 320, 780 300, 960 340" />
        <path d="M120 420 C280 460, 500 470, 720 440 C840 420, 920 400, 980 390" />
      </g>
      {/* Rail tops (lighter) */}
      <g stroke="#E8E8E4" strokeWidth="6" strokeLinecap="round" opacity="0.8">
        <path d="M40 374 C200 314, 350 294, 480 304" />
        <path d="M480 304 C620 314, 780 294, 960 334" />
      </g>

      {/* ── Left: { brace ── */}
      <g className="origin-center" style={{ transformOrigin: "120px 280px" }}>
        <LetterBlock
          paths={{
            // Simplified chunky brace as blocky shape
            top: "M70 200 L110 180 L130 200 L130 240 L100 255 L100 280 L130 295 L130 360 L110 380 L70 360 Z",
          }}
          color="#D4D4D4"
          dark="#A3A3A3"
          x={0}
          y={0}
        />
        {/* Use extruded path for brace */}
        <ExtrudedLetter color="#E5E5E5" dark="#A3A3A3" delay="0s">
          <path d="M95 210 C95 210, 70 210, 70 240 L70 250 C70 270, 90 275, 90 290 C90 305, 70 310, 70 330 L70 350 C70 380, 95 380, 95 380 L95 355 C95 355, 85 355, 85 340 L85 325 C85 310, 105 305, 105 290 C105 275, 85 270, 85 255 L85 240 C85 225, 95 225, 95 225 Z" />
        </ExtrudedLetter>
      </g>

      {/* ── I (RED) ── */}
      <g className="animate-float" style={{ transformOrigin: "280px 260px", animationDuration: "6s", animationDelay: "0.1s" }}>
        <ExtrudedLetter color="#E4574C" dark="#B8362B" delay="0.1s">
          {/* Tall I bar */}
          <path d="M250 175 L310 145 L330 165 L330 355 L310 375 L250 345 Z" />
        </ExtrudedLetter>
        {/* Front face detail */}
        <path
          d="M255 185 L305 160 L305 350 L255 335 Z"
          fill="#E4574C"
          stroke="#0A0A0A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Side */}
        <path
          d="M305 160 L325 175 L325 365 L305 350 Z"
          fill="#B8362B"
          stroke="#0A0A0A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Top */}
        <path
          d="M255 185 L275 170 L325 175 L305 160 Z"
          fill="#F07169"
          stroke="#0A0A0A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Tiny person on I */}
        <TinyPerson x={280} y={155} />
      </g>

      {/* ── H (GREEN) ── */}
      <g className="animate-float-slow" style={{ transformOrigin: "480px 250px", animationDuration: "7s", animationDelay: "0.3s" }}>
        {/* Left pillar */}
        <path d="M400 170 L440 148 L455 165 L455 360 L440 378 L400 350 Z" fill="#1E875A" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        <path d="M405 180 L440 160 L440 355 L405 340 Z" fill="#2FB67C" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Right pillar */}
        <path d="M510 155 L550 135 L565 152 L565 348 L550 366 L510 338 Z" fill="#1E875A" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        <path d="M515 165 L550 148 L550 343 L515 328 Z" fill="#2FB67C" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Crossbar */}
        <path d="M440 250 L550 230 L550 270 L440 290 Z" fill="#2FB67C" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M550 230 L565 242 L565 282 L550 270 Z" fill="#1E875A" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        {/* Ladder on H */}
        <g stroke="#0A0A0A" strokeWidth="1.5" opacity="0.7">
          <path d="M520 160 L520 230" />
          <path d="M535 155 L535 225" />
          <path d="M520 175 H535 M520 190 H535 M520 205 H535" />
        </g>
        <TinyPerson x={528} y={148} />
      </g>

      {/* ── I (BLUE) ── */}
      <g className="animate-float" style={{ transformOrigin: "680px 255px", animationDuration: "6.5s", animationDelay: "0.5s" }}>
        <path d="M640 165 L700 138 L720 158 L720 350 L700 370 L640 340 Z" fill="#2A50BD" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        <path d="M645 175 L695 155 L695 345 L645 330 Z" fill="#3E6FF3" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M695 155 L715 168 L715 358 L695 345 Z" fill="#2A50BD" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        <path d="M645 175 L665 160 L715 168 L695 155 Z" fill="#5B8AF5" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round" />
        {/* Window slits on blue I */}
        <path d="M655 200 H685 V230 H655 Z" fill="#0A0A0A" opacity="0.35" />
        <path d="M655 250 H685 V280 H655 Z" fill="#0A0A0A" opacity="0.35" />
        <TinyPerson x={670} y={150} />
      </g>

      {/* ── Right: } brace ── */}
      <g className="animate-float-slow" style={{ transformOrigin: "820px 280px", animationDuration: "8s", animationDelay: "0.2s" }}>
        <ExtrudedLetter color="#E5E5E5" dark="#A3A3A3" delay="0.2s">
          <path d="M790 210 C790 210, 815 210, 815 240 L815 250 C815 270, 795 275, 795 290 C795 305, 815 310, 815 330 L815 350 C815 380, 790 380, 790 380 L790 355 C790 355, 800 355, 800 340 L800 325 C800 310, 780 305, 780 290 C780 275, 800 270, 800 255 L800 240 C800 225, 790 225, 790 225 Z" />
        </ExtrudedLetter>
      </g>

      {/* ── Tech blocks on conveyors ── */}
      <g className="animate-float" style={{ animationDuration: "5s", animationDelay: "0s" }}>
        {/* JS block */}
        <IsometricTile x={80} y={400} size={70} top="#F7DF1E" left="#D4BC00" right="#B8A200" label="JS" labelColor="#0A0A0A" />
      </g>
      <g className="animate-float-slow" style={{ animationDuration: "6s", animationDelay: "0.4s" }}>
        <IsometricTile x={200} y={430} size={56} top="#3776AB" left="#2D5F8A" right="#1E4060" label="PY" labelColor="#FFD43B" />
      </g>
      <g className="animate-float" style={{ animationDuration: "5.5s", animationDelay: "0.8s" }}>
        {/* React-ish */}
        <IsometricTile x={780} y={400} size={64} top="#1A1A1A" left="#0D0D0D" right="#333" label="⚛" labelColor="#61DAFB" />
      </g>
      <g className="animate-float-slow" style={{ animationDuration: "7s", animationDelay: "0.2s" }}>
        <IsometricTile x={880} y={360} size={50} top="#FAFAFA" left="#E5E5E5" right="#D4D4D4" label="TS" labelColor="#3178C6" />
      </g>

      {/* Green server stack */}
      <g className="animate-float" style={{ animationDuration: "6s", animationDelay: "1s" }}>
        <IsometricTile x={560} y={400} size={48} top="#2FB67C" left="#1E875A" right="#166B48" />
        <IsometricTile x={560} y={375} size={48} top="#3DD68C" left="#2FB67C" right="#1E875A" />
        <TinyPerson x={584} y={365} />
      </g>

      {/* ── Forklift-ish crate ── */}
      <g className="animate-float-slow" style={{ animationDuration: "9s" }}>
        <IsometricTile x={40} y={280} size={40} top="#E4C65A" left="#C9A227" right="#A4841C" />
        <IsometricTile x={40} y={255} size={40} top="#E4C65A" left="#C9A227" right="#A4841C" />
      </g>

      {/* ── Tiny people walking ── */}
      <TinyPerson x={150} y={395} />
      <TinyPerson x={350} y={400} wave />
      <TinyPerson x={500} y={390} />
      <TinyPerson x={750} y={410} />
      <TinyPerson x={900} y={380} />

      {/* ── Floating bolts / particles ── */}
      <g fill="#0A0A0A" opacity="0.35">
        <circle cx="180" cy="300" r="3" />
        <circle cx="420" cy="420" r="2.5" />
        <circle cx="620" cy="180" r="3" />
        <circle cx="850" cy="280" r="2.5" />
      </g>

      {/* ── Pulsing AI node between H and I ── */}
      <g>
        <circle cx="600" cy="300" r="7" fill="#C9A227">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="300" r="14" fill="none" stroke="#C9A227" strokeWidth="1.5">
          <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Data stream dashes */}
      <g stroke="#0A0A0A" strokeWidth="1.25" strokeDasharray="5 5" opacity="0.2">
        <path d="M330 260 L400 250" />
        <path d="M555 250 L640 230" />
        <path d="M310 360 L400 380" />
      </g>
    </svg>
  );
}

/* ── primitives ── */

function ExtrudedLetter({
  children,
  color,
  dark,
  delay,
}: {
  children: React.ReactNode;
  color: string;
  dark: string;
  delay: string;
}) {
  return <g>{children}</g>;
}

function LetterBlock({
  paths,
  color,
  dark,
  x,
  y,
}: {
  paths: { top: string };
  color: string;
  dark: string;
  x: number;
  y: number;
}) {
  return null;
}

function IsometricTile({
  x,
  y,
  size,
  top,
  left,
  right,
  label,
  labelColor = "#0A0A0A",
}: {
  x: number;
  y: number;
  size: number;
  top: string;
  left: string;
  right: string;
  label?: string;
  labelColor?: string;
}) {
  const w = size;
  const h = size * 0.5;
  const d = size * 0.45;
  return (
    <g>
      <path
        d={`M${x} ${y} L${x + w / 2} ${y - h / 2} L${x + w} ${y} L${x + w / 2} ${y + h / 2} Z`}
        fill={top}
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d={`M${x} ${y} L${x + w / 2} ${y + h / 2} L${x + w / 2} ${y + h / 2 + d} L${x} ${y + d} Z`}
        fill={left}
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d={`M${x + w} ${y} L${x + w / 2} ${y + h / 2} L${x + w / 2} ${y + h / 2 + d} L${x + w} ${y + d} Z`}
        fill={right}
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {label && (
        <text
          x={x + w / 2}
          y={y + 4}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={size * 0.28}
          fontWeight="800"
          fill={labelColor}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function TinyPerson({ x, y, wave = false }: { x: number; y: number; wave?: boolean }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke="#0A0A0A"
      strokeWidth="2.25"
      strokeLinecap="round"
      fill="#0A0A0A"
    >
      <circle cx={0} cy={-14} r={4.5} />
      <path d="M0 -9 L0 4" fill="none" />
      <path d={wave ? "M0 -4 L-7 2 M0 -4 L8 -8" : "M0 -4 L-6 4 M0 -4 L6 4"} fill="none" />
      <path d="M0 4 L-5 16 M0 4 L5 16" fill="none" />
    </g>
  );
}