import type { MetadataRoute } from "next";

const SITE_URL = "https://portfolio-alfran007.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sections = [
    "",
    "#about",
    "#experience",
    "#skills",
    "#projects",
    "#certifications",
    "#contact",
  ];

  return sections.map((hash) => ({
    url: `${SITE_URL}/${hash}`,
    lastModified,
    changeFrequency: "monthly",
    priority: hash === "" ? 1 : 0.7,
  }));
}
