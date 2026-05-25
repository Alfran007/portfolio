"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Moncy-style custom cursor: small dot + larger trailing ring that grows
 * on hover over interactive elements. Hidden on touch devices.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch =
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      "ontouchstart" in window;
    if (touch) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role=button], input, textarea, select, [data-cursor=hover]"
      );
      setHovering(!!interactive);
    };

    let raf: number;
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${current.current.x - 16}px, ${current.current.y - 16}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[200] size-1.5 rounded-full bg-cyan-300 mix-blend-screen"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed top-0 left-0 z-[200] rounded-full border mix-blend-screen transition-[width,height,border-color,opacity] duration-200 ${
          hovering
            ? "size-12 border-violet-300/80 opacity-90 -ml-3 -mt-3"
            : "size-8 border-cyan-300/70 opacity-80"
        }`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
