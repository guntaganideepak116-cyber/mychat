import { Response, NextFunction, RequestHandler } from 'express';
import { getAuth, clerkMiddleware } from '@clerk/express';
import { AuthenticatedRequest } from '../types';

/**
 * Global Clerk Middleware to parse Clerk authentication state on all requests.
 */
export const clerkAuthMiddleware: RequestHandler = clerkMiddleware();

/**
 * Require Auth Middleware.
 * Ensures the request carries a valid, authenticated Clerk session token.
 * Rejects unauthenticated requests with HTTP 401.
 * Attaches verified userId to req.auth.userId.
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    res.status(401).json({
      error: 'Unauthorized: Authentication token is missing or invalid',
    });
    return;
  }

  // Attach verified userId to request object
  req.auth = {
    userId: auth.userId,
  };

  next();
};
