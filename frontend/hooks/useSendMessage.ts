import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { streamMockResponse } from '@/lib/mock-ai';
import type { Message } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface UseSendMessageOptions {
  conversationId: string;
  onToken: (token: string) => void;
  onStart: () => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

/**
 * Custom hook that handles sending a message and reading the streamed response.
 *
 * When NEXT_PUBLIC_API_URL is set:
 *   POSTs to {API_BASE}/api/chat and reads the response as a ReadableStream,
 *   decoding SSE chunks token-by-token.
 *
 * When NEXT_PUBLIC_API_URL is NOT set (demo mode):
 *   Falls back to the local mock streaming generator.
 */
export function useSendMessage() {
  const { getToken } = useAuth();
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      messages: Message[],
      convId: string,
      options: UseSendMessageOptions,
    ) => {
      const { onToken, onStart, onDone, onError } = options;

      const ac = new AbortController();
      abortRef.current = ac;
      setThinking(true);

      try {
        if (!API_BASE) {
          // ── Demo / mock mode ──────────────────────────────────────────
          const lastMsg = messages[messages.length - 1];
          const prompt = lastMsg?.content ?? '';
          const stream = streamMockResponse(prompt, ac.signal);
          let started = false;
          for await (const chunk of stream) {
            if (!started) {
              started = true;
              setThinking(false);
              setStreaming(true);
              onStart();
            }
            onToken(chunk);
          }
        } else {
          // ── Real backend via SSE / ReadableStream ─────────────────────
          const token = await getToken();

          const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            signal: ac.signal,
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              conversationId: convId,
              messages: messages.map((m) => ({ role: m.role, content: m.content })),
            }),
          });

          if (!res.ok) {
            throw new Error(`Backend error: ${res.status} ${res.statusText}`);
          }

          const reader = res.body?.getReader();
          if (!reader) throw new Error('No readable stream on response');

          const decoder = new TextDecoder();
          let started = false;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });

            // Parse SSE lines: "data: ...\n\n"
            const lines = text.split('\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const payload = line.slice(6).trim();

              if (payload === '[DONE]') break;

              try {
                const parsed = JSON.parse(payload) as {
                  token?: string;
                  done?: boolean;
                  error?: string;
                };

                if (parsed.error) {
                  throw new Error(parsed.error);
                }

                if (parsed.done) break;

                if (parsed.token) {
                  if (!started) {
                    started = true;
                    setThinking(false);
                    setStreaming(true);
                    onStart();
                  }
                  onToken(parsed.token);
                }
              } catch (parseErr) {
                // Plain text chunk (non-JSON SSE) — treat whole line as token
                if (!started) {
                  started = true;
                  setThinking(false);
                  setStreaming(true);
                  onStart();
                }
                onToken(payload);
              }
            }
          }
        }

        onDone();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          onError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        setStreaming(false);
        setThinking(false);
        abortRef.current = null;
      }
    },
    [getToken],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, stop, streaming, thinking };
}
