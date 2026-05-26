import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

/**
 * Server-component dispatcher. The mobile/desktop split happens here,
 * on the server, using the UA-derived `isMobile` prop computed by the
 * parent page from `headers()`. On mobile this means the SSR HTML
 * contains *only* the plain-HTML `HeroMobile` tree — `HeroDesktop`'s
 * client JS, framer-motion, and the dynamic `HeroScene` chunk
 * (R3F + three + drei) are never referenced and never shipped.
 *
 * Previously this lived in a single `"use client"` Hero with a
 * `useIsMobile()` branch — but `useIsMobile()` returns `false` during
 * SSR, so the SSR HTML always rendered the desktop tree (incl. the
 * `HeroScene` `next/dynamic` loading placeholder). On a mobile client
 * the browser had to fetch and parse those WebGL chunks just to
 * hydrate, even though they'd immediately be unmounted in favour of
 * the mobile branch. That was the headline cost behind the
 * "blank below-the-fold + browser loading bar for 10–15 s" problem.
 */
export default function Hero({ isMobile }: { isMobile: boolean }) {
  return isMobile ? <HeroMobile /> : <HeroDesktop />;
}
