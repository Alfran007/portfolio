"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Lean full-page loader. The counter ramps to 85% on its own pace, then
 * holds until `hero-ready` fires (HeroScene flushed its first frame) and
 * runs the final 85→100 ramp before sliding off. 4 s hard fallback so a
 * stalled WebGL boot never strands the user.
 *
 * Intentionally NOT gated on `window.load` or `document.fonts.ready` — those
 * signals waited on every image and every webfont decode, adding 1.5–3 s
 * on top of an already-visible page without blocking anything the user
 * actually sees behind the curtain.
 *
 * Mobile DOES NOT render the loader at all. Phones no longer mount the 3D
 * avatar (just a ~39 KB transparent WebP), so there's no heavy boot to
 * mask. The initial `show` state is derived synchronously from `isMobile`,
 * so on touch devices the loader markup never even renders.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const isMobile = useIsMobile();
  // Initial show state is derived synchronously from `isMobile` so the very
  // first client render on a phone already has the loader hidden — no SSR
  // → hydrate → setShow(false) flicker, no extra frame of dark curtain
  // before the page is visible. Desktop still starts with `show=true` so
  // the loader gates the heavy WebGL boot as before.
  const [show, setShow] = useState(() => !isMobile);

  // If the viewport flips into mobile after mount (e.g. desktop window
  // resize past the breakpoint), dismiss the loader immediately.
  useEffect(() => {
    if (isMobile) setShow(false);
  }, [isMobile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip the heavy ramp/wait machinery on mobile — it's already hidden.
    if (isMobile) return;

    // The loader holds near 90% until `hero-ready` fires (HeroScene flushed
    // its first frame). Once that fires we ramp through to 100 and exit.
    // 4 s hard fallback releases regardless so a stalled WebGL boot can
    // never strand the user.
    const heroReady = { current: false };
    const markHero = () => {
      heroReady.current = true;
    };
    window.addEventListener("hero-ready", markHero);

    const maxTimeout = setTimeout(() => {
      heroReady.current = true;
    }, 4000);

    // Drive the bar directly off React state with the functional updater
    // form of `setCount`. That removes any reliance on a closure-captured
    // local variable (the old `let v` could desync from state under
    // StrictMode double-mount / fast-refresh and made the bar appear
    // stuck at 00% if React batched the first few ticks). Using
    // `setCount(c => ...)` guarantees each tick reads the latest value.
    //
    // Curve: until hero-ready we ease from 0 toward 90, slower as we
    // approach the cap so it doesn't visibly slam to 90 and sit there.
    // Once hero-ready fires we close the remaining gap in big strides
    // until we hit 100, then exit.
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    const tick = setInterval(() => {
      setCount((c) => {
        if (heroReady.current) {
          if (c >= 100) {
            // Already at 100 — schedule exit once.
            if (!exitTimer) {
              exitTimer = setTimeout(() => setShow(false), 120);
            }
            return c;
          }
          // Sprint to 100 in ~3 ticks (~96 ms) once hero is ready.
          return Math.min(100, c + Math.max(6, Math.ceil((100 - c) / 3)));
        }
        // Pre-hero-ready: ease toward 90 so the bar always visibly moves
        // even when the GLB takes a while. Step shrinks as we approach
        // the cap so we don't slam into it.
        const remaining = Math.max(0, 90 - c);
        if (remaining <= 0) return c;
        const step = Math.max(1, Math.ceil(remaining * 0.06));
        return Math.min(90, c + step);
      });
    }, 60);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      clearTimeout(maxTimeout);
      if (exitTimer) clearTimeout(exitTimer);
      clearInterval(tick);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-end justify-end p-8 sm:p-12 bg-[#050405]"
        >
          {/* Subtle ambient cyan/violet glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[60vmin] rounded-full bg-cyan-500/12 blur-[120px]" />
            <div className="absolute left-[60%] top-[55%] -translate-x-1/2 -translate-y-1/2 size-[45vmin] rounded-full bg-violet-500/12 blur-[100px]" />
          </div>

          {/* Top-left brand mark */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-8 left-8 font-mono text-xs tracking-[0.35em] uppercase text-cyan-300/80"
          >
            ◉ SYED ALFRAN ALI
          </motion.div>

          {/* Loading caption — top-right, mirrors the brand mark */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute top-8 right-8 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 flex items-center gap-2"
          >
            <span className="size-1 rounded-full bg-cyan-400 animate-pulse" />
            Loading experience
          </motion.div>

          {/* Big percentage — bottom-right */}
          <div className="relative font-display text-[22vw] sm:text-[16vw] lg:text-[12vw] leading-none text-white tabular-nums">
            {count.toString().padStart(2, "0")}
            <span className="text-gradient-accent">%</span>
          </div>

          {/* Bottom progress bar */}
          <div
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-cyan-400 via-violet-400 to-blue-400 transition-[width] duration-100 ease-linear"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
