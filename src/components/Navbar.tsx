"use client";

import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * Navbar. The mobile menu used to be wrapped in `motion.div` +
 * `AnimatePresence` from framer-motion, which made Navbar a direct
 * importer of framer-motion. Because Navbar is rendered on every
 * route (it lives in the layout), that pulled framer-motion onto the
 * mobile critical path. Swapped for a CSS opacity/translate
 * transition — the menu open/close still animates, but no JS library
 * is needed.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled ? "glass-strong shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)]" : "glass"
          )}
          aria-label="Primary"
        >
          <a
            href="#hero"
            className="group inline-flex items-center gap-2"
            aria-label="Home"
          >
            <span
              aria-hidden
              className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_24px_-2px_rgba(34,211,238,0.6)]"
            />
            <span className="font-display text-sm tracking-wide text-white/90">
              <span className="text-gradient-accent font-semibold">SAA</span>
              <span className="ml-1 hidden sm:inline text-white/70">/ portfolio</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumePath}
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/10 hover:border-cyan-400/40 hover:from-cyan-500/30 hover:to-violet-500/30 transition-all"
            >
              <Download className="size-3.5" />
              Resume
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center size-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu — CSS-only animation. `pointer-events` flip + zero
          opacity when closed means it's invisible AND non-interactive,
          but the DOM stays mounted so we don't need framer-motion's
          mount/unmount choreography. */}
      <div
        className={cn(
          "md:hidden mx-auto max-w-6xl px-4 mt-2 transition-[opacity,transform] duration-200 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <ul className="glass-strong rounded-2xl p-2 grid gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumePath}
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/90 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/10"
            >
              <Download className="size-3.5" /> Download Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
