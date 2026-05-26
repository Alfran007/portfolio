"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Full-page loader. Two signal lanes feed the same bar:
 *
 *  Desktop (Hero + Contact each mount a WebGL canvas):
 *    - `hero-ready`    → ease toward 60 → 90
 *    - `contact-ready` → sprint to 100, exit
 *
 *  Mobile (no WebGL, just a transparent avatar image):
 *    - `hero-ready`    → dispatched by Hero's `<Image onLoad>` once the
 *                        46 KB cutout has decoded
 *    - `contact-ready` → dispatched immediately on mount by
 *                        `HeavyAssetPrefetcher` (no GLB to wait on)
 *  Both fire within a couple hundred ms on a normal connection, so the
 *  mobile loader briefly ramps 0 → 100 and exits inside ~600 ms. The
 *  user sees clear progress feedback instead of a blank dark screen
 *  while the JS bundle finishes parsing.
 *
 *  Hard fallback: 3 s on mobile (no heavy boot), 8 s on desktop.
 *  Either way the user is never stranded behind the curtain.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;

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

    // Hard fallback — shorter on mobile because there's no GLB / WebGL boot
    // to cover. A stalled font / image / chunk download can never strand
    // the user behind the loader.
    const maxTimeout = setTimeout(
      () => {
        heroReady.current = true;
        contactReady.current = true;
      },
      isMobile ? 3000 : 8000,
    );

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
            className="absolute top-6 left-6 sm:top-8 sm:left-8 font-mono text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase text-cyan-300/80"
          >
            ◉ SYED ALFRAN ALI
          </motion.div>

          {/* Loading caption — top-right, mirrors the brand mark */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/40 flex items-center gap-2"
          >
            <span className="size-1 rounded-full bg-cyan-400 animate-pulse" />
            Loading
          </motion.div>

          {/* Big percentage — bottom-right. Capped at 18 vw on phones so
              the digits don't blow out into the safe-area on a 320 px
              iPhone SE. */}
          <div className="relative font-display text-[18vw] sm:text-[16vw] lg:text-[12vw] leading-none text-white tabular-nums">
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
