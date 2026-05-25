"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm text-white/60">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              aria-hidden
              className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500"
            />
            <span className="text-white/90 font-display">{profile.name}</span>
          </div>
          <p className="leading-relaxed">
            {profile.role} @ {profile.company}. Building distributed, cloud-native, AI-powered products.
          </p>
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-cyan-400" /> {profile.location}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-violet-400" />
            <a href={`mailto:${profile.email}`} className="hover:text-white">
              {profile.email}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-cyan-400" /> {profile.phone}
          </p>
        </div>

        <div>
          <p className="text-white/80 mb-3">Find me</p>
          <div className="flex items-center gap-2">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="size-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40"
            >
              <FaGithub className="size-4" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="size-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-400/40"
            >
              <FaLinkedinIn className="size-4" />
            </a>
            <a
              href={profile.socials.email}
              aria-label="Email"
              className="size-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {profile.name}. Crafted with Next.js, R3F & Framer Motion.</p>
          <p className="font-mono">Designed for curiosity. Built for scale.</p>
        </div>
      </div>
    </footer>
  );
}
