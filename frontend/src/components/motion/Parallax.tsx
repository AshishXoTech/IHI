"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/providers/MotionProvider";
import { clsx } from "clsx";

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // 1 = normal scroll, < 1 = slower (background), > 1 = faster (foreground)
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotion();

  useEffect(() => {
    if (isReducedMotion || !targetRef.current) return;

    // Calculate Y movement based on speed. 
    // e.g., speed 0.5 means it moves 50% slower than scroll
    const yPercent = (1 - speed) * 100;

    const animation = gsap.to(targetRef.current, {
      yPercent: yPercent,
      ease: "none", // Must be linear for scrub
      scrollTrigger: {
        trigger: targetRef.current,
        start: "top bottom", // Start when top of element hits bottom of viewport
        end: "bottom top",   // End when bottom of element hits top of viewport
        scrub: true,         // Sync exactly with scrollbar
      },
    });

    return () => {
      animation.kill();
    };
  }, [isReducedMotion, speed]);

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div ref={targetRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}