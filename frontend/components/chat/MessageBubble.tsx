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
    <div className={cn('flex gap-3 w-full', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="shrink-0 mt-1 grid h-8 w-8 place-items-center rounded-md border border-primary/40 bg-surface">
          <MyChatLogo size={20} />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-surface-elevated border-l-2 border-primary text-foreground'
            : 'bg-surface text-foreground',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:font-display prose-code:text-primary prose-strong:text-foreground prose-a:text-primary">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = className?.includes('language-');
                  if (!isBlock) {
                    return (
                      <code className="rounded bg-muted px-1.5 py-0.5 text-primary" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <SyntaxHighlighter
                      language={match?.[1] ?? 'text'}
                      style={atomDark}
                      customStyle={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {message.content || ' '}
            </ReactMarkdown>
            {streaming && (
              <span className="inline-block w-2 h-4 -mb-0.5 bg-primary animate-caret" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
