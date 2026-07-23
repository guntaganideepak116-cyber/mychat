const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
const cacheDir = path.join(nextDir, 'cache');
const indexHtmlSrc = path.join(nextDir, 'server', 'app', 'index.html');
const indexHtmlDest = path.join(nextDir, 'index.html');

// 1. Purge .next/cache to satisfy Cloudflare Pages 25MB limit
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('[Build] Purged .next/cache to satisfy Cloudflare Pages 25MB limit.');
}

// 2. Place index.html at .next root so Cloudflare Pages serves home page at /
if (fs.existsSync(indexHtmlSrc)) {
  fs.copyFileSync(indexHtmlSrc, indexHtmlDest);
  console.log('[Build] Placed index.html at .next root for Cloudflare Pages 200 OK home routing.');
}

// 3. Copy _redirects into .next
const redirectSrc = path.join(__dirname, '..', 'public', '_redirects');
const redirectDest = path.join(nextDir, '_redirects');

if (fs.existsSync(redirectSrc)) {
  fs.copyFileSync(redirectSrc, redirectDest);
  console.log('[Build] Copied _redirects into .next for Cloudflare Pages SPA asset & route handling.');
}
