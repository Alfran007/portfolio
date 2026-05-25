"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when viewport is <= breakpoint OR the device reports a
 * touch-primary input. Used to skip expensive WebGL scenes on phones/tablets.
 *
 * Defaults to false on SSR / first paint so the desktop layout doesn't flash
 * mobile-only content. Components consuming this should be dynamically
 * imported with `ssr: false` if they branch on the value at render time.
 */
export function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

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
