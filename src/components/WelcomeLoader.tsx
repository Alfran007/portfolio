"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Full-page loader. Two signal lanes feed the same bar:
 *
 *  Desktop (Hero + Contact each mount a WebGL canvas):
 *    - `hero-ready`    → ease toward 60 → 90
 *    - `contact-ready` → snap to 100, exit
 *
 *  Mobile (no WebGL, just a transparent avatar image):
 *    - `hero-ready`    → dispatched by Hero's `<Image onLoad>` once the
 *                        46 KB cutout has decoded
 *    - `contact-ready` → dispatched immediately on mount by
 *                        `HeavyAssetPrefetcher` (no GLB to wait on)
 *  Both fire within a couple hundred ms on a normal connection, so the
 *  mobile loader briefly ramps 0 → 100 and exits inside ~500 ms. The
 *  user sees clear progress feedback instead of a blank dark screen
 *  while the JS bundle finishes parsing.
 *
 *  Mobile tick is 30 ms with a 14 % step rate (vs 60 ms / 6 % on
 *  desktop) so the bar visibly moves while the image loads instead of
 *  crawling to 60 over ~900 ms.
 *
 *  Hard fallback: 1.5 s on mobile (no heavy boot), 8 s on desktop.
 *  Either way the user is never stranded behind the curtain.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let heroReady = false;
    let contactReady = false;
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let completed = false;

    const tickMs = isMobile ? 30 : 60;
    const stepFactor = isMobile ? 0.14 : 0.06;

    const complete = () => {
      if (completed) return;
      completed = true;
      if (tickInterval) clearInterval(tickInterval);
      setCount(100);
      // Tiny hold so users see the "100" land before the curtain lifts.
      exitTimer = setTimeout(() => setShow(false), 100);
    };

    const markHero = () => {
      heroReady = true;
      if (contactReady) complete();
    };
    const markContact = () => {
      contactReady = true;
      if (heroReady) complete();
    };
    window.addEventListener("hero-ready", markHero);
    window.addEventListener("contact-ready", markContact);

    // Hard fallback — shorter on mobile because there's no GLB / WebGL boot
    // to cover. A stalled font / image / chunk download can never strand
    // the user behind the loader.
    const maxTimeout = setTimeout(
      () => {
        heroReady = true;
        contactReady = true;
        complete();
      },
      isMobile ? 1500 : 8000,
    );

    // Ramp toward a moving cap while waiting for the signals. Once both
    // signals fire, `complete()` jumps straight to 100 and exits — no
    // staged sprint, no extra ticks. This keeps the loader's last frame
    // honest: 100 means "ready", not "almost".
    tickInterval = setInterval(() => {
      setCount((c) => {
        if (completed) return c;
        const cap = heroReady ? 90 : 60;
        const remaining = Math.max(0, cap - c);
        if (remaining <= 0) return c;
        const step = Math.max(1, Math.ceil(remaining * stepFactor));
        return Math.min(cap, c + step);
      });
    }, tickMs);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      window.removeEventListener("contact-ready", markContact);
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
