"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Bridges the `contact-ready` signal for the mobile path.
 *
 * On desktop, `BusinessmanScene` itself dispatches `contact-ready` from its
 * first `useFrame` once the Canvas has flushed real pixels — that's the
 * "true" signal that Contact's heavy assets are live on screen.
 *
 * On mobile, the BusinessmanScene block is removed from Contact's JSX
 * entirely, so the desktop signal never fires. The WelcomeLoader doesn't
 * render on mobile either — but we still dispatch a synthetic
 * `contact-ready` immediately so any defensive listener (or future code
 * that reads the event) doesn't sit waiting forever.
 */
export default function HeavyAssetPrefetcher() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobile) return;
    window.dispatchEvent(new Event("contact-ready"));
  }, [isMobile]);

  return null;
}
