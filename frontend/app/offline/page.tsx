'use client';

import { MyChatLogo } from '@/components/ui/MyChatLogo';

export default function OfflinePage() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-background px-4 text-center"
      style={{
        paddingTop: 'var(--safe-top)',
        paddingBottom: 'var(--safe-bottom)',
      }}
    >
      <div className="max-w-md">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center">
          <MyChatLogo size={72} animated />
        </div>
        <h1 className="font-display text-2xl uppercase tracking-widest text-glow">
          Signal lost
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You&apos;re offline. MyChat needs a connection to respond.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
