// Process the new TechHub logo — extract blue elements with transparent background.
// The source PNG has a dark navy background with no alpha channel.
// We detect dark pixels and make them transparent, keeping only the blue logo.
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, "..", "public");
const SRC = path.join(PUBLIC, "logo-new.png");

async function main() {
  console.log("Processing logo…");

  // Get raw pixel data
  const { data, info } = await sharp(SRC)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Source: ${width}x${height}, ${channels} channels`);

  // Create alpha channel: transparent for dark pixels, opaque for bright (blue) pixels
  const alpha = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    // Brightness — blue logo pixels are bright, dark background is dim
    const brightness = (r + g + b) / 3;
    // Threshold: pixels brighter than 50 are logo, darker are background
    if (brightness > 45) {
      alpha[i] = 255; // opaque
    } else {
      alpha[i] = 0; // transparent
    }
  }

  // Combine RGB + alpha
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * channels];
    rgba[i * 4 + 1] = data[i * channels + 1];
    rgba[i * 4 + 2] = data[i * channels + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  // Save transparent version
  const transparentPath = path.join(PUBLIC, "logo-transparent.png");
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(transparentPath);
  console.log(`  ✓ logo-transparent.png (${width}x${height}, transparent bg)`);

  // Create a white-background version for light mode
  const whiteBg = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  }).png().toBuffer();

  await sharp(transparentPath)
    .composite([{ input: whiteBg, blend: "dest-over" }])
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(path.join(PUBLIC, "logo-light.png"));
  console.log("  ✓ logo-light.png (white background)");

  // Create various sizes for PWA icons (square, from transparent version on white)
  const sizes = [32, 64, 128, 180, 256, 512];
  for (const size of sizes) {
    await sharp(transparentPath)
      .resize({ width: size, height: size, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: "#ffffff" })
      .png()
      .toFile(path.join(PUBLIC, `icon-${size}.png`));
    console.log(`  ✓ icon-${size}.png`);
  }

  // Apple touch icon
  await sharp(transparentPath)
    .resize({ width: 180, height: 180, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png (180x180)");

  // Maskable icon (512x512 with safe-zone padding)
  await sharp(transparentPath)
    .resize({ width: 300, height: 300, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 106, bottom: 106, left: 106, right: 106, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(path.join(PUBLIC, "icon-maskable-512.png"));
  console.log("  ✓ icon-maskable-512.png (512x512, maskable)");

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
