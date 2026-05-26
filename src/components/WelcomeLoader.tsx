"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-page loader. Earlier this waited on `window.load` as a third
 * signal — but `window.load` fires only when ALL initial subresources
 * (every image, every font file, every JS chunk including dynamic
 * imports kicked off by client components) have finished. On a slow
 * mobile network that took 10–20 s, leaving the user behind the curtain
 * staring at "90 %" while the rest of the page silently streamed in.
 *
 * Now the curtain lifts as soon as the hero (the only thing visible
 * above the fold) has painted, plus a short safety floor so the
 * percentage animation doesn't feel like a teleport.
 *
 *  - `hero-ready` → hero asset painted
 *                     - Desktop: HeroScene's 3rd useFrame
 *                     - Mobile: `<Image onLoad>` on the WebP cutout
 *
 * Hard fallback: 2 s on mobile, 5 s on desktop. Below-fold sections
 * are now plain server-rendered HTML — they don't need the loader to
 * hide them while JS boots, because there's nothing hidden in them.
 */
export default function WelcomeLoader({ isMobile }: { isMobile: boolean }) {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let heroReady = false;
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let completed = false;

    const tickMs = isMobile ? 24 : 40;
    const stepFactor = isMobile ? 0.22 : 0.12;

    const complete = () => {
      if (completed) return;
      completed = true;
      if (tickInterval) clearInterval(tickInterval);
      setCount(100);
      exitTimer = setTimeout(() => setShow(false), 100);
    };

    const markHero = () => {
      heroReady = true;
      complete();
    };
    window.addEventListener("hero-ready", markHero);

    // Hard fallback — keeps the curtain from stranding the user if the
    // hero asset never reports back.
    const maxTimeout = setTimeout(
      () => {
        heroReady = true;
        complete();
      },
      isMobile ? 2000 : 5000,
    );

    // Ramp toward 90 while we wait for `hero-ready`; on the signal we
    // snap to 100 and exit.
    tickInterval = setInterval(() => {
      setCount((c) => {
        if (completed) return c;
        const cap = heroReady ? 100 : 90;
        const remaining = Math.max(0, cap - c);
        if (remaining <= 0) return c;
        const step = Math.max(1, Math.ceil(remaining * stepFactor));
        return Math.min(cap, c + step);
      });
    }, tickMs);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      clearTimeout(maxTimeout);
      if (exitTimer) clearTimeout(exitTimer);
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
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
