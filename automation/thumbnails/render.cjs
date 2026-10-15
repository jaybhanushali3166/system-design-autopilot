// Reuse the established Remotion thumbnail shell; no model calls or video rendering.
const { bundle } = require('@remotion/bundler');
const { openBrowser, renderStill, selectComposition } = require('@remotion/renderer');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const args = process.argv.slice(2);
  const option = (key) => args[args.indexOf(key) + 1];
  if (!args.includes('--input') || !args.includes('--output-dir')) throw new Error('--input and --output-dir required');
  const jobs = JSON.parse(fs.readFileSync(option('--input'), 'utf8'));
  const outputDir = path.resolve(option('--output-dir'));
  const name = args.includes('--name') ? option('--name') : null;
  if (!Array.isArray(jobs) || jobs.length < 1 || (name && (jobs.length !== 1 || !/^[a-z0-9-]+$/.test(name)))) throw new Error('Invalid cover jobs');
  fs.mkdirSync(outputDir, { recursive: true });
  const root = path.resolve(__dirname, '../..');
  const serveUrl = await bundle({ entryPoint: path.join(__dirname, 'entry.tsx'), publicDir: null, rootDir: root });
  const browser = await openBrowser('chrome');
  try {
    const composition = await selectComposition({ serveUrl, id: 'course-cover', inputProps: jobs[0], puppeteerInstance: browser });
    for (const job of jobs) {
      if (!/^lesson-(0[1-9]|[1-5][0-9]|60)$/.test(job.item?.id)) throw new Error('Invalid lesson ID');
      const base = path.join(outputDir, name || `thumb-${job.item.id}`);
      for (const imageFormat of ['png', 'jpeg']) {
        await renderStill({ serveUrl, composition, inputProps: job, frame: 0, puppeteerInstance: browser,
          imageFormat, ...(imageFormat === 'jpeg' ? { jpegQuality: 95 } : {}), output: `${base}.${imageFormat === 'jpeg' ? 'jpg' : 'png'}` });
      }
      console.log(`Cover ready: ${job.item.id} — ${job.item.category}`);
    }
  } finally {
    await browser.close({ silent: true });
  }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
