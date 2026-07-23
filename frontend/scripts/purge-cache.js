const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '.next', 'cache');

if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('[Build] Successfully purged .next/cache to satisfy Cloudflare Pages 25MB file limit.');
}
