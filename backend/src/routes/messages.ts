import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { sendMessageAndStreamResponse } from '../controllers/messagesController';

const router = Router();

// Protect message routes with Clerk authentication
router.use(requireAuth as unknown as Router);

/**
 * @route   POST /api/messages/:id
 * @desc    Alternative convenience endpoint for sending message and streaming response
 */
router.post('/:id', sendMessageAndStreamResponse as unknown as Router);

export default router;
