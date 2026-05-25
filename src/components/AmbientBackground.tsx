"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight canvas starfield + drifting particles.
 * Pure 2D canvas (no R3F) so it can render globally without hydration cost on every section.
 */
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    type Star = { x: number; y: number; r: number; a: number; v: number; hue: number };
    const STAR_COUNT = Math.min(140, Math.floor((width * height) / 14000));
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.7 + 0.2,
      v: Math.random() * 0.15 + 0.02,
      hue: Math.random() > 0.5 ? 190 : 270, // cyan-ish vs violet-ish
    }));

    let raf = 0;
    let t = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      t += 0.005;

      for (const s of stars) {
        s.y += s.v;
        if (s.y > height) {
          s.y = -2;
          s.x = Math.random() * width;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t * 3 + s.x);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 90%, 70%, ${s.a * (0.5 + 0.5 * twinkle)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    function onResize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
      />
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none grid-bg opacity-50"
      />
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(34,211,238,0.10), transparent 70%), radial-gradient(60% 50% at 80% 100%, rgba(139,92,246,0.10), transparent 70%)",
        }}
      />
    </>
  );
}
