'use client';

import { useEffect, useState } from 'react';
import { X, Download, Share, Smartphone, Zap, WifiOff } from 'lucide-react';
import { MyChatLogo } from '@/components/ui/MyChatLogo';

// Chromium beforeinstallprompt event shape.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt: () => Promise<void>;
}

const SESSION_DISMISS_KEY = 'mychat:install-dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && isSafari;
}

function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /(FBAN|FBAV|Instagram|Line|Twitter|Snapchat|WeChat|MicroMessenger)/i.test(ua);
}

const FEATURES = [
  { icon: Zap, label: 'Instant launch' },
  { icon: WifiOff, label: 'Works offline' },
  { icon: Smartphone, label: 'Native feel' },
];

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone()) return;
    if (isInAppBrowser()) return;
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;

    const ios = detectIOS();

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Small delay so page loads first, then banner slides up
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => setAnimating(true), 10);
      }, 2500);
    };
    const onInstalled = () => {
      handleClose();
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    if (ios) {
      setIosMode(true);
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => setAnimating(true), 10);
      }, 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function handleClose() {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    }, 300);
  }

  const handleInstall = async () => {
    if (!deferred) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        handleClose();
      }
      setDeferred(null);
    } catch {
      /* ignore */
    } finally {
      setInstalling(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop — semi-transparent overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: animating ? 1 : 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom sheet modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: animating ? 'translateY(0)' : 'translateY(100%)',
          paddingBottom: 'var(--safe-bottom)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Install MyChat"
      >
        <div className="mx-auto max-w-lg bg-surface border border-border/80 rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Gradient accent bar at top */}
          <div className="h-1 bg-brand-gradient mx-4 rounded-full mb-6" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="px-6 pb-8">
            {/* App identity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-brand-gradient p-0.5 shadow-lg shadow-brand-blue/25">
                  <div className="h-full w-full rounded-[14px] bg-surface flex items-center justify-center">
                    <MyChatLogo size={36} />
                  </div>
                </div>
                {/* Online badge */}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-surface" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-foreground leading-tight">
                  Install <span className="text-brand-gradient">MyChat</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your personal AI assistant
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-3 w-3 text-warning fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">5.0</span>
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex items-center gap-2 mb-6">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center gap-1.5 rounded-xl bg-background border border-border/60 py-3 px-2"
                >
                  <Icon className="h-4 w-4 text-brand-blue" />
                  <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {iosMode ? (
              /* iOS instructions */
              <div className="rounded-2xl bg-background border border-border/60 p-4 mb-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  To install on iOS:
                </p>
                <ol className="space-y-2.5">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue text-xs font-bold">1</span>
                    Tap the <Share className="inline h-4 w-4 mx-1 text-brand-blue" /> Share button
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue text-xs font-bold">2</span>
                    Scroll down and tap <strong className="text-foreground ml-1">"Add to Home Screen"</strong>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue text-xs font-bold">3</span>
                    Tap <strong className="text-foreground ml-1">"Add"</strong> to confirm
                  </li>
                </ol>
              </div>
            ) : (
              /* Android/Chrome install button */
              <button
                onClick={handleInstall}
                disabled={installing}
                className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-brand-gradient text-white font-semibold text-base shadow-lg shadow-brand-blue/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {installing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Installing…
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Install App — It's Free
                  </>
                )}
              </button>
            )}

            <p className="text-center text-xs text-muted-foreground/60 mt-3">
              No App Store needed · ~0 MB · Instant
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
