"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/components/providers/MotionProvider";
import type { ReactNode } from "react";

type ScaleInAs = "div" | "section";

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ScaleInAs;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  as = "div",
}: ScaleInProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    switch (as) {
      case "section":
        return <section className={className}>{children}</section>;
      default:
        return <div className={className}>{children}</div>;
    }
  }

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionComponent>
  );
}