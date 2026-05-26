"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { SectionHeader } from "./About";

const accentMap: Record<string, string> = {
  cyan: "from-cyan-400/30 to-cyan-500/0",
  violet: "from-violet-400/30 to-violet-500/0",
  blue: "from-blue-400/30 to-blue-500/0",
  fuchsia: "from-fuchsia-400/30 to-fuchsia-500/0",
};

const sizeMap: Record<string, string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  normal: "",
};

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="// Projects"
          title={
            <>
              Selected work, from <span className="text-gradient">freight at planet-scale</span> to{" "}
              <span className="text-gradient-accent">computer vision</span>.
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-4">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: "200px" }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
              className={`group relative rounded-2xl glass overflow-hidden p-6 flex flex-col justify-between hover:bg-white/[0.06] transition-all ${sizeMap[p.size] ?? ""}`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-40 blur-3xl bg-gradient-to-br ${accentMap[p.accent] ?? accentMap.cyan}`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(400px 200px at var(--x,50%) var(--y,50%), rgba(34,211,238,0.10), transparent 60%)",
                }}
              />

              <header className="relative">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-300/80">
                  {p.tag}
                </p>
                <h3 className="mt-2 text-xl font-display text-white leading-snug">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-white/65 leading-relaxed">
                  {p.description}
                </p>
              </header>

              <footer className="relative mt-6 flex items-end justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span
                  aria-hidden
                  className="shrink-0 size-9 grid place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 group-hover:border-cyan-400/50 group-hover:text-white transition-colors"
                >
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
