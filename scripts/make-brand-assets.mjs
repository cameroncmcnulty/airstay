import sharp from "sharp";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const NAVY = "#071840";
const SKY = [125, 186, 232];

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

function dist(r, g, b, r2, g2, b2) {
  const dr = r - r2;
  const dg = g - g2;
  const db = b - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function recolorLogoForDark() {
  const { data, info } = await sharp(join(dir, "logo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];
    if (a < 8) {
      out[i + 3] = 0;
      continue;
    }
    const fromWhite = dist(r, g, b, 255, 255, 255);
    if (fromWhite < 14) {
      out[i + 3] = 0;
      continue;
    }
    const brightness = (r + g + b) / 3;
    const isStayBlue = b > 130 && g > 90 && r < 170 && b > r + 20 && brightness > 85;
    const alpha = Math.min(a, Math.min(255, Math.round(fromWhite * 1.35)));
    if (isStayBlue) {
      out[i] = SKY[0];
      out[i + 1] = SKY[1];
      out[i + 2] = SKY[2];
      out[i + 3] = alpha;
    } else {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      out[i + 3] = alpha;
    }
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .trim({ threshold: 8 })
    .toBuffer();
}

const jobs = [
  { file: "favicon.png", svg: squareIcon("#071840"), size: 64 },
  { file: "favicon-32.png", svg: squareIcon("#071840"), size: 32 },
  { file: "icon-192.png", svg: squareIcon("#071840"), size: 192 },
  { file: "apple-touch-icon.png", svg: squareIcon("#FFFFFF", "#071840", 0), size: 180, flatten: "#071840" },
];

for (const job of jobs) {
  let img = sharp(job.svg, { density: 384 });
  img = img.resize(job.size, job.size);
  if (job.flatten) img = img.flatten({ background: job.flatten });
  await img.png({ compressionLevel: 9 }).toFile(join(dir, job.file));
  console.log("wrote", job.file);
}

const lightLogo = await recolorLogoForDark();
await sharp(lightLogo).png({ compressionLevel: 9 }).toFile(join(dir, "logo-light.png"));
console.log("wrote logo-light.png");

// Messenger square-crops the centre of 1200×630. Keep the lockup inside ~560px.
const logoFit = await sharp(lightLogo).resize({ width: 540, withoutEnlargement: true }).png().toBuffer();
const logoMeta = await sharp(logoFit).metadata();
const logoW = logoMeta.width || 540;
const logoH = logoMeta.height || 110;

const tagline = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="96">
  <text x="280" y="28" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#FFFFFF">Canada's choice to compare</text>
  <text x="280" y="56" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#FFFFFF">flights, hotels and car rentals</text>
  <text x="280" y="86" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#7DBAE8">airstay.ca · Priced in CAD</text>
</svg>`);
const tagPng = await sharp(tagline).png().toBuffer();
const tagMeta = await sharp(tagPng).metadata();
const tagW = tagMeta.width || 560;
const tagH = tagMeta.height || 96;

const gap = 26;
const blockH = logoH + gap + tagH;
const logoTop = Math.max(0, Math.round((630 - blockH) / 2));
const logoLeft = Math.round((1200 - logoW) / 2);
const tagTop = logoTop + logoH + gap;
const tagLeft = Math.round((1200 - tagW) / 2);

const og = sharp({
  create: { width: 1200, height: 630, channels: 3, background: NAVY },
}).composite([
  { input: logoFit, top: logoTop, left: logoLeft },
  { input: tagPng, top: tagTop, left: tagLeft },
]);

await og.clone().jpeg({ quality: 92, mozjpeg: true }).toFile(join(dir, "og.jpg"));
console.log("wrote og.jpg");
await og.clone().png({ compressionLevel: 9 }).toFile(join(dir, "og.png"));
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
