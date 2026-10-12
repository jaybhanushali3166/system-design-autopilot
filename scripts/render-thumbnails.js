const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const THUMBNAILS = [
  "thumb-load-balancer",
  "thumb-lb-algorithms",
  "thumb-lb-layers-ha",
  "thumb-lb-consistent-hashing",
  "thumb-caching-fresh",
  "thumb-rate-limiter",
  "thumb-packet-journey",
  "thumb-monkey-scale",
  "thumb-monkey-caching",
  "thumb-networking-essentials",
];

const outDir = path.join(__dirname, "..", "out", "thumbnails");
fs.mkdirSync(outDir, { recursive: true });

console.log("🎨 Starting batch rendering of all reel thumbnails...\n");

for (let i = 0; i < THUMBNAILS.length; i++) {
  const id = THUMBNAILS[i];
  const outFile = path.join(outDir, `${id}.png`);
  console.log(`[${i + 1}/${THUMBNAILS.length}] Rendering ${id} -> ${outFile}...`);
  try {
    execSync(`npx remotion still src/index.ts ${id} "${outFile}"`, {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
    console.log(`✅ Success: ${id}.png\n`);
  } catch (err) {
    console.error(`❌ Error rendering ${id}:`, err.message);
  }
}

console.log("✨ All thumbnails rendered successfully in out/thumbnails/!");
