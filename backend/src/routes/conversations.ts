import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createConversation,
  listConversations,
  getConversationMessages,
  removeConversation,
} from '../controllers/conversationsController';
import { sendMessageAndStreamResponse } from '../controllers/messagesController';

const router = Router();

// Protect all conversation routes with Clerk authentication
router.use(requireAuth as unknown as Router);

/**
 * @route   POST /api/conversations
 * @desc    Create a new empty conversation for the authenticated user
 */
router.post('/', createConversation as unknown as Router);

/**
 * @route   GET /api/conversations
 * @desc    List all conversations for the authenticated user
 */
router.get('/', listConversations as unknown as Router);

/**
 * @route   GET /api/conversations/:id/messages
 * @desc    Get all messages for a specific conversation
 */
router.get('/:id/messages', getConversationMessages as unknown as Router);

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Delete a conversation and all its subcollection messages
 */
router.delete('/:id', removeConversation as unknown as Router);

/**
 * @route   POST /api/conversations/:id/messages
 * @desc    Send user message and receive real-time SSE streamed AI response
 */
router.post('/:id/messages', sendMessageAndStreamResponse as unknown as Router);

export default router;
