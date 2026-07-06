import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF (falling back to WebP) instead of the ~1 MB source PNGs.
    // next/image already resizes per device, but AVIF trims the transferred
    // bytes another ~30–50% vs the default WebP for these photo assets — the
    // biggest single win for the About portrait on poor connections.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
