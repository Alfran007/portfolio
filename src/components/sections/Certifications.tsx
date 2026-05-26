import { Award, Trophy, ExternalLink } from "lucide-react";
import { SiCredly } from "react-icons/si";
import { achievements, certifications, profile } from "@/lib/data";
import { SectionHeader } from "./About";

/**
 * Server component, no framer-motion. Certification + achievement cards
 * used to be `motion.li` with `initial={{ opacity: 0 }}` — that hid
 * every entry until React hydration AND IntersectionObserver fired.
 * On a slow mobile that was 10–20 s of blank space below the fold.
 */
export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="// Certifications & Achievements"
          title={
            <>
              Verified <span className="text-gradient">credentials</span> and{" "}
              <span className="text-gradient-accent">competitive wins</span>.
            </>
          }
        />

        <div className="mt-12 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-sm font-mono uppercase tracking-[0.18em] text-cyan-300/80 flex items-center gap-2">
                <Award className="size-4" /> Microsoft Certifications
              </h3>
              <a
                href={profile.socials.credly}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/5 text-[11px] font-mono uppercase tracking-[0.18em] text-amber-200/90 hover:border-amber-300/60 hover:bg-amber-400/10 transition-colors"
              >
                <SiCredly className="size-3.5 text-amber-300" />
                Verify on Credly
                <ExternalLink className="size-3 opacity-60 group-hover:opacity-100" />
              </a>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {certifications.map((c) => (
                <li
                  key={c.title}
                  className="glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="size-9 grid place-items-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10"
                    >
                      <Award className="size-4 text-cyan-300" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white leading-snug">
                        {c.title}
                      </p>
                      <p className="mt-1 text-xs text-white/55 font-mono">
                        {c.issuer} · {c.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-sm font-mono uppercase tracking-[0.18em] text-violet-300/80 mb-4 flex items-center gap-2">
              <Trophy className="size-4" /> Achievements
            </h3>
            <div className="glass rounded-2xl p-5">
              <ul className="space-y-3 text-sm text-white/75 leading-relaxed">
                {achievements.map((a, i) => (
                  <li key={i} className="pl-4 relative">
                    <span className="absolute left-0 top-2 size-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
