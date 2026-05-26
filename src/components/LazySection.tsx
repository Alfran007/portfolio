"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Mounts its children only when the wrapper scrolls into the viewport
 * (or comes within `rootMargin` of it). Until then it renders an empty
 * placeholder of `minHeight` so the page layout / scroll position stays
 * stable while sections boot up.
 *
 * Originally added to keep below-the-fold sections from running their
 * motion / Three.js / image-load work during the initial paint window —
 * specifically to stop the main thread from being pegged by mounting
 * everything at once.
 *
 * **Touch devices skip the gate entirely.** Mobile now ships no WebGL
 * (Hero is a static WebP, Contact drops the BusinessmanScene block), so
 * the main-thread pressure that justified lazy mounting is gone. Keeping
 * it on phones meant the user saw blank placeholders below the fold and
 * had to wait for IntersectionObserver to fire as they scrolled — which
 * felt slow / broken. On touch we mount immediately so the SSR'd content
 * is interactive the instant the loader exits.
 *
 * Falls back to mounting immediately when IntersectionObserver is missing
 * so old browsers don't end up with permanently-empty sections.
 */
export default function LazySection({
  children,
  minHeight = "60vh",
  rootMargin = "300px",
}: {
  children: ReactNode;
  /** Reserved height before the section mounts. Pick something close to
   * the actual rendered height so the scrollbar doesn't jump. */
  minHeight?: string;
  /** Distance ahead of the viewport at which to start mounting. Bigger
   * value = earlier mount = smoother scroll into the section, at the cost
   * of more upfront work. */
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Mount synchronously on touch devices (read matchMedia in the initial
  // state so we never render a placeholder on phones, even for one frame).
  const [mounted, setMounted] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches
    );
  });

  useEffect(() => {
    if (mounted) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} style={mounted ? undefined : { minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
