'use client';

import { useEffect, useState } from 'react';
import { X, Download, Share } from 'lucide-react';
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
  // iOS legacy
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

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone()) return; // Already installed — never show
    if (isInAppBrowser()) return; // Can't install here
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;

    const ios = detectIOS();

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    if (ios) {
      setIosMode(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible) return null;

  const handleInstall = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        setVisible(false);
      }
      setDeferred(null);
    } catch {
      /* ignore */
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    setVisible(false);
  };

  return (
    <div
      className="sticky top-0 z-50 w-full border-b border-brand-blue/25 bg-background/95 backdrop-blur"
      style={{ paddingTop: 'var(--safe-top)' }}
      role="region"
      aria-label="Install MyChat"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
        {/* App icon */}
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-blue/10 border border-brand-blue/20">
          <MyChatLogo size={22} />
        </div>

        {/* Text content — truncates on 320px */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {iosMode ? 'Install MyChat' : 'Install MyChat for the best experience'}
          </p>
          <p className="truncate text-xs text-muted-foreground mt-0.5">
            {iosMode ? (
              <>
                Tap <Share className="inline h-3 w-3 align-[-2px]" /> then{' '}
                <span className="text-foreground font-medium">Add to Home Screen</span>
              </>
            ) : (
              'One tap · Launches like a native app · Works offline'
            )}
          </p>
        </div>

        {/* Install button — 44px min tap target */}
        {!iosMode && (
          <button
            onClick={handleInstall}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-brand-gradient px-4 text-xs font-semibold text-white transition hover:brightness-110 active:scale-[0.97] whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            Install
          </button>
        )}

        {/* Dismiss button — 44×44px minimum */}
        <button
          onClick={handleDismiss}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Dismiss install banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
