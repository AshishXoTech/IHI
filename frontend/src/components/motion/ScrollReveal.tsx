"use client";

import { motion, type Variants } from "framer-motion";
import { useMotion } from "@/components/providers/MotionProvider";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const { isReducedMotion } = useMotion();

  // If user prefers reduced motion, return static element immediately (§2.7)
  if (isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
      scale: direction === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7, // Spec §2.7: 500-700ms decelerating
        ease: [0.16, 1, 0.3, 1], // Ease-out-expo cubic-bezier tuple
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} // Triggers slightly before scrolling into view
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}