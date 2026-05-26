"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Lean full-page loader. The bar progresses in three stages:
 *   - pre `hero-ready`:    eases toward 60  (HeroScene still loading)
 *   - hero-ready only:     eases toward 90  (Hero on screen, BusinessmanScene
 *                                            for Contact still streaming in
 *                                            the background)
 *   - hero + contact ready: sprints to 100, exits
 *
 * Folding Contact's `BusinessmanScene` chunk + 1 MB GLB into the loader
 * window means the user never sees a mid-scroll stutter when they reach
 * the Contact section — by the time the curtain slides off, both the
 * Hero avatar AND the businessman model are fully in the HTTP / module
 * cache. `HeavyAssetPrefetcher` runs the prefetch in parallel with the
 * Hero load and dispatches `contact-ready` when both promises settle.
 *
 * 8 s hard fallback releases regardless so a stalled WebGL boot or dead
 * network can never strand the user.
 *
 * Intentionally NOT gated on `window.load` or `document.fonts.ready` —
 * those signals waited on every image / webfont decode and added 1.5–3 s
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

    const heroReady = { current: false };
    const contactReady = { current: false };
    const markHero = () => {
      heroReady.current = true;
    };
    const markContact = () => {
      contactReady.current = true;
    };
    window.addEventListener("hero-ready", markHero);
    window.addEventListener("contact-ready", markContact);

    // 8 s hard fallback. Up from 4 s because the loader now also covers
    // Contact's 1 MB GLB load on top of Hero's avatar.
    const maxTimeout = setTimeout(() => {
      heroReady.current = true;
      contactReady.current = true;
    }, 8000);

    // Drive the bar directly off React state with `setCount(c => ...)` so
    // the source of truth is React, not a closure-captured local that
    // could desync under StrictMode double-mount.
    //
    // Curve in three stages: pre-hero → ease to 60, hero-only → ease to
    // 90, both-ready → sprint to 100. Each ease shrinks step size as we
    // approach its cap so the bar never visibly slams and pauses.
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    const tick = setInterval(() => {
      setCount((c) => {
        if (heroReady.current && contactReady.current) {
          if (c >= 100) {
            if (!exitTimer) {
              exitTimer = setTimeout(() => setShow(false), 120);
            }
            return c;
          }
          // Sprint to 100 in ~3 ticks (~180 ms).
          return Math.min(100, c + Math.max(6, Math.ceil((100 - c) / 3)));
        }
        const cap = heroReady.current ? 90 : 60;
        const remaining = Math.max(0, cap - c);
        if (remaining <= 0) return c;
        // 6 % of remaining each tick, floor of 1, so the bar always moves.
        const step = Math.max(1, Math.ceil(remaining * 0.06));
        return Math.min(cap, c + step);
      });
    }, 60);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      window.removeEventListener("contact-ready", markContact);
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
