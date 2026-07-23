// Guarded service-worker registration wrapper.
// Only runs in production, top-level windows, and non-preview hosts.
// Honors ?sw=off kill switch.

const SW_URL = '/sw.js';

function isRefused(): boolean {
  if (typeof window === 'undefined') return true;
  if (process.env.NODE_ENV !== 'production') return true;
  try {
    if (window.top !== window.self) return true;
  } catch {
    return true;
  }
  const host = window.location.hostname;
  if (
    host.startsWith('id-preview--') ||
    host.startsWith('preview--') ||
    host === 'lovableproject.com' ||
    host.endsWith('.lovableproject.com') ||
    host === 'lovableproject-dev.com' ||
    host.endsWith('.lovableproject-dev.com') ||
    host === 'beta.lovable.dev' ||
    host.endsWith('.beta.lovable.dev')
  ) {
    return true;
  }
  if (new URLSearchParams(window.location.search).get('sw') === 'off') return true;
  return false;
}

async function unregisterMatching() {
  if (!('serviceWorker' in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || '';
        return url.endsWith(SW_URL);
      })
      .map((r) => r.unregister()),
  );
}

export async function registerPwa() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if (isRefused()) {
    await unregisterMatching().catch(() => {});
    return;
  }
  try {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox(SW_URL);
    wb.addEventListener('waiting', () => {
      // A new version is ready. Prompt via a custom event.
      window.dispatchEvent(
        new CustomEvent('mychat:sw-update', {
          detail: {
            accept: () => {
              wb.addEventListener('controlling', () => window.location.reload());
              wb.messageSkipWaiting();
            },
          },
        }),
      );
    });
    await wb.register();
  } catch (err) {
    console.warn('[pwa] register failed', err);
  }
}
