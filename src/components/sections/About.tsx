"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { profile, education } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="// About"
          title={
            <>
              Engineer who ships <span className="text-gradient">systems</span>,
              then teaches them to <span className="text-gradient-accent">think</span>.
            </>
          }
        />

        <div className="mt-12 grid lg:grid-cols-12 gap-8 items-start">
          {/* Photo card */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05, margin: "200px" }}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl glass-strong border-gradient overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/30 via-transparent to-violet-500/30 blur-2xl opacity-50" />
              <div className="relative p-3">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0b0f19] to-[#111827]">
                  {/* Decorative glow behind cutout */}
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute left-1/2 top-[35%] -translate-x-1/2 size-[60%] rounded-full bg-cyan-500/25 blur-3xl" />
                    <div className="absolute left-1/2 top-[55%] -translate-x-1/2 size-[55%] rounded-full bg-violet-500/20 blur-3xl" />
                  </div>
                  <Image
                    src={profile.photoCutoutPath}
                    alt={`${profile.name} portrait`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="relative object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-white/80">
                      Bangalore · IST {new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05, margin: "200px" }}
            variants={fadeUp}
            custom={1}
            className="lg:col-span-7 space-y-5"
          >
            <p className="text-white/75 leading-relaxed text-lg">
              {profile.summary}
            </p>
            <p className="text-white/65 leading-relaxed">
              At Walmart, I lead the build-out of an Ocean Freight capacity product unlocking international transportation for Suppliers, Marketplace, drop-ship vendors and other Enterprises. Previously I shipped the Geofence Management System that improved truck arrival estimations by <span className="text-cyan-300">8.79%</span>, and contributed to the customer pickup & check-in platform.
            </p>
            <p className="text-white/65 leading-relaxed">
              Lately I'm investing heavily in <span className="text-gradient-accent font-medium">Generative & Agentic AI</span>: LLM-driven workflows, retrieval, tool-using agents, and the MLOps glue around them. I love systems where great engineering meets thoughtful product.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <InfoCard icon={<Briefcase className="size-4" />} label="Role" value={`${profile.role} @ ${profile.company}`} />
              <InfoCard icon={<MapPin className="size-4" />} label="Based in" value={profile.location} />
              <InfoCard icon={<GraduationCap className="size-4" />} label="Education" value={`${education[0].school.split(",")[0]} · ${education[0].detail}`} />
            </div>

            <div className="pt-3 flex items-center gap-2 text-sm text-white/60">
              <Sparkles className="size-4 text-cyan-400" />
              Currently exploring: <span className="text-white/80">Agentic AI · MCP · RAG at scale</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-cyan-300/90">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 text-sm text-white/90">{value}</p>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="section-title mt-3 text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-3xl">
        {title}
      </h2>
    </div>
  );
}
