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

const tagline = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="120">
  <text x="500" y="38" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600" fill="#071840">Canada's choice to compare flights, hotels and car rentals</text>
  <text x="500" y="82" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#4381C7">airstay.ca · Priced in CAD</text>
</svg>`);

const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="500">
  <rect width="1080" height="500" rx="36" fill="#FFFFFF"/>
</svg>`);

const jobs = [
  { file: "favicon.png", svg: squareIcon("#071840"), size: 64 },
  { file: "favicon-32.png", svg: squareIcon("#071840"), size: 32 },
  { file: "icon-192.png", svg: squareIcon("#071840"), size: 192 },
  { file: "apple-touch-icon.png", svg: squareIcon("#FFFFFF", "#071840", 0), size: 180, flatten: "#071840" },
];

for (const job of jobs) {
  let img = sharp(job.svg, { density: 384 });
  img = Array.isArray(job.size) ? img.resize(job.size[0], job.size[1]) : img.resize(job.size, job.size);
  if (job.flatten) img = img.flatten({ background: job.flatten });
  await img.png({ compressionLevel: 9 }).toFile(join(dir, job.file));
  console.log("wrote", job.file);
}

const logo = await sharp(join(dir, "logo.png")).resize({ width: 920, withoutEnlargement: true }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const logoTop = 70 + Math.round((340 - (logoMeta.height || 190)) / 2);
const logoLeft = Math.round((1200 - (logoMeta.width || 920)) / 2);

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#071840" },
})
  .composite([
    { input: await sharp(card).png().toBuffer(), top: 65, left: 60 },
    { input: logo, top: Math.max(100, logoTop), left: logoLeft },
    { input: await sharp(tagline).png().toBuffer(), top: 455, left: 100 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(join(dir, "og.png"));
console.log("wrote og.png");

writeFileSync(
  join(dir, "site.webmanifest"),
  JSON.stringify(
    {
      name: "AIRSTAY",
      short_name: "AIRSTAY",
      description: "Canada's choice to compare flights, hotels and car rentals.",
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
