import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import LazySection from "@/components/LazySection";

/**
 * Hero is the only section mounted eagerly — it owns the initial paint
 * and the WebGL avatar. Everything below the fold is wrapped in
 * `LazySection` so its motion / images / canvas work only kicks in when
 * the user scrolls toward it. This keeps the main thread free during the
 * first few seconds on mobile, where mounting all sections at once was
 * pegging CPU and keeping the browser's loading indicator spinning long
 * after the page was visually ready.
 *
 * `rootMargin` is generous (200–500 px) so the section is fully mounted
 * by the time the user reaches it — no pop-in.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LazySection minHeight="80vh" rootMargin="500px">
        <About />
      </LazySection>
      <LazySection minHeight="120vh" rootMargin="400px">
        <Experience />
      </LazySection>
      <LazySection minHeight="80vh" rootMargin="400px">
        <Skills />
      </LazySection>
      <LazySection minHeight="100vh" rootMargin="400px">
        <Projects />
      </LazySection>
      <LazySection minHeight="90vh" rootMargin="400px">
        <Certifications />
      </LazySection>
      {/* Contact is NOT lazy. It owns the heaviest below-fold work
          (BusinessmanScene + a 1 MB GLB), and we deliberately mount it at
          page load so its chunk + GLB download + parse + first-frame
          render all happen inside the WelcomeLoader window. The loader
          listens for `contact-ready` (dispatched by BusinessmanScene's
          first useFrame) and holds the curtain until that fires, so the
          user never sees a mid-scroll stutter on Contact. */}
      <Contact />
    </>
  );
}
