// Generate high-quality logo PNGs and PWA app icons from the source logo.
// Run: bun run scripts/generate-icons.ts
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC = path.join(__dirname, "..", "public");
const SRC = path.join(PUBLIC, "logo.jpeg");

async function main() {
  console.log("Generating logo variants and PWA icons…");

  const sizes = [
    { name: "logo-32.png", size: 32 },
    { name: "logo-64.png", size: 64 },
    { name: "logo-128.png", size: 128 },
    { name: "logo-256.png", size: 256 },
    { name: "logo-512.png", size: 512 },
    { name: "logo-1024.png", size: 1024 },
  ];

  for (const { name, size } of sizes) {
    await sharp(SRC)
      .resize({ width: size, height: size, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(PUBLIC, name));
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Apple touch icon (180x180)
  await sharp(SRC)
    .resize({ width: 180, height: 180, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png (180x180)");

  // Maskable icon (512x512 with safe-zone padding)
  await sharp(SRC)
    .resize({ width: 320, height: 320, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 96, bottom: 96, left: 96, right: 96, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC, "icon-maskable-512.png"));
  console.log("  ✓ icon-maskable-512.png (512x512, maskable)");

  // Favicon 32x32
  await sharp(SRC)
    .resize({ width: 32, height: 32, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, "favicon-32.png"));
  console.log("  ✓ favicon-32.png");

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
