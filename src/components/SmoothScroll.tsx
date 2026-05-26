"use client";

import { ReactNode, useEffect } from "react";

/**
 * Lenis-powered smooth scroll on desktop only. On touch devices we leave the
 * browser's native momentum scrolling alone — Lenis hijacks `touchmove`,
 * cancels the OS momentum kernel, and runs a continuous rAF loop, which on
 * phones translates to "scroll feels laggy, page feels stuck". Native iOS /
 * Android scroll is already buttery; we just stay out of the way.
 *
 * Lenis is dynamically imported inside the effect so its ~7 KB never lands
 * in the mobile bundle. Touch devices return before the import fires.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (touch) return;

    let rafId = 0;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenisInstance = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        // easing curve roughly equivalent to easeOutExpo
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  return <>{children}</>;
}
