"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/components/providers/MotionProvider";
import type { ReactNode } from "react";

type ContainerAs = "div" | "ul" | "ol" | "section";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  as?: ContainerAs;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  as = "div",
}: StaggerContainerProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    switch (as) {
      case "ul":
        return <ul className={className}>{children}</ul>;
      case "ol":
        return <ol className={className}>{children}</ol>;
      case "section":
        return <section className={className}>{children}</section>;
      default:
        return <div className={className}>{children}</div>;
    }
  }

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionComponent>
  );
}

/* ─────────────────────────────────────────────────────────
   Child item — vertical slide+fade, spec-compliant timing.
   ───────────────────────────────────────────────────────── */

type ItemAs = "div" | "li" | "article";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: ItemAs;
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    switch (as) {
      case "li":
        return <li className={className}>{children}</li>;
      case "article":
        return <article className={className}>{children}</article>;
      default:
        return <div className={className}>{children}</div>;
    }
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent className={className} variants={variants}>
      {children}
    </MotionComponent>
  );
}