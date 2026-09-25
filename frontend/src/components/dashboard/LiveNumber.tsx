"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/providers/MotionProvider";

interface LiveNumberProps {
  value: number | string;
  label: string;
  signal?: "accent" | "good" | "attention" | "critical";
  className?: string;
}

const SIGNAL_COLORS = {
  accent: "bg-accent-signal",
  good: "bg-signal-good",
  attention: "bg-signal-attention",
  critical: "bg-signal-critical",
};

export function LiveNumber({
  value,
  label,
  signal = "accent",
  className = "text-heading-md",
}: LiveNumberProps) {
  const reducedMotion = useReducedMotion();
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger re-render of the motion block on value change
  useEffect(() => {
    setPulseKey((k) => k + 1);
  }, [value]);

  return (
    <div className="relative inline-flex items-center">
      {/* 
        A11y: Polite live region. Spec §Accessibility:
        "Animated counters announce final value via a polite live region"
      */}
      <div aria-live="polite" className="sr-only">
        {label} updated to {value}
      </div>

      {/* 
        Motion: Flash overlay. Spec §Motion:
        Animates opacity ONLY (0 -> 0.2 -> 0), never background-color.
        Bypassed entirely if prefers-reduced-motion is true.
      */}
      {!reducedMotion && pulseKey > 1 && (
        <motion.div
          key={pulseKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute -inset-1 rounded-sm ${SIGNAL_COLORS[signal]}`}
          aria-hidden="true"
        />
      )}

      {/* 
        Typography: Spec §Typography:
        JetBrains Mono reserved exclusively for numeric literal values.
      */}
      <span className={`relative z-10 font-mono ${className}`}>
        {value}
      </span>
    </div>
  );
}