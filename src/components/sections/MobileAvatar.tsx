"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Tiny client island that owns the avatar `<Image>` so we can dispatch
 * the `hero-ready` signal that `WelcomeLoader` listens for. Splitting
 * it out keeps the parent `HeroMobile` a pure server component — no
 * React state, no event handlers, no JS shipped for the static text
 * content.
 *
 * Three independent paths fire `hero-ready`, taking whichever wins:
 *  1. The `<Image>`'s `onLoad` (most accurate — fires when the WebP
 *     decode finishes).
 *  2. On mount, if `img.complete` is already true. This handles the
 *     race where the browser parses the SSR HTML, downloads the
 *     `priority` image, completes it, and only THEN hydrates React —
 *     by the time React attaches its onLoad listener the event has
 *     already fired and would be missed.
 *  3. The loader's own hard fallback (1.5 s on mobile) — last resort.
 */
export default function MobileAvatar() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (typeof window === "undefined") return;
    // If the image already finished loading before React hydrated, the
    // native onLoad has fired and our React handler will never see it.
    // Check `complete` + `naturalWidth` (the latter weeds out broken
    // images) and dispatch immediately.
    if (img && img.complete && img.naturalWidth > 0) {
      window.dispatchEvent(new Event("hero-ready"));
    }
  }, []);

  return (
    <Image
      ref={ref}
      src="/avatar-mobile-v3.webp"
      alt="Syed Alfran Ali"
      width={610}
      height={1280}
      priority
      sizes="(max-width: 768px) 50vh, 0px"
      className="absolute left-1/2 -translate-x-1/2 top-[22vh] h-[72vh] w-auto max-w-none opacity-90"
      style={{ filter: "saturate(0.92) contrast(1.05) brightness(0.96)" }}
      draggable={false}
      onLoad={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("hero-ready"));
        }
      }}
    />
  );
}
