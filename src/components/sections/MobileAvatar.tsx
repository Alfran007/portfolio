"use client";

import Image from "next/image";

/**
 * Tiny client island that owns the avatar `<Image>` so we can attach
 * `onLoad` and dispatch the `hero-ready` signal that `WelcomeLoader`
 * listens for. Splitting it out keeps the parent `HeroMobile` a pure
 * server component — no React state, no event handlers, no JS shipped
 * for the static text content.
 */
export default function MobileAvatar() {
  return (
    <Image
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
