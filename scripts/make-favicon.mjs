import sharp from "sharp";

const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <g transform="translate(24 4)" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 26V16c0-5 4-10 10-10s10 5 10 10v10" stroke-width="7"/>
    <rect x="16" y="26" width="48" height="68" rx="11" stroke-width="7"/>
    <path d="M31 40v40M40 40v40M49 40v40" stroke-width="5.6"/>
    <circle cx="28" cy="102" r="6.2" stroke-width="6"/>
    <circle cx="52" cy="102" r="6.2" stroke-width="6"/>
  </g>
</svg>`;

async function suitcase(size) {
  return sharp(Buffer.from(whiteSvg), { density: Math.max(300, size * 8) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

for (const [file, size] of [
  ["public/favicon-32.png", 32],
  ["public/favicon.png", 64],
]) {
  await sharp(await suitcase(size)).png().toFile(file);
  console.log("wrote", file);
}

async function branded(size, file) {
  const pad = Math.round(size * 0.18);
  const inner = size - pad * 2;
  const mark = await suitcase(inner);
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 7, g: 24, b: 64, alpha: 1 } },
  })
    .composite([{ input: mark, left: pad, top: pad }])
    .png()
    .toFile(file);
  console.log("wrote", file);
}

await branded(180, "public/apple-touch-icon.png");
await branded(192, "public/icon-192.png");
console.log("done");
