import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as firestoreService from '../services/firestoreService';
import { streamChatResponse } from '../services/openrouterService';

/**
 * POST /api/conversations/:id/messages
 * Main SSE (Server-Sent Events) streaming route for sending messages and receiving AI responses.
 *
 * SSE Flow:
 * 1. Verify conversation exists and belongs to authenticated user
 * 2. Save user message to Firestore subcollection
 * 3. Auto-generate title if this is the initial message of the thread
 * 4. Fetch up to 20 recent messages for context
 * 5. Configure response headers for Server-Sent Events (SSE)
 * 6. Stream tokens from OpenRouter to client in real-time
 * 7. Save complete assistant response to Firestore when stream finishes
 * 8. Handle client aborts / disconnections cleanly
 */
export async function sendMessageAndStreamResponse(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.auth.userId;
  const conversationId = req.params.id;
  const { content } = req.body as { content?: string };

  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ error: 'Message content is required and cannot be empty' });
    return;
  }

  const userContent = content.trim();

  try {
    // ── Step 1: Verify Ownership ──────────────────────────────────────────────
    const conversation = await firestoreService.getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: Access to this conversation is denied' });
      return;
    }

    // ── Step 2: Save User Message ─────────────────────────────────────────────
    await firestoreService.addMessage(conversationId, 'user', userContent);

    // ── Step 3: Auto-generate Title for New Threads ────────────────────────────
    if (conversation.title === 'New Conversation' || !conversation.title) {
      const autoTitle =
        userContent.length > 48
          ? `${userContent.slice(0, 48).trim()}...`
          : userContent;
      await firestoreService.updateConversation(conversationId, { title: autoTitle });
    }

    // ── Step 4: Fetch Conversation Context (Last 20 messages) ─────────────────
    const history = await firestoreService.getMessagesByConversation(conversationId, 20);

    // ── Step 5: Set SSE Headers ───────────────────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in reverse proxies (Nginx / Railway)

    if (typeof (res as Response & { flushHeaders?: () => void }).flushHeaders === 'function') {
      (res as Response & { flushHeaders: () => void }).flushHeaders();
    }

    // Abort controller for clean disconnection handling
    const abortController = new AbortController();

    // ── Step 6: Handle Client Disconnect ──────────────────────────────────────
    req.on('close', () => {
      if (!res.writableEnded) {
        console.log(`[SSE] Client disconnected for conversation ${conversationId}. Aborting stream.`);
        abortController.abort();
      }
    });

    // ── Step 7: Stream Response from OpenRouter ───────────────────────────────
    await streamChatResponse(
      history.map((m) => ({ role: m.role, content: m.content })),
      // Token callback: stream each token as an SSE event
      (token: string) => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }
      },
      // Completion callback: save assistant message and close SSE stream
      async (fullText: string) => {
        try {
          if (fullText.trim()) {
            await firestoreService.addMessage(conversationId, 'assistant', fullText);
          }
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
          }
        } catch (saveErr) {
          console.error('[SSE] Failed to save assistant message:', saveErr);
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: 'Failed to save response' })}\n\n`);
            res.end();
          }
        }
      },
      abortController.signal,
    );
  } catch (err) {
    console.error(`[SSE] Error processing message stream for conversation ${conversationId}:`, err);

    if (res.headersSent && !res.writableEnded) {
      // Send error event over open SSE connection
      res.write(`data: ${JSON.stringify({ error: 'Something went wrong, please try again' })}\n\n`);
      res.end();
    } else if (!res.headersSent) {
      next(err);
    }
  }
}
