#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");

const REELS = [
  "load-balancer",
  "lb-algorithms",
  "lb-layers-ha",
];

console.log(`\n🎬 Batch rendering ${REELS.length} reel(s)...\n`);

for (const id of REELS) {
  console.log(`▶️  Rendering: ${id}`);
  try {
    execSync(
      `npx remotion render src/index.ts ${id} out/${id}.mp4 --log=warn`,
      { stdio: "inherit", cwd: path.resolve(__dirname, "..") }
    );
    console.log(`✅  Finished: out/${id}.mp4\n`);
  } catch (err) {
    console.error(`❌  Failed to render: ${id}`, err.message);
  }
}

console.log("🏁 All done! Check the out/ folder for your final videos.");
