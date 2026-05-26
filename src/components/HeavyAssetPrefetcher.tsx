"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Warms the caches for assets that are NOT needed during the first paint
 * but cause a visible scroll-stutter when the user reaches them mid-scroll.
 *
 * Today that's the Contact section's `BusinessmanScene`:
 *   - the lazy chunk (`@/components/three/BusinessmanScene` + drei/three deps)
 *   - the GLB itself (`/businessman.glb`, ~1 MB) + Draco decoder
 *
 * Without this prefetch, scrolling toward Contact triggered a chunk
 * download + a 1 MB GLB fetch + a fresh WebGL context init all at once,
 * which pegged the main thread for ~1–2 s and made the page feel like
 * "scroll stuck on the Contact area".
 *
 * Strategy: wait for `hero-ready` (so we don't fight the avatar boot for
 * bandwidth), then in an idle callback fire-and-forget the chunk import
 * and a `fetch()` for the GLB. Both end up in the HTTP cache and the
 * Suspense layer in Contact resolves instantly when the user gets there.
 *
 * Skipped entirely on mobile — the mobile branch of Contact doesn't mount
 * BusinessmanScene, so prefetching it would waste cellular data.
 */
export default function HeavyAssetPrefetcher() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    };
    const idle = (cb: () => void) => {
      const w = window as IdleWindow;
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(cb, { timeout: 2000 });
      } else {
        setTimeout(cb, 1500);
      }
    };

    let cancelled = false;
    const prefetch = () => {
      if (cancelled) return;
      idle(() => {
        if (cancelled) return;
        // Chunk: trigger Next's dynamic-import of BusinessmanScene so the
        // JS is in the module cache by the time Contact mounts it.
        import("@/components/three/BusinessmanScene").catch(() => {});
        // GLB: warm the HTTP cache. We don't await — the browser will
        // satisfy the later <model>'s fetch from cache.
        fetch("/businessman.glb", { credentials: "omit", cache: "force-cache" }).catch(
          () => {},
        );
      });
    };

    // If Hero hasn't reported ready yet (cold load), wait for it. If we
    // missed the event (warm cache / fast machine), kick off after a
    // short delay so we don't compete with critical-path requests.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onHeroReady = () => {
      prefetch();
    };
    window.addEventListener("hero-ready", onHeroReady, { once: true });
    timeoutId = setTimeout(prefetch, 3500);

    return () => {
      cancelled = true;
      window.removeEventListener("hero-ready", onHeroReady);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMobile]);

  return null;
}
