"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Mail, Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiCredly } from "react-icons/si";
import { profile } from "@/lib/data";
import { SectionHeader } from "./About";

// `BusinessmanScene` is only referenced when `isMobile === false`, and the
// parent resolves that on the server from the User-Agent. So the dynamic
// chunk + GLB + R3F/three/drei never enter the mobile bundle.
const BusinessmanScene = dynamic(() => import("@/components/three/BusinessmanScene"), {
  ssr: false,
});

type Status = "idle" | "loading" | "success" | "error";

/**
 * `isMobile` arrives as a server-side-resolved prop from `page.tsx`
 * so the SSR HTML matches the device. Previously we read it from
 * `useIsMobile()` which returned `false` during SSR, meaning every
 * mobile client first rendered the desktop tree (incl. the
 * `BusinessmanScene` `next/dynamic` placeholder), needed to fetch
 * the R3F/three/drei chunks for hydration, then unmounted them — the
 * source of the "browser loading bar stays up for 10–15 s" symptom.
 *
 * Uses Web3Forms (https://web3forms.com) — set
 * NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in `.env.local` for live form
 * submission. Falls back to a mailto link.
 */
export default function Contact({ isMobile }: { isMobile: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (!accessKey) {
      // graceful fallback — open mail client
      const name = String(data.get("name") ?? "");
      const email = String(data.get("email") ?? "");
      const message = String(data.get("message") ?? "");
      const subject = encodeURIComponent(`Portfolio contact from ${name || "visitor"}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      return;
    }

    data.append("access_key", accessKey);
    data.append("from_name", "Portfolio");
    data.append("subject", `New message from ${data.get("name") ?? "visitor"}`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json?.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrMsg(json?.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Network error.");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 relative z-10">
        <SectionHeader
          eyebrow="// Contact"
          title={
            <>
              Let's build something <span className="text-gradient">remarkable</span>.
            </>
          }
        />

        <div className="mt-12 grid lg:grid-cols-12 gap-6">
          {/* Left: info — plain div, no motion. Entrance animation used
              to hide the entire column behind `opacity:0` until JS
              hydrated; on a slow mobile that was seconds of blank space. */}
          <div className="lg:col-span-5 space-y-5">
            <p className="text-white/70 leading-relaxed">
              Have a role, idea, or project where distributed systems meet AI? I'd love to hear about it.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="block glass rounded-2xl p-5 hover:bg-white/[0.06] transition-colors group"
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-300/80">
                Email me directly
              </p>
              <p className="mt-2 text-lg text-white font-display group-hover:text-cyan-300">
                {profile.email}
              </p>
            </a>

            <div className="flex items-center gap-2">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="size-11 grid place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/40"
              >
                <FaGithub className="size-4" />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="size-11 grid place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-violet-400/40"
              >
                <FaLinkedinIn className="size-4" />
              </a>
              <a
                href={profile.socials.credly}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Credly badges"
                title="Verified badges on Credly"
                className="size-11 grid place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-amber-400/40"
              >
                <SiCredly className="size-4 text-amber-300" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="size-11 grid place-items-center rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/40"
              >
                <Mail className="size-4" />
              </a>
            </div>

            {/* 3D businessman — desktop only. Mobile drops the entire block
                (canvas + GLB + glow halos) so the Contact section is just
                links and the form — fast, scrollable, no WebGL on phones. */}
            {!isMobile && (
              <div className="relative pt-4">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[70%] rounded-full bg-cyan-500/15 blur-[90px]" />
                  <div className="absolute left-[55%] top-[58%] -translate-x-1/2 -translate-y-1/2 size-[55%] rounded-full bg-violet-500/12 blur-[80px]" />
                </div>
                <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[360px] mx-auto sm:mx-0">
                  <BusinessmanScene cameraZ={4.6} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-300/70">
                  <span className="size-1 rounded-full bg-cyan-400 animate-pulse" />
                  Open to opportunities · Let's connect
                </div>
              </div>
            )}
          </div>

          {/* Right: form — plain form, no motion wrapper. */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 glass-strong rounded-3xl p-6 sm:p-8 space-y-4"
          >
            {/* Honeypot */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" placeholder="Jane Doe" required />
              <Field label="Email" name="email" type="email" placeholder="jane@example.com" required />
            </div>
            <Field label="Subject" name="subject_topic" placeholder="Let's collaborate on..." />
            <TextArea label="Message" name="message" placeholder="Tell me about your project, role, or idea..." required />

            <div className="flex items-center justify-between gap-4 pt-2">
              <FormStatus status={status} errMsg={errMsg} hasKey={!!accessKey} />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] hover:shadow-[0_10px_60px_-10px_rgba(139,92,246,0.8)] disabled:opacity-60 transition-all"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Send message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/50">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-cyan-400/50 focus:bg-white/[0.07] transition-colors"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/50">
        {label}
      </span>
      <textarea
        name={name}
        rows={5}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-violet-400/50 focus:bg-white/[0.07] transition-colors resize-y min-h-32"
      />
    </label>
  );
}

function FormStatus({
  status,
  errMsg,
  hasKey,
}: {
  status: Status;
  errMsg: string;
  hasKey: boolean;
}) {
  if (status === "success")
    return (
      <p className="flex items-center gap-2 text-xs text-emerald-400">
        <CheckCircle2 className="size-4" /> Thanks — message sent!
      </p>
    );
  if (status === "error")
    return (
      <p className="flex items-center gap-2 text-xs text-rose-400">
        <AlertTriangle className="size-4" /> {errMsg || "Failed to send."}
      </p>
    );
  if (!hasKey)
    return (
      <p className="text-[11px] text-white/40 font-mono">
        Dev: set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY — falls back to mailto.
      </p>
    );
  return <span />;
}
