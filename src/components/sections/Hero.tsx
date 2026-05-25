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
      {/* FULL-BLEED 3D AVATAR — extends down into About on desktop; mask fades
          the bottom so the floor disc + shoes don't collide with About's text.
          On mobile we drop the heavy WebGL scene entirely and show a static
          cutout image so phones stay fast and the layout doesn't break. */}
      <div
        className="absolute inset-x-0 top-0 -bottom-[20vh] md:-bottom-[38vh] z-0 pointer-events-none"
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
          <div className="absolute inset-0 flex items-end justify-end opacity-60">
            <div className="relative w-[80%] max-w-[420px] aspect-[3/4]">
              <Image
                src={profile.photoCutoutPath}
                alt=""
                fill
                sizes="80vw"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
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

          <motion.div
            variants={item}
            className="mt-5 flex items-baseline gap-2 text-lg sm:text-xl text-white/70 h-8 overflow-hidden"
          >
            <span className="text-white/40 font-mono text-sm">{`>`}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient-accent font-semibold"
              >
                {ROLES[roleIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="text-white/40">@ {profile.company}</span>
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
