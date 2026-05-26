"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Moncy-style full-page loader. Counter ramps to 90% on its own pace, then
 * holds there until the Hero scene finishes loading (listens for the
 * `hero-ready` event dispatched by HeroScene once the avatar GLB + first
 * frame are mounted). Falls back to dismissing after 10s so the user is
 * never stuck on a stalled WebGL load.
 *
 * Mobile DOES NOT render the loader at all. Phones no longer mount the 3D
 * avatar (just a 188 KB WebP), so there's no heavy boot to mask — the
 * loader just delays the first usable frame. We dismiss it on the very
 * first client render on touch devices.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  // Mobile: skip the loader entirely once we know we're on a phone. The
  // SSR pass still renders the loader markup (so the page doesn't flash
  // unstyled content while JS downloads), then React hydrates, this hook
  // resolves `isMobile = true`, and the loader unmounts immediately.
  useEffect(() => {
    if (isMobile) setShow(false);
  }, [isMobile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip the heavy ramp/wait machinery on mobile — it's already hidden.
    if (isMobile) return;

    // The loader holds at 90% until ALL of these signals fire:
    //   1. `hero-ready` — HeroScene has flushed 3 rendered frames (the GLB
    //                     is on screen, not just uploaded to the GPU)
    //   2. window `load` — every sync resource (HTML, CSS, images) finished
    //   3. `fonts.ready` — every webfont is decoded so text isn't FOUT-ing
    //                       under the loader exit
    //   4. `buffer` — a short dwell AFTER 1–3 so the React tree has a beat
    //                  to paint section content (avoids the "loader hides
    //                  and the page is still snapping into place" flash)
    // 10s hard fallback releases regardless so the user is never stranded.
    const flags = { hero: false, win: false, fonts: false, buffer: false };
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

    // Webfonts: resolve `document.fonts.ready` (Inter, Space Grotesk,
    // JetBrains Mono). Older browsers without FontFace API fall through to
    // `fonts = true` immediately so we don't strand the loader.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          flags.fonts = true;
        })
        .catch(() => {
          flags.fonts = true;
        });
    } else {
      flags.fonts = true;
    }

    // Buffer: once hero + win + fonts are all green, wait for an idle frame
    // PLUS ~1s dwell before green-lighting the final 90→100 ramp. The idle
    // callback ensures the main thread is no longer pegged by React work
    // (initial section paints, Framer animations starting), and the 1s dwell
    // gives below-the-fold sections a beat to finish hydrating so the page
    // doesn't visibly snap into place the instant the curtain slides off.
    let bufferTimer: ReturnType<typeof setTimeout> | null = null;
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    };
    const armBuffer = () => {
      if (bufferTimer) return;
      bufferTimer = setTimeout(() => {
        const w = window as IdleWindow;
        const finish = () => {
          flags.buffer = true;
        };
        if (typeof w.requestIdleCallback === "function") {
          w.requestIdleCallback(finish, { timeout: 600 });
        } else {
          finish();
        }
      }, 1000);
    };

    const maxTimeout = setTimeout(() => {
      flags.hero = true;
      flags.win = true;
      flags.fonts = true;
      flags.buffer = true;
    }, 10000);

    let v = 0;
    const tick = setInterval(() => {
      const coreReady = flags.hero && flags.win && flags.fonts;
      if (coreReady) armBuffer();
      const allReady = coreReady && flags.buffer;
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
      if (bufferTimer) clearTimeout(bufferTimer);
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
