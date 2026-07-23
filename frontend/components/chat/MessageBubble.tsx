'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MyChatLogo } from '@/components/ui/MyChatLogo';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface Props {
  message: Message;
  streaming?: boolean;
}

export function MessageBubble({ message, streaming }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2 sm:gap-3 w-full', isUser ? 'justify-end' : 'justify-start')}>
      {/* AI avatar */}
      {!isUser && (
        <div className="shrink-0 mt-1 grid h-8 w-8 place-items-center rounded-md border border-brand-blue/30 bg-surface">
          <MyChatLogo size={20} />
        </div>
      )}

      <div
        className={cn(
          // Responsive max-width: wider on mobile to use space, narrower on desktop
          'max-w-[85%] sm:max-w-[78%] md:max-w-[72%] rounded-xl px-3.5 sm:px-4 py-3 text-sm leading-relaxed',
          isUser
            ? // User: brand gradient background, white text
              'bg-brand-gradient text-white rounded-tr-sm shadow-sm'
            : // AI: neutral surface, no brand color
              'bg-surface border border-border text-foreground rounded-tl-sm',
        )}
      >
        {isUser ? (
          /* User message: plain text, preserves whitespace, breaks long words */
          <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
        ) : (
          /* AI message: full markdown with syntax highlighting */
          <div
            className={cn(
              'prose prose-sm max-w-none',
              // Dark mode prose overrides
              'prose-p:my-2 prose-headings:font-bold',
              'prose-code:text-brand-blue prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5',
              'prose-strong:text-foreground prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline',
              'prose-invert',
              // Light mode: override prose-invert text colors
              'light:prose-p:text-foreground light:prose-headings:text-foreground',
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = className?.includes('language-');
                  if (!isBlock) {
                    return (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 text-brand-blue text-xs font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    /* Horizontally scrollable code block — never forces page scroll */
                    <div className="overflow-x-auto -mx-1 rounded-lg" style={{ WebkitOverflowScrolling: 'touch' }}>
                      <SyntaxHighlighter
                        language={match?.[1] ?? 'text'}
                        style={atomDark}
                        customStyle={{
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          fontSize: '0.82rem',
                          margin: 0,
                          minWidth: 'max-content',
                        }}
                        PreTag="div"
                        wrapLongLines={false}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {message.content || ' '}
            </ReactMarkdown>
            {/* Streaming cursor */}
            {streaming && (
              <span className="inline-block w-2 h-4 -mb-0.5 bg-brand-blue animate-caret" />
            )}
          </div>
        )}
      </div>

      {/* User avatar (right side) */}
      {isUser && (
        <div className="shrink-0 mt-1 grid h-8 w-8 place-items-center rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      )}
    </div>
  );
}
