import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

/**
 * Every section is mounted eagerly. We used to wrap below-the-fold
 * sections in `LazySection` (IntersectionObserver gate) to keep the
 * main thread free during initial paint, but that was tied to mobile
 * WebGL — which is gone now. The remaining sections are plain HTML +
 * framer-motion (which has its own viewport-aware `whileInView`
 * gating), so their mount cost is trivial.
 *
 * Lazy-mounting was also actively hurting perceived speed: after
 * `WelcomeLoader` exited, the user saw blank placeholders for About /
 * Experience / Skills / Projects / Certifications until they scrolled
 * and the observer fired. The matchMedia-in-useState trick we tried to
 * skip the gate on touch devices was unreliable because SSR runs
 * without `window` (initial state = false), and React's hydration
 * locks that state in. Removing the wrappers entirely means SSR'd
 * markup is fully present and interactive the instant the loader
 * curtain lifts.
 *
 * `Hero` and `Contact` are unchanged from before — `Contact` still
 * owns the heaviest below-fold work (BusinessmanScene + a 1 MB GLB),
 * and we deliberately mount it at page load so its chunk + GLB
 * download + first-frame render all happen inside the WelcomeLoader
 * window. The loader listens for `contact-ready` (dispatched by
 * BusinessmanScene's first useFrame) and holds the curtain until that
 * fires, so the user never sees a mid-scroll stutter on Contact.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </>
  );
}
