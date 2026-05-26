"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Moncy-style full-page loader. Counter ramps to 90% on its own pace, then
 * holds there until the Hero scene finishes loading (listens for the
 * `hero-ready` event dispatched by HeroScene once the avatar GLB + first
 * frame are mounted). Falls back to dismissing after 5s so the user is never
 * stuck on a stalled WebGL load.
 *
 * Plays on every visit — no sessionStorage skip. The total time on a warm
 * cache is ~1.5s; on a cold mobile network it stays up until the avatar is
 * actually ready, so the page never reveals a half-loaded hero.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const readyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // The loader holds at 90% until ALL of these signals fire:
    //   1. `hero-ready`   — HeroScene has mounted its GLB + first frame
    //   2. window `load`  — all sync resources (HTML, CSS, fonts, images)
    //                        finished loading
    // Both signals are required so the loader covers the actual paint, not
    // just the avatar bytes. A 10s fallback releases the loader regardless
    // so it never strands the page on a stalled network.
    const flags = { hero: false, win: false };
    const markHero = () => {
      flags.hero = true;
    };
    const markWin = () => {
      flags.win = true;
    };

    window.addEventListener("hero-ready", markHero);
    if (document.readyState === "complete") {
      flags.win = true;
    } else {
      window.addEventListener("load", markWin);
    }

    const maxTimeout = setTimeout(() => {
      flags.hero = true;
      flags.win = true;
    }, 10000);

    let v = 0;
    const tick = setInterval(() => {
      const allReady = flags.hero && flags.win;
      const cap = allReady ? 100 : 90;
      if (v >= cap) {
        if (v >= 100) {
          clearInterval(tick);
          // Small dwell at 100% so the user sees the full bar before exit.
          setTimeout(() => setShow(false), 400);
        }
        return;
      }
      v += Math.floor(Math.random() * 6) + 2;
      if (v > cap) v = cap;
      setCount(v);
    }, 55);

    return () => {
      window.removeEventListener("hero-ready", markHero);
      window.removeEventListener("load", markWin);
      clearTimeout(maxTimeout);
      clearInterval(tick);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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
