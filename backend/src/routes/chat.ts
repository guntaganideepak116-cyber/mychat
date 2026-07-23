import { Router, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { streamChatResponse } from '../services/openrouterService';
import * as firestoreService from '../services/firestoreService';

const router = Router();

/**
 * POST /api/chat
 * Primary streaming endpoint expected by frontend useSendMessage hook.
 */
router.post('/', (async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
  const { conversationId, messages } = req.body as {
    conversationId?: string;
    messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  const inputMessages = messages || [];
  if (inputMessages.length === 0) {
    res.status(400).json({ error: 'Messages array is required' });
    return;
  }

  // Configure SSE response headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const abortController = new AbortController();
  req.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    const userId = req.auth?.userId;
    const lastUserMsg = inputMessages[inputMessages.length - 1];

    // Optionally save last user message to Firestore if conversationId is provided
    if (userId && conversationId && lastUserMsg && lastUserMsg.role === 'user') {
      try {
        await firestoreService.addMessage(conversationId, 'user', lastUserMsg.content);
      } catch (e) {
        console.warn('[ChatRoute] User message save warning:', e);
      }
    }

    // Stream response from OpenRouter
    await streamChatResponse(
      inputMessages,
      (token: string) => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }
      },
      async (fullText: string) => {
        // Save assistant response to Firestore
        if (userId && conversationId && fullText.trim()) {
          try {
            await firestoreService.addMessage(conversationId, 'assistant', fullText);
          } catch (e) {
            console.warn('[ChatRoute] Assistant response save warning:', e);
          }
        }
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        }
      },
      abortController.signal,
    );
  } catch (err) {
    console.error('[ChatRoute] Error streaming chat response:', err);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'AI generation error' })}\n\n`);
      res.end();
    }
  }
}) as unknown as Router);

export default router;
