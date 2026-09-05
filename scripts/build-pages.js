const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'dist');
const maxCloudflareAssetBytes = 25 * 1024 * 1024;
const excludedDirs = new Set(['.git', 'dist', 'node_modules', '__pycache__', '.tempmediaStorage', 'scratch']);

function copyEntry(src, dest) {
  const stat = fs.statSync(src);
  const name = path.basename(src);

  if (stat.isDirectory()) {
    if (excludedDirs.has(name)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyEntry(path.join(src, child), path.join(dest, child));
    }
    return;
  }

  if (stat.size > maxCloudflareAssetBytes) {
    console.log(`Skipping ${path.relative(root, src)} (${(stat.size / 1024 / 1024).toFixed(1)} MiB)`);
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of fs.readdirSync(root)) {
  copyEntry(path.join(root, entry), path.join(outDir, entry));
}

console.log(`Cloudflare Pages assets prepared in ${path.relative(root, outDir)}`);
