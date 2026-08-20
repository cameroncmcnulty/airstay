import type { MetadataRoute } from "next";

const paths = [
  "",
  "/flights",
  "/stays",
  "/cars",
  "/packages",
  "/deals",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
  "/disclosure",
  "/signup",
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `https://airstay.ca${path}`,
    lastModified: new Date("2026-08-19"),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
