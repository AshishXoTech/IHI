"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ── Context shape ── */
interface MotionContextValue {
  /** True when the OS / browser requests reduced motion. */
  reducedMotion: boolean;
}

const MotionContext = createContext<MotionContextValue | null>(null);

/* ── Provider ── */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value on mount
    setReducedMotion(mql.matches);

    // React to OS-level changes mid-session
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <MotionContext.Provider value={{ reducedMotion }}>
      {children}
    </MotionContext.Provider>
  );
}

/* ── Primary hook (spec name) ── */
export function useReducedMotion(): boolean {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error(
      "useReducedMotion must be used inside <MotionProvider>. " +
        "Wrap your root layout."
    );
  }
  return ctx.reducedMotion;
}

/* ── Legacy alias — keeps existing components compiling during migration ── */
export function useMotion() {
  return { isReducedMotion: useReducedMotion() };
}