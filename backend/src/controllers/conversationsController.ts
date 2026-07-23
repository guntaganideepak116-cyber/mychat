import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as firestoreService from '../services/firestoreService';

/**
 * POST /api/conversations
 * Creates a new conversation document for the authenticated user.
 */
export async function createConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.auth.userId;
    const conversation = await firestoreService.createConversation(userId);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/conversations
 * Returns all conversations belonging to the authenticated user, sorted by updatedAt desc.
 */
export async function listConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.auth.userId;
    const conversations = await firestoreService.getConversationsByUser(userId);
    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/conversations/:id/messages
 * Returns all messages for a specific conversation, sorted by createdAt asc.
 * Verifies conversation ownership first.
 */
export async function getConversationMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.auth.userId;
    const conversationId = req.params.id;

    // Verify ownership
    const conversation = await firestoreService.getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: Access to this conversation is denied' });
      return;
    }

    const messages = await firestoreService.getMessagesByConversation(conversationId);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/conversations/:id
 * Deletes a conversation and all its subcollection messages.
 * Verifies conversation ownership first.
 */
export async function removeConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.auth.userId;
    const conversationId = req.params.id;

    // Verify ownership
    const conversation = await firestoreService.getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: Access to this conversation is denied' });
      return;
    }

    await firestoreService.deleteConversation(conversationId);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
}
