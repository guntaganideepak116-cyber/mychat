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

  // Auto-resize textarea up to ~6 lines
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 24 * 6 + 32; // ~6 lines
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [value]);

  const canSend = value.trim().length > 0 && !streaming && !disabled;

  return (
    <div
      className="border-t border-border bg-background/90 backdrop-blur-md px-3 sm:px-6 py-3 shrink-0"
      style={{ paddingBottom: 'calc(0.75rem + var(--safe-bottom))' }}
    >
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-xl border bg-surface transition-all duration-200',
            'focus-within:border-brand-blue/60 focus-within:shadow-[0_0_0_3px_rgba(46,111,246,0.12)]',
            'border-border',
          )}
        >
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
            placeholder="Ask me anything…"
            disabled={disabled}
            aria-label="Message input"
            className={cn(
              'flex-1 resize-none bg-transparent px-4 py-3.5 text-foreground placeholder:text-muted-foreground',
              'focus:outline-none max-h-[168px] leading-relaxed',
              // CRITICAL: 16px+ font-size prevents iOS Safari auto-zoom on focus
              'text-base sm:text-sm',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />

          {/* Send / Stop button — 44×44px minimum tap target */}
          <div className="p-2 shrink-0">
            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                className="grid h-11 w-11 place-items-center rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors"
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
                  'grid h-11 w-11 place-items-center rounded-lg transition-all duration-200',
                  canSend
                    ? 'bg-brand-gradient text-white hover:brightness-110 hover:scale-105 active:scale-95 shadow-md shadow-brand-blue/25'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
                )}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
          MyChat can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
