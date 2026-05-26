"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Mounts its children only when the wrapper scrolls into the viewport
 * (or comes within `rootMargin` of it). Until then it renders an empty
 * placeholder of `minHeight` so the page layout / scroll position stays
 * stable while sections boot up.
 *
 * Use to keep below-the-fold sections from running their motion / Three.js
 * / image-load work during the initial paint window. On mobile, mounting
 * everything at once pegs the main thread for many seconds and leaves the
 * browser's "loading" indicator spinning long after the page is visible.
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
  const [mounted, setMounted] = useState(false);

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
