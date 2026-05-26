import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeLoader from "@/components/WelcomeLoader";
import { serverIsMobile } from "@/lib/serverIsMobile";

// Desktop-only chrome — dynamic-imported so the JS chunk is fetched
// only when the parent decides to render it. Server-side branching
// below means these chunks never enter the mobile bundle at all
// (they're not referenced from the mobile render path, so the
// `react-loadable-manifest` doesn't request them).
const AmbientBackground = dynamic(() => import("@/components/AmbientBackground"));
const CustomCursor = dynamic(() => import("@/components/CustomCursor"));

const inter = Inter({
  variable: "--font-sans-stack",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display-stack",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-alfran007.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Syed Alfran Ali — Senior Software Engineer @ Walmart",
    template: "%s · Syed Alfran Ali",
  },
  description:
    "Senior Software Engineer at Walmart building large-scale distributed systems, AI-driven products, and cloud-native platforms. Java, Kotlin, Spring Boot, Azure, Kafka, AI/GenAI/Agentic AI.",
  keywords: [
    "Syed Alfran Ali",
    "Senior Software Engineer",
    "Walmart",
    "Java",
    "Kotlin",
    "Spring Boot",
    "Azure",
    "Kafka",
    "AI",
    "Generative AI",
    "Agentic AI",
    "LLM",
    "Portfolio",
  ],
  authors: [{ name: "Syed Alfran Ali" }],
  creator: "Syed Alfran Ali",
  openGraph: {
    type: "website",
    title: "Syed Alfran Ali — Senior Software Engineer",
    description:
      "Building distributed, cloud-native, and AI-powered products at Walmart.",
    url: siteUrl,
    siteName: "Syed Alfran Ali",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Alfran Ali — Senior Software Engineer",
    description:
      "Building distributed, cloud-native, and AI-powered products at Walmart.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side mobile detection drives both the `WelcomeLoader` tick
  // timing and skips the desktop-only chrome (live starfield canvas,
  // custom cursor) entirely on phones — saving their JS chunks and
  // their continuous rAF work from the mobile main thread.
  const isMobile = await serverIsMobile();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground">
        <WelcomeLoader isMobile={isMobile} />
        {!isMobile && <AmbientBackground />}
        {!isMobile && <CustomCursor />}
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
