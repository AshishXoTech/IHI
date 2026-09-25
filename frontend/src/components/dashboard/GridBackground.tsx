'use client';

import { motion } from 'framer-motion';

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Warm paper gradient base */}
      <div className="absolute inset-0 bg-[#F9F9F6]" />

      {/* Subtle animated ambient gold radial light orb */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-radial-gradient from-[#C6A24A]/10 via-[#E8D9A8]/5 to-transparent blur-3xl"
      />

      {/* Subtle fine hairline grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0A0A0A 1px, transparent 1px),
            linear-gradient(to bottom, #0A0A0A 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top vignette gradient mask */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FFFFFF] via-[#F9F9F6]/80 to-transparent" />
    </div>
  );
}