import sharp from "sharp";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const suitcase = `
  <g transform="translate(30.7 8) scale(0.92)">
    <path d="M30 26V16c0-5 4-10 10-10s10 5 10 10v10" stroke="STROKE" stroke-width="7" stroke-linecap="round" fill="none"/>
    <rect x="16" y="26" width="48" height="68" rx="11" stroke="STROKE" stroke-width="7" fill="none"/>
    <path d="M31 40v40M40 40v40M49 40v40" stroke="STROKE" stroke-width="5.6" stroke-linecap="round" fill="none"/>
    <circle cx="28" cy="102" r="6.2" stroke="STROKE" stroke-width="6" fill="none"/>
    <circle cx="52" cy="102" r="6.2" stroke="STROKE" stroke-width="6" fill="none"/>
  </g>
`;

function squareIcon(stroke, background, radius = 0) {
  const bg = background
    ? `<rect width="128" height="128" rx="${radius}" fill="${background}"/>`
    : "";
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${bg}${suitcase.replaceAll("STROKE", stroke)}</svg>`);
}

const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071840"/>
      <stop offset="1" stop-color="#0C2A5C"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="-40" r="280" fill="#4381C7" opacity="0.18"/>
  <circle cx="80" cy="680" r="220" fill="#4381C7" opacity="0.10"/>
  <g transform="translate(88 165) scale(2.35)">
    <path d="M30 26V16c0-5 4-10 10-10s10 5 10 10v10" stroke="#FFFFFF" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <rect x="16" y="26" width="48" height="68" rx="11" stroke="#FFFFFF" stroke-width="6.5" fill="none"/>
    <path d="M31 40v40M40 40v40M49 40v40" stroke="#FFFFFF" stroke-width="5.2" stroke-linecap="round" fill="none"/>
    <circle cx="28" cy="102" r="6.2" stroke="#FFFFFF" stroke-width="5.5" fill="none"/>
    <circle cx="52" cy="102" r="6.2" stroke="#FFFFFF" stroke-width="5.5" fill="none"/>
  </g>
  <text x="340" y="292" font-family="Segoe UI, Arial, sans-serif" font-size="92" font-weight="800" letter-spacing="-2">
    <tspan fill="#FFFFFF">AIR</tspan><tspan fill="#7BB3E1">STAY</tspan>
  </text>
  <text x="344" y="352" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#D6E7F6">Compare flights, stays and cars from Canada</text>
  <rect x="344" y="392" width="72" height="6" rx="3" fill="#4381C7"/>
  <text x="344" y="448" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#A9CDEC">Priced in CAD · Book on trusted partner sites</text>
  <text x="344" y="540" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">airstay.ca</text>
</svg>`);

const jobs = [
  { file: "favicon.png", svg: squareIcon("#071840"), size: 64 },
  { file: "favicon-32.png", svg: squareIcon("#071840"), size: 32 },
  { file: "icon-192.png", svg: squareIcon("#071840"), size: 192 },
  { file: "apple-touch-icon.png", svg: squareIcon("#FFFFFF", "#071840", 0), size: 180, flatten: "#071840" },
  { file: "og.png", svg: og, size: [1200, 630], flatten: "#071840" },
];

for (const job of jobs) {
  let img = sharp(job.svg, { density: 384 });
  img = Array.isArray(job.size) ? img.resize(job.size[0], job.size[1]) : img.resize(job.size, job.size);
  if (job.flatten) img = img.flatten({ background: job.flatten });
  await img.png({ compressionLevel: 9 }).toFile(join(dir, job.file));
  console.log("wrote", job.file);
}

writeFileSync(
  join(dir, "site.webmanifest"),
  JSON.stringify(
    {
      name: "AIRSTAY",
      short_name: "AIRSTAY",
      description: "Compare flights, stays and cars leaving Canada. Prices in CAD.",
      start_url: "/",
      display: "standalone",
      background_color: "#F3F6FB",
      theme_color: "#071840",
      icons: [
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { src: "/favicon.png", sizes: "64x64", type: "image/png" },
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    null,
    2
  )
);
console.log("wrote site.webmanifest");
