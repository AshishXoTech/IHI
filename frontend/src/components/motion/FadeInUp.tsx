"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/components/providers/MotionProvider";
import type { ReactNode } from "react";

type SupportedAs = "div" | "section" | "article" | "header" | "li";

interface FadeInUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rootMargin?: string;
  as?: SupportedAs;
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  rootMargin = "0px 0px -80px 0px",
  as = "div",
}: FadeInUpProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    switch (as) {
      case "section":
        return <section className={className}>{children}</section>;
      case "article":
        return <article className={className}>{children}</article>;
      case "header":
        return <header className={className}>{children}</header>;
      case "li":
        return <li className={className}>{children}</li>;
      default:
        return <div className={className}>{children}</div>;
    }
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: rootMargin }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </MotionComponent>
  );
}