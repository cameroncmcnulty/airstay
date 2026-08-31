import type { MetadataRoute } from "next";

const paths = [
  "",
  "/flights",
  "/stays",
  "/cars",
  "/esim",
  "/packages",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
  "/disclosure",
  "/signup",
  "/login",
  "/forgot",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `https://airstay.ca${path}`,
    lastModified: new Date("2026-08-19"),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
