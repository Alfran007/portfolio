"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Full-page loader. THREE signal lanes feed the same bar — the previous
 * two-signal version (hero + contact) was exiting the moment the hero
 * image had decoded, leaving fonts, below-fold images, framer-motion
 * boot work, and CSS chunks still streaming in. The user saw the curtain
 * lift onto a half-rendered page with the browser's tab-loading spinner
 * still active.
 *
 *  - `hero-ready`    → hero asset has been painted
 *                        - Desktop: HeroScene's 3rd useFrame
 *                        - Mobile: `<Image onLoad>` on the WebP cutout
 *  - `contact-ready` → contact asset has been painted
 *                        - Desktop: BusinessmanScene's 3rd useFrame
 *                        - Mobile: `HeavyAssetPrefetcher` (immediate)
 *  - `window.load`   → the browser itself agrees that all initial
 *                      subresources (fonts, images, CSS, JS chunks) are
 *                      done loading. This is the same signal that stops
 *                      the browser tab's loading indicator, so by waiting
 *                      on it the in-page loader stays in sync with the
 *                      browser's own loading state.
 *
 *  Ramp cap is staged by how many signals have fired:
 *    0 ready → cap 30 (early — before anything paints)
 *    1 ready → cap 60
 *    2 ready → cap 90
 *    all 3   → snap to 100, exit
 *
 *  Mobile tick is 30 ms with a 14 % step rate (vs 60 ms / 6 % on
 *  desktop) so the bar visibly moves between signals instead of feeling
 *  stuck at a cap.
 *
 *  Hard fallback: 4 s on mobile, 10 s on desktop — generous enough to
 *  let `window.load` fire on a normal connection, but short enough that
 *  a stalled third-party resource can't strand the user behind the curtain.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let heroReady = false;
    let contactReady = false;
    let pageLoaded = document.readyState === "complete";
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let completed = false;

    const tickMs = isMobile ? 30 : 60;
    const stepFactor = isMobile ? 0.14 : 0.06;

    const readyCount = () =>
      (heroReady ? 1 : 0) + (contactReady ? 1 : 0) + (pageLoaded ? 1 : 0);

    const complete = () => {
      if (completed) return;
      completed = true;
      if (tickInterval) clearInterval(tickInterval);
      setCount(100);
      // Tiny hold so users see the "100" land before the curtain lifts.
      exitTimer = setTimeout(() => setShow(false), 120);
    };

    const tryComplete = () => {
      if (heroReady && contactReady && pageLoaded) complete();
    };

    const markHero = () => {
      heroReady = true;
      tryComplete();
    };
    const markContact = () => {
      contactReady = true;
      tryComplete();
    };
    const markLoad = () => {
      pageLoaded = true;
      tryComplete();
    };
    window.addEventListener("hero-ready", markHero);
    window.addEventListener("contact-ready", markContact);
    if (!pageLoaded) window.addEventListener("load", markLoad);

    // Hard fallback — generous enough to let window.load fire on a normal
    // connection, but bounded so a stalled third-party resource can't
    // strand the user.
    const maxTimeout = setTimeout(
      () => {
        heroReady = true;
        contactReady = true;
        pageLoaded = true;
        complete();
      },
      isMobile ? 4000 : 10000,
    );

    // Ramp toward a cap that depends on how many signals have fired. The
    // bar always moves visibly during the wait, but it can't ever reach
    // 100 until everything is truly ready — so "100" honestly means the
    // page is interactive.
    tickInterval = setInterval(() => {
      setCount((c) => {
        if (completed) return c;
        const ready = readyCount();
        const cap = [30, 60, 90, 100][ready];
        const remaining = Math.max(0, cap - c);
        if (remaining <= 0) return c;
        const step = Math.max(1, Math.ceil(remaining * stepFactor));
        return Math.min(cap, c + step);
      });
    }, tickMs);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      window.removeEventListener("contact-ready", markContact);
      window.removeEventListener("load", markLoad);
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
