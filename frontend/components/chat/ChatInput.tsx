'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  streaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, onStop, streaming, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 24 * 6 + 24; // ~6 lines
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
  }, [value]);

  const canSend = value.trim().length > 0 && !streaming && !disabled;

  return (
    <div
      className="border-t border-border bg-background/80 backdrop-blur px-3 sm:px-6 py-3"
      style={{ paddingBottom: 'calc(0.75rem + var(--safe-bottom))' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-lg border border-border bg-surface focus-within:border-primary/60 focus-within:glow-cyan transition-colors">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSubmit();
              }
            }}
            rows={1}
            placeholder="Transmit your query..."
            className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[168px]"
          />
          <div className="p-2">
            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                className="grid h-9 w-9 place-items-center rounded-md bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4" fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSend}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-md transition-all',
                  canSend
                    ? 'bg-primary text-primary-foreground hover:brightness-110 glow-cyan'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          MyChat can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
