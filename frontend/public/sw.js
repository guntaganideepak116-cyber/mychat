// Minimal service worker for PWA support.
// For a full-featured PWA, use next-pwa or generate this with workbox-cli.
// This file is just a placeholder so the install prompt and manifest work.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy — fall through to network for all requests.
  event.respondWith(fetch(event.request));
});
