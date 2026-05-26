"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when viewport is <= breakpoint OR the device reports a
 * touch-primary input. Used to skip expensive WebGL scenes on phones/tablets
 * and to pick mobile-tuned framing for 3D scenes.
 *
 * Initial value is read SYNCHRONOUSLY from `window.matchMedia` when running
 * on the client (e.g. inside `dynamic({ ssr: false })` components like the
 * Hero canvas) so the very first render already gets the correct breakpoint.
 * That prevents the "desktop camera mounts → switches to mobile" flicker
 * where the R3F Canvas would otherwise initialize with the wrong FOV/camera
 * position and leave the avatar half-off-screen on phones.
 *
 * Falls back to `false` only when `window` is missing (true SSR path); SSR'd
 * components that read this value at render time should still be wrapped in
 * `dynamic({ ssr: false })` to avoid hydration mismatches.
 */
function evalIsMobile(breakpointPx: number): boolean {
  if (typeof window === "undefined") return false;
  const size = window.matchMedia(`(max-width: ${breakpointPx}px)`).matches;
  const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  return size || touch;
}

export function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(() => evalIsMobile(breakpointPx));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqlSize = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const mqlTouch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const evaluate = () => setIsMobile(mqlSize.matches || mqlTouch.matches);

    evaluate();
    mqlSize.addEventListener("change", evaluate);
    mqlTouch.addEventListener("change", evaluate);
    return () => {
      mqlSize.removeEventListener("change", evaluate);
      mqlTouch.removeEventListener("change", evaluate);
    };
  }, [breakpointPx]);

  return isMobile;
}
