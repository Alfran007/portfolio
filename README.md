# Syed Alfran Ali — Portfolio

Personal portfolio site. Cinematic dark theme, glassmorphism + bento layout, full-body 3D avatar (R3F) with cursor tracking, animated experience timeline, and an AI-first skills section.

Live: https://portfolio-alfran007.vercel.app

## Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **3D** — Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, Draco-compressed GLBs
- **Styling** — Tailwind v4, Framer Motion, Lenis smooth scroll
- **Forms** — Web3Forms (free, no backend) with `mailto:` fallback
- **Analytics** — Vercel Web Analytics

## Run locally

```bash
# Node 22.x recommended (camera-controls dependency requires >=22)
cp .env.local.example .env.local   # add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
npm install
npm run dev
```

Visit http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | No | Web3Forms access key. Without it, the contact form falls back to a `mailto:` link — the site works regardless. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for `metadataBase`, OpenGraph, sitemap. Defaults to the Vercel domain. |

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Push to GitHub.
2. https://vercel.com/new → import repo → framework auto-detected as Next.js.
3. **Install Command** override: `corepack prepare yarn@1.22.22 --activate && yarn install --network-timeout 600000` *(works around a current npm install-handler bug on Vercel + Next 16 + React 19)*.
4. Environment variables: add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (and optionally `NEXT_PUBLIC_SITE_URL`) for Production / Preview / Development.
5. Deploy.

Every push to `main` triggers an auto-redeploy.

## Structure

```
.
├─ public/
│  ├─ profile.png                 # avatar texture for desktop hero scene
│  ├─ profile_cutout.png          # static mobile fallback image
│  ├─ model_latest.glb            # rigged avatar (Draco-compressed)
│  ├─ businessman.glb             # contact-section model (Draco-compressed)
│  ├─ draco/                      # Draco WASM decoder
│  └─ Syed_Alfran_Ali_Resume.pdf
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # Fonts, metadata, WelcomeLoader, Analytics
│  │  ├─ page.tsx                 # Section composition
│  │  ├─ robots.ts                # Auto-generated robots.txt
│  │  ├─ sitemap.ts               # Auto-generated sitemap.xml
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ Navbar.tsx · Footer.tsx · WelcomeLoader.tsx
│  │  ├─ AmbientBackground.tsx · CustomCursor.tsx · SmoothScroll.tsx
│  │  ├─ three/
│  │  │  ├─ HeroScene.tsx         # Rigged avatar + post FX (desktop only)
│  │  │  └─ BusinessmanScene.tsx  # Contact-section model (desktop only)
│  │  └─ sections/                # Hero / About / Experience / Skills / Projects / Certifications / Contact
│  └─ lib/
│     ├─ data.ts                  # All portfolio content (edit here)
│     ├─ useIsMobile.ts           # Drops 3D scenes on phones/tablets
│     └─ cn.ts
```

## Editing content

Everything user-facing lives in `src/lib/data.ts`:

- `profile` — name, role, taglines, socials, resume path.
- `experiences` — timeline entries.
- `skillGroups` — categorized skills (AI / Languages / Backend / Cloud / Data / Frontend).
- `projects` — bento grid (`size: wide | tall | normal`).
- `certifications`, `achievements`, `education`.

Drop a new photo at `public/profile.png` to swap the avatar texture. To replace the rigged 3D model, export a Mixamo-compatible GLB and place at `public/model_latest.glb` (auto-fits via bounding box).

## Performance notes

- 3D scenes are dynamic-imported with `ssr: false` — no Three.js bundle on the server.
- Mobile / touch devices skip WebGL entirely (`useIsMobile` hook) and show a static cutout image.
- GLBs are Draco-compressed (~70-96% size reduction).
- `prefers-reduced-motion` honored by Framer Motion + Lenis.
- Images served via `next/image` with priority hints on above-the-fold assets.

## License

MIT — content (text, resume, photos) © Syed Alfran Ali.
