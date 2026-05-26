import { headers } from "next/headers";

const MOBILE_UA_RE =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Kindle|Silk/i;

/**
 * Server-side mobile detection from the `User-Agent` header. Returns
 * `true` for phones (and the small tablets that report themselves as
 * mobile). iPads on iOS 13+ identify as desktop Safari by default and
 * we deliberately let them through to the desktop layout — their
 * viewports are large enough to handle it.
 *
 * Why this exists:
 * `useIsMobile()` reads `matchMedia` synchronously on the client, but
 * during SSR `window` is missing so it returns `false`. That meant
 * every render path that branched on `useIsMobile()` (Hero,
 * Contact, WelcomeLoader) was producing the *desktop* tree in the
 * SSR HTML — including the dynamic-imported `HeroScene` /
 * `BusinessmanScene` chunks, which on mobile then had to be fetched
 * (R3F + three.js + ~1 MB GLB) just so React could hydrate and
 * immediately swap them out for the mobile branch. That single
 * mismatch was burning 10–15 s of mobile network + main-thread time
 * before any below-fold content appeared, and was the source of the
 * "browser loading bar stays up forever" symptom.
 *
 * Calling `headers()` forces dynamic rendering — `/` is no longer
 * statically prerendered. For a low-traffic portfolio that's a fine
 * trade; SSR is sub-50 ms on Vercel and we save mobile users from
 * downloading code they can never see.
 */
export async function serverIsMobile(): Promise<boolean> {
  const h = await headers();
  const ua = h.get("user-agent") || "";
  return MOBILE_UA_RE.test(ua);
}
