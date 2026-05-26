import { skillGroups } from "@/lib/data";
import { SectionHeader } from "./About";

/**
 * Server component, no framer-motion. Skill-group cards used to be
 * `motion.div` with `initial={{ opacity: 0 }}` — same story as the
 * other sections, content was hidden until hydration + viewport
 * intersection fired. Marquee is pure CSS so it works without JS.
 */
const marqueeChips = [
  "Generative AI",
  "Agentic AI",
  "LLM Apps",
  "RAG",
  "MCP",
  "Kafka",
  "Spring Boot",
  "Kotlin",
  "Azure",
  "Cosmos DB",
  "Kubernetes",
  "Databricks",
  "PySpark",
  "Vector Search",
  "Prompt Engineering",
  "Microservices",
  "Event-Driven",
  "Java",
  "Python",
  "TypeScript",
  "React",
  "Three.js",
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="// Skills"
          title={
            <>
              Tooling I use to build <span className="text-gradient">cloud-native</span> +{" "}
              <span className="text-gradient-accent">AI-first</span> products.
            </>
          }
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((g) => (
            <div
              key={g.title}
              className="glass rounded-2xl p-5 relative overflow-hidden group"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-30 blur-3xl bg-gradient-to-br ${g.color}`}
              />
              <div className="relative">
                <p className={`text-xs font-mono tracking-[0.18em] uppercase bg-gradient-to-r ${g.color} bg-clip-text text-transparent`}>
                  {g.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="text-[12px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:border-cyan-400/40 hover:bg-white/10 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="mt-14 relative">
          <div className="absolute inset-y-0 left-0 w-10 sm:w-20 z-10 bg-gradient-to-r from-[#0b0f19] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-10 sm:w-20 z-10 bg-gradient-to-l from-[#0b0f19] to-transparent pointer-events-none" />
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...marqueeChips, ...marqueeChips].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="shrink-0 px-3 py-1.5 rounded-full glass text-xs text-white/75 font-mono"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
