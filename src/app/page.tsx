import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import { serverIsMobile } from "@/lib/serverIsMobile";

// Render on the Edge runtime. This route is dynamic (it reads the User-Agent
// via headers() to pick the mobile/desktop tree), so it can't be statically
// CDN-cached — but Edge has near-zero cold start and runs at a POP close to the
// user, removing the multi-second serverless cold-start wait ("opens after a
// few seconds") while keeping the per-device SSR architecture intact.
export const runtime = "edge";

/**
 * Server component. We compute `isMobile` once on the server from the
 * `User-Agent` header and pass it down to the components that branch
 * on viewport (`Hero` + `Contact`). The SSR HTML now matches the
 * device — no more "server rendered the desktop tree (with WebGL
 * placeholders), then the mobile client had to download the WebGL
 * chunks just to hydrate before swapping to the mobile tree". That
 * mismatch was costing 10–15 s of mobile network + main-thread time
 * before any below-fold content became visible.
 *
 * Every below-fold section (About, Experience, Skills, Projects,
 * Certifications) is plain server-rendered HTML with no motion
 * gating, so the SSR HTML is fully visible the instant the browser
 * parses it.
 */
export default async function Home() {
  const isMobile = await serverIsMobile();
  return (
    <>
      <Hero isMobile={isMobile} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact isMobile={isMobile} />
    </>
  );
}
