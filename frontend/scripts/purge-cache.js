const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
const cacheDir = path.join(nextDir, 'cache');
const appDir = path.join(nextDir, 'server', 'app');

// 1. Purge .next/cache to satisfy Cloudflare Pages 25MB single-file limit
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('[Build] Purged .next/cache to satisfy Cloudflare Pages 25MB limit.');
}

// 2. Helper to recursively copy files
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

// 3. Promote compiled app HTML files into .next root so Cloudflare Pages serves index.html natively
if (fs.existsSync(appDir)) {
  copyFolderRecursiveSync(appDir, nextDir);
  console.log('[Build] Promoted compiled Next.js App HTML files into .next root for Cloudflare Pages 200 OK routing.');
}

// 4. Copy _redirects into .next
const redirectSrc = path.join(__dirname, '..', 'public', '_redirects');
const redirectDest = path.join(nextDir, '_redirects');

if (fs.existsSync(redirectSrc)) {
  fs.copyFileSync(redirectSrc, redirectDest);
  console.log('[Build] Copied _redirects into .next for Cloudflare Pages SPA routing.');
}
