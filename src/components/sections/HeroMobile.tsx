import { ArrowDown, Download, Mail } from "lucide-react";
import { profile } from "@/lib/data";
import MobileAvatar from "./MobileAvatar";

/**
 * Mobile Hero. Pure server component — no `"use client"`, no
 * framer-motion, no `next/dynamic`, no `useIsMobile()`. The entire
 * tree is in the SSR HTML and visible the instant the browser parses
 * the document; the only JS that ships from this subtree is the tiny
 * `MobileAvatar` island (for the `onLoad → hero-ready` signal).
 *
 * The role line is intentionally static (Senior Software Engineer)
 * instead of the desktop's cycling rotator — the rotator needs
 * useState + framer-motion's `AnimatePresence`, which we don't want on
 * the mobile critical path. The desktop variant keeps the animation.
 */
export default function HeroMobile() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center pt-28 pb-16"
    >
      {/* Avatar layer — full-bleed background that extends down into About. */}
      <div
        className="absolute inset-x-0 top-0 -bottom-[20vh] z-0 pointer-events-none select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.4) 90%, transparent 98%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.4) 90%, transparent 98%)",
        }}
      >
        {/* Halos behind the avatar so it pops against the dark page */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute right-[12%] top-[35%] -translate-y-1/2 size-[60vmin] rounded-full bg-cyan-400/25 blur-[120px]" />
          <div className="absolute right-[6%] top-[55%] -translate-y-1/2 size-[50vmin] rounded-full bg-violet-500/20 blur-[100px]" />
          <div className="absolute right-[18%] top-[45%] -translate-y-1/2 size-[40vmin] rounded-full bg-white/[0.04] blur-[140px]" />
        </div>
        <MobileAvatar />
      </div>

      {/* Left-side gradient — confined to Hero. Lighter middle band so the avatar
          stays visible behind any overlapping text edge. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0b0f19]/95 via-[#0b0f19]/45 via-32% to-transparent" />

      <div className="mx-auto max-w-7xl w-full px-4 relative z-10">
        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full glass text-xs text-white/80">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for AI & platform engineering collaborations
          </div>

          <h1 className="section-title text-4xl sm:text-5xl leading-[1.05] text-white">
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </h1>

          <div className="mt-5 text-sm sm:text-base text-white/70">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-white/40 font-mono text-[11px] sm:text-xs shrink-0">{`>`}</span>
                <span className="text-gradient-accent font-semibold whitespace-nowrap">
                  Senior Software Engineer
                </span>
              </div>
              <span className="text-xs sm:text-sm text-white/40 whitespace-nowrap">
                @ {profile.company}
              </span>
            </div>
          </div>

          <p className="mt-5 text-white/65 leading-relaxed">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)]"
            >
              View Projects
              <ArrowDown className="size-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/90 glass border border-white/10"
            >
              <Mail className="size-4 text-cyan-400" />
              Get in touch
            </a>
            <a
              href={profile.resumePath}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/80 border border-white/10"
            >
              <Download className="size-4 text-violet-400" />
              Resume
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 max-w-md gap-3">
            <Stat label="Years" value="7+" />
            <Stat label="Walmart" value="5+" />
            <Stat label="Azure Certs" value="6" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] tracking-[0.2em] text-white/40 uppercase"
      >
        <span>Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </a>
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
