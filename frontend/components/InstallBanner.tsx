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
      className="sticky top-0 z-50 w-full border-b border-primary/30 bg-background/95 backdrop-blur"
      style={{ paddingTop: 'var(--safe-top)' }}
      role="region"
      aria-label="Install MyChat"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10">
          <MyChatLogo size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground sm:text-sm">
            {iosMode ? 'Install MyChat' : 'Install MyChat for the full experience'}
          </p>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            {iosMode ? (
              <>
                Tap <Share className="inline h-3 w-3 align-[-2px]" /> then{' '}
                <span className="text-foreground">Add to Home Screen</span>
              </>
            ) : (
              'One tap. Launches like a native app.'
            )}
          </p>
        </div>
        {!iosMode && (
          <button
            onClick={handleInstall}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" />
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
