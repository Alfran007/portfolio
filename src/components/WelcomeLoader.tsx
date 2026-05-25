"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Minimal Moncy-style loader: counter 0 → 100 in ~1.5s, then slides up.
 * No 3D, no fluff — just percentage. Plays once per browser session.
 */
export default function WelcomeLoader() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("welcome-played") === "1") {
      setShow(false);
      return;
    }
    let v = 0;
    const id = setInterval(() => {
      v += Math.floor(Math.random() * 12) + 6;
      if (v >= 100) {
        v = 100;
        setCount(100);
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("welcome-played", "1");
          setShow(false);
        }, 350);
      } else {
        setCount(v);
      }
    }, 35);
    return () => clearInterval(id);
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
