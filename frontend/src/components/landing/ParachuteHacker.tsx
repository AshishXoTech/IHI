"use client";
import { motion, type Variants } from "framer-motion";

const floatVars: Variants = {
  animate: {
    y: ["-15px", "15px", "-15px"],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export function ParachuteHacker() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Contract Rule: Gold square/cube with ink border + hard shadow */}
      <motion.div
        variants={floatVars}
        animate="animate"
        className="absolute top-[15%] right-[10%] w-24 h-24 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      {/* Contract Rule: White circle with gold deep fill inside (Thick border equivalent) */}
      <motion.div
        variants={floatVars}
        animate="animate"
        className="absolute bottom-[20%] right-[5%] w-32 h-32 rounded-full bg-[var(--organizer-surface)] border-[12px] border-[var(--organizer-gold-deep)] shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)]"
      />
    </div>
  );
}