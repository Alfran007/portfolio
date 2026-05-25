# Syed Alfran Ali — 3D Portfolio

A dark, cinematic, glassmorphism + bento portfolio built with **Next.js 16, React 19, Three.js / React Three Fiber, Tailwind v4, Framer Motion, GSAP-ready, Lenis** smooth scrolling.

## ✨ Features

- **3D holographic hero** — your portrait rendered onto a floating glowing disc with orbiting rings, icosahedron, distorted torus knot, sparkles, particle field, and bloom + chromatic-aberration post-processing.
- **Lenis smooth scrolling** for a premium scroll feel.
- **Glassmorphism + bento grid** project showcase with hover lighting.
- **Animated experience timeline** (Walmart SSE → SWE-III → Kantar SWE).
- **AI-first skills** section: Generative AI, Agentic AI, LLM Apps, RAG, MCP, Vector Search alongside Java/Kotlin/Spring/Azure/Kafka/Kubernetes.
- **Certifications + Achievements** card layout.
- **Contact form** — Web3Forms-powered with mailto fallback.
- **Mobile-first**, accessible (reduced-motion respected, keyboard-friendly nav), SEO metadata + Open Graph.

## 🚀 Run locally

```bash
# Requires Node 20+
nvm use 20
cd portfolio/site
cp .env.local.example .env.local   # paste your Web3Forms access key
npm install
npm run dev
```

Open <http://localhost:3000>.

## 🔐 Environment

| Variable | Description | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Free key for the contact form. | https://web3forms.com (paste your email, instant key). |

If the key is missing the form silently falls back to a `mailto:` link, so the site works without it.

## 📦 Build

```bash
npm run build
npm start
```

## 🌍 Free deployment options

### Option 1 — Vercel (recommended)
1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>, import the repo.
3. **Root Directory**: `portfolio/site` (or move `site/*` to the repo root).
4. Framework preset: Next.js. Build/install commands auto-detected.
5. Add env var `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in Project Settings → Environment Variables.
6. Click **Deploy**. You get a free `*.vercel.app` URL and zero-config preview deployments per PR.

### Option 2 — Netlify
1. Push to GitHub.
2. <https://app.netlify.com/start> → connect repo.
3. **Base directory**: `portfolio/site`, **Build command**: `npm run build`, **Publish directory**: `.next`.
4. Install the official Netlify Next.js Runtime when prompted.
5. Add env vars in Site Settings → Environment.

### Option 3 — Cloudflare Pages (Next on Pages)
1. Push to GitHub.
2. Cloudflare Pages → Create project → connect repo.
3. Build command: `npx @cloudflare/next-on-pages@1`, Output: `.vercel/output/static`, Node 20.
4. Add env vars in Pages Settings.

### Option 4 — GitHub Pages (static only)
Requires switching to `output: "export"` in `next.config.ts` and removing R3F SSR/dynamic imports that need a Node runtime. Vercel/Netlify are simpler — recommended over this route.

## 🧭 Project structure

```
site/
├─ public/
│  ├─ profile.png                 # your photo
│  └─ Syed_Alfran_Ali_Resume.pdf  # downloadable resume
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # Root layout, fonts, ambient bg, smooth scroll
│  │  ├─ page.tsx                 # Sections composition
│  │  └─ globals.css              # Theme tokens + utilities
│  ├─ components/
│  │  ├─ Navbar.tsx               # Sticky glass navbar + mobile menu
│  │  ├─ Footer.tsx
│  │  ├─ SmoothScroll.tsx         # Lenis wrapper
│  │  ├─ AmbientBackground.tsx    # Canvas starfield + grid + glow
│  │  ├─ three/
│  │  │  └─ HeroScene.tsx         # R3F 3D hero scene (portrait + rings + post FX)
│  │  └─ sections/
│  │     ├─ Hero.tsx
│  │     ├─ About.tsx             # exports shared <SectionHeader />
│  │     ├─ Experience.tsx
│  │     ├─ Skills.tsx
│  │     ├─ Projects.tsx
│  │     ├─ Certifications.tsx
│  │     └─ Contact.tsx
│  └─ lib/
│     ├─ data.ts                  # all portfolio content lives here
│     └─ cn.ts
└─ .env.local.example
```

## ✍️ Editing your content

Everything is centralised in `src/lib/data.ts`:

- `profile` — name, role, taglines, socials, resume path.
- `experiences` — array of timeline entries.
- `skillGroups` — categorised skills incl. **AI / GenAI / Agentic**.
- `projects` — bento grid items (`size`: `wide` | `tall` | `normal` for layout variety).
- `certifications`, `achievements`, `education`.

To change the **photo** drop a new file at `public/profile.png` (any aspect — it's used in the About card 4:5 and on the 3D portrait disc).

## 🎨 Theming

Edit CSS custom properties in `src/app/globals.css`:

- `--background` / `--background-2` — base dark colors.
- `--accent-cyan` / `--accent-violet` / `--accent-blue` / `--accent-magenta` — neon accents.

## 🧪 Performance & a11y notes

- 3D scene is `dynamic(..., { ssr: false })` to avoid hydrating Three.js on the server.
- `prefers-reduced-motion` disables animations.
- Lazy WebGL — no Canvas mount until Hero is in viewport (Next dynamic import handles this).
- Images use `next/image` with priority on the hero portrait.
- All interactive elements have visible focus rings (Tailwind defaults preserved).

## 🪪 Credits

- 3D — [three.js](https://threejs.org) · [@react-three/fiber](https://r3f.docs.pmnd.rs) · [@react-three/drei](https://drei.docs.pmnd.rs) · [@react-three/postprocessing](https://github.com/pmndrs/postprocessing).
- Motion — [Framer Motion](https://www.framer.com/motion/).
- Smooth scroll — [Lenis](https://lenis.darkroom.engineering/).
- Icons — [Lucide](https://lucide.dev) + [react-icons](https://react-icons.github.io/react-icons/).

---

© Syed Alfran Ali — built with Next.js, R3F, and a lot of cyan.
