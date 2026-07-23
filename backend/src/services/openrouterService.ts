import { openrouter, OPENROUTER_MODEL } from '../config/openrouter';
import { Role } from '../types';

const SYSTEM_PROMPT =
  'You are MyChat, a helpful, clear, and friendly AI assistant. Give direct, useful answers.';

export interface ChatMessageInput {
  role: Role | 'system';
  content: string;
}

/**
 * Streams AI completion chunks from OpenRouter using OpenAI-compatible SDK.
 *
 * @param messages Array of previous chat messages for context
 * @param onToken Callback function invoked for every streamed chunk token
 * @param onComplete Callback function invoked with full accumulated text when stream ends
 * @param signal AbortSignal to cleanly cancel streaming if client disconnects
 */
export async function streamChatResponse(
  messages: ChatMessageInput[],
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const formattedMessages: ChatMessageInput[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  try {
    const responseStream = await openrouter.chat.completions.create(
      {
        model: OPENROUTER_MODEL,
        messages: formattedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      },
      {
        signal,
      },
    );

    let fullText = '';

    for await (const chunk of responseStream) {
      if (signal?.aborted) {
        console.log('[OpenRouter] Stream aborted by client signal.');
        break;
      }

      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        fullText += token;
        onToken(token);
      }
    }

    if (!signal?.aborted) {
      onComplete(fullText);
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError' || signal?.aborted) {
      console.log('[OpenRouter] Streaming request was aborted.');
      return;
    }
    console.error('[OpenRouter] Streaming error:', err);
    throw err;
  }
}
