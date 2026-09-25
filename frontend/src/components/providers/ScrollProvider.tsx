"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./MotionProvider";

gsap.registerPlugin(ScrollTrigger);

/* ── Context shape ── */
export interface ScrollProgressValue {
  scrollY: number;
  /** 0 → 1 normalized document scroll progress. */
  scrollProgress: number;
  velocity: number;
}

const ScrollProgressContext = createContext<ScrollProgressValue>({
  scrollY: 0,
  scrollProgress: 0,
  velocity: 0,
});

/* ── Provider ── */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);
  const [scrollData, setScrollData] = useState<ScrollProgressValue>({
    scrollY: 0,
    scrollProgress: 0,
    velocity: 0,
  });

  useEffect(() => {
    /* ================================================================
       REDUCED-MOTION PATH
       Lenis disabled. Native scroll. Passive listener feeds context.
       ================================================================ */
    if (reducedMotion) {
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();

      const onScroll = () => {
        const y = window.scrollY;
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrollData({
          scrollY: y,
          scrollProgress: max > 0 ? y / max : 0,
          velocity: 0,
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      return () => window.removeEventListener("scroll", onScroll);
    }

    /* ================================================================
       FULL-MOTION PATH
       Lenis → GSAP ScrollTrigger proxy → React context
       ================================================================ */
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    // Wire GSAP ScrollTrigger to read Lenis scroll output (spec §2.6)
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    // Feed both GSAP and React context on every Lenis tick
    lenis.on(
      "scroll",
      (e: { scroll: number; progress: number; velocity: number }) => {
        ScrollTrigger.update();
        setScrollData({
          scrollY: e.scroll,
          scrollProgress: e.progress,
          velocity: e.velocity,
        });
      }
    );

    // rAF loop — stored ref for deterministic cleanup
    const tick = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    ScrollTrigger.refresh();

    /* ── Cleanup (non-negotiable per spec §2.2) ── */
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, [reducedMotion]);

  return (
    <ScrollProgressContext.Provider value={scrollData}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

/* ── Hook for Framer Motion / any consumer ── */
export function useScrollProgress(): ScrollProgressValue {
  return useContext(ScrollProgressContext);
}