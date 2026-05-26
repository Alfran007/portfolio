"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { useIsMobile } from "@/lib/useIsMobile";

const ROLES = [
  "Senior Software Engineer",
  "Distributed Systems Architect",
  "Generative AI Builder",
  "Agentic AI Engineer",
  "Platform Engineer",
];

// HeroScene only renders on the desktop branch below — `useIsMobile()` reads
// `matchMedia` synchronously on mount, so on phones this dynamic chunk is
// never requested. The WebGL bundle (R3F + three + drei + postprocessing,
// roughly 800 KB gzip) stays off the mobile wire entirely.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-24 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 blur-2xl animate-pulse" />
    </div>
  ),
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const isMobile = useIsMobile();
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center pt-28 pb-16"
    >
      {/* Avatar layer — full-bleed background that extends down into About.
          Desktop renders the live WebGL HeroScene. Mobile drops the WebGL
          entirely and shows a transparent-cutout WebP (~39 KB) so the
          page becomes interactive in well under a second on phones. */}
      <div
        // top-[18vh] on mobile shifts the avatar container DOWN by ~18 % of
        // the viewport so the face clears the "Available for AI" pill at the
        // top of the text column. Why a top offset and not just object-
        // position: on small phones (iPhone SE / mini) the container becomes
        // shorter than the source image (610×1280, ~0.48 aspect) so the
        // image fits by HEIGHT, which means object-position-Y has zero
        // effect — the image fills the container vertically and the face
        // pins to y=0 regardless of the % value. Pushing the container
        // itself down works the same on every viewport size.
        className="absolute inset-x-0 top-[18vh] -bottom-[20vh] md:top-0 md:-bottom-[38vh] z-0 pointer-events-none select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.4) 90%, transparent 98%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.4) 90%, transparent 98%)",
        }}
      >
        {/* Brighter halo behind the avatar so it pops against the dark page */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute right-[12%] top-[35%] -translate-y-1/2 size-[60vmin] rounded-full bg-cyan-400/25 blur-[120px]" />
          <div className="absolute right-[6%] top-[55%] -translate-y-1/2 size-[50vmin] rounded-full bg-violet-500/20 blur-[100px]" />
          <div className="absolute right-[18%] top-[45%] -translate-y-1/2 size-[40vmin] rounded-full bg-white/[0.04] blur-[140px]" />
        </div>
        {isMobile ? (
          // Transparent-cutout WebP (~39 KB). With no background the figure
          // floats over the dark theme + cyan/violet halos above, matching
          // the desktop 3D avatar's "submerged in the ambient backdrop"
          // feel. A light filter (slightly reduced saturation + a touch of
          // contrast) keeps the photo from looking like a too-bright office
          // shot against the deep navy page.
          <Image
            src="/avatar-mobile-v3.webp"
            alt="Syed Alfran Ali"
            fill
            priority
            sizes="100vw"
            // `object-[center_92%]` anchors the figure near the bottom of
            // the avatar container so the head clears the "Available for
            // AI…" status pill at the top of the text column on phones.
            // 78 % wasn't enough (pill still landed across the eyes); 92 %
            // gives ~50 px of breathing room between pill bottom and face
            // while still keeping the head inside the opaque area of the
            // mask gradient (which doesn't start fading until 78 %).
            className="object-contain object-[center_92%] opacity-90"
            style={{ filter: "saturate(0.92) contrast(1.05) brightness(0.96)" }}
            draggable={false}
            // Mobile equivalent of the desktop "hero-ready" signal — fires
            // when the cutout WebP has actually decoded so WelcomeLoader can
            // ramp past 60 instead of idling. Without this the bar would
            // sit at 60 on phones until the 3 s fallback released it.
            onLoad={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("hero-ready"));
              }
            }}
          />
        ) : (
          <HeroScene />
        )}
      </div>

      {/* Left-side gradient — confined to Hero. Lighter middle band so the avatar
          stays visible behind any overlapping text edge. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0b0f19]/95 via-[#0b0f19]/45 via-32% to-transparent" />

      <div className="mx-auto max-w-7xl w-full px-4 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Text column (overlays the avatar) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 relative"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full glass text-xs text-white/80">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for AI & platform engineering collaborations
          </motion.div>

          <motion.h1
            variants={item}
            className="section-title text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white"
          >
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </motion.h1>

          {/* Role + company. On anything narrower than `lg` the company chip
              drops to its own line so a long role like "Distributed Systems
              Architect" never gets clipped by the column — iPad portrait
              (768) and big phones (430+) all stack instead of squeezing.
              The role itself stays inside a fixed-height clip so the
              y-slide AnimatePresence animation can't push other content
              around between role transitions. */}
          <motion.div
            variants={item}
            className="mt-5 text-sm sm:text-base lg:text-xl text-white/70"
          >
            <div className="flex flex-col lg:flex-row lg:items-baseline gap-0.5 lg:gap-2">
              <div className="flex items-baseline gap-2 h-6 sm:h-7 lg:h-8 overflow-hidden">
                <span className="text-white/40 font-mono text-[11px] sm:text-xs lg:text-sm shrink-0">{`>`}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIdx}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -28, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="text-gradient-accent font-semibold whitespace-nowrap"
                  >
                    {ROLES[roleIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-xs sm:text-sm lg:text-xl text-white/40 whitespace-nowrap">
                @ {profile.company}
              </span>
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-white/65 leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] hover:shadow-[0_10px_60px_-10px_rgba(139,92,246,0.8)] transition-all"
            >
              View Projects
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/90 glass hover:bg-white/8 border border-white/10"
            >
              <Mail className="size-4 text-cyan-400" />
              Get in touch
            </a>
            <a
              href={profile.resumePath}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white border border-white/10 hover:border-cyan-400/40"
            >
              <Download className="size-4 text-violet-400" />
              Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 grid grid-cols-3 max-w-md gap-3">
            <Stat label="Years" value="7+" />
            <Stat label="Walmart" value="5+" />
            <Stat label="Azure Certs" value="6" />
          </motion.div>
        </motion.div>

        {/* Right column intentionally empty — avatar (full-bleed background) occupies this visual space */}
        <div className="hidden lg:block lg:col-span-5" aria-hidden />
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] tracking-[0.2em] text-white/40 uppercase"
      >
        <span>Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.a>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3">
      <div className="text-2xl font-display text-gradient-accent leading-none">{value}</div>
      <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-white/50">{label}</div>
    </div>
  );
}
