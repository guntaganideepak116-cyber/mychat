const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
const cacheDir = path.join(nextDir, 'cache');
const indexHtmlSrc = path.join(nextDir, 'server', 'app', 'index.html');
const indexHtmlDest = path.join(nextDir, 'index.html');
const publicDir = path.join(__dirname, '..', 'public');

// 1. Purge .next/cache to satisfy Cloudflare Pages 25MB limit
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('[Build] Purged .next/cache to satisfy Cloudflare Pages 25MB limit.');
}

// 2. Recursive folder copy helper
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, file));
      } else {
        fs.copyFileSync(curSource, path.join(target, file));
      }
    });
  }
}

// 3. Place index.html at .next root so Cloudflare Pages serves home page at /
if (fs.existsSync(indexHtmlSrc)) {
  fs.copyFileSync(indexHtmlSrc, indexHtmlDest);
  console.log('[Build] Placed index.html at .next root for Cloudflare Pages home routing.');
}

// 4. Copy .next/static into .next/_next/static so Cloudflare serves /_next/static/* natively with correct MIME types
const staticSrc = path.join(nextDir, 'static');
const _nextStaticDest = path.join(nextDir, '_next', 'static');

if (fs.existsSync(staticSrc)) {
  copyFolderRecursiveSync(staticSrc, _nextStaticDest);
  console.log('[Build] Copied .next/static into .next/_next/static for exact CSS/JS MIME types.');
}

// 5. Copy public folder assets (manifest.webmanifest, icons, etc.) to .next root
if (fs.existsSync(publicDir)) {
  copyFolderRecursiveSync(publicDir, nextDir);
  console.log('[Build] Copied public assets to .next root.');
}
