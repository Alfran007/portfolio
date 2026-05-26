"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { experiences } from "@/lib/data";
import { SectionHeader } from "./About";

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="// Experience"
          title={
            <>
              A timeline of shipping <span className="text-gradient">distributed systems</span> at scale.
            </>
          }
        />

        <div className="mt-14 relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/40 to-transparent" />

          <ol className="space-y-10 sm:space-y-16">
            {experiences.map((exp, i) => {
              const left = i % 2 === 0;
              return (
                <motion.li
                  key={`${exp.company}-${exp.role}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05, margin: "200px" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative grid sm:grid-cols-2 gap-4 sm:gap-8`}
                >
                  {/* Dot */}
                  <span
                    aria-hidden
                    className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-2 inline-flex size-3.5 items-center justify-center"
                  >
                    <span className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md animate-pulse-glow" />
                    <span className="relative size-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                  </span>

                  {/* Card */}
                  <div
                    className={`${left ? "sm:col-start-1" : "sm:col-start-2"} ml-10 sm:ml-0`}
                  >
                    <article className="glass rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] transition-colors">
                      <header className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-cyan-300/90 text-xs font-mono tracking-wide">
                            <Building2 className="size-3.5" /> {exp.company}
                          </div>
                          <h3 className="mt-1 text-lg font-display text-white">{exp.role}</h3>
                        </div>
                        <span className="text-[11px] font-mono whitespace-nowrap text-white/50">
                          {exp.period}
                        </span>
                      </header>

                      <ul className="mt-3 space-y-2 text-sm text-white/70 leading-relaxed">
                        {exp.highlights.map((h, idx) => (
                          <li key={idx} className="pl-4 relative">
                            <span className="absolute left-0 top-2 size-1 rounded-full bg-cyan-400/70" />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.stack.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </article>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
