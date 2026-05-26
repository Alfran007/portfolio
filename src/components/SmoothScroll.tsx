"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered smooth scroll on desktop only. On touch devices we leave the
 * browser's native momentum scrolling alone — Lenis hijacks `touchmove`,
 * cancels the OS momentum kernel, and runs a continuous rAF loop, which on
 * phones translates to "scroll feels laggy, page feels stuck". Native iOS /
 * Android scroll is already buttery; we just stay out of the way.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (touch) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      // easing curve roughly equivalent to easeOutExpo
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
