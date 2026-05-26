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

    // The loader holds at 85% until the Hero scene flushes its first frame
    // (`hero-ready`). Once that fires we ramp straight through to 100 and
    // exit — no font wait, no idle-callback buffer, no extra dwell. Those
    // gates were adding 1.5–3 s on top of an already-loaded page. Window
    // `load` and `fonts.ready` were the slowest signals (waiting on every
    // image, every webfont decode) yet they didn't actually block the Hero
    // from being visually correct.
    let heroReady = false;
    const markHero = () => {
      heroReady = true;
    };
    window.addEventListener("hero-ready", markHero);

    // 4 s hard fallback releases regardless so the user is never stranded
    // on a stalled WebGL boot. Down from 10 s — if the avatar hasn't
    // rendered in 4 s, something is wrong and we'd rather show the page.
    const maxTimeout = setTimeout(() => {
      heroReady = true;
    }, 4000);

    // Tick is 32 ms with 5–14 increments, so the bar reaches 85 in roughly
    // ~0.4 s and 100 in ~0.6 s — fast enough that on a warm cache the
    // loader is effectively a brief flash rather than a forced wait.
    let v = 0;
    const tick = setInterval(() => {
      const cap = heroReady ? 100 : 85;
      if (v >= cap) {
        if (v >= 100) {
          clearInterval(tick);
          // 120 ms dwell at 100% so the user sees the full bar before exit.
          setTimeout(() => setShow(false), 120);
        }
        return;
      }
      v += Math.floor(Math.random() * 10) + 5;
      if (v > cap) v = cap;
      setCount(v);
    }, 32);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      clearTimeout(maxTimeout);
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
