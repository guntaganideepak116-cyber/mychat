import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Centralized Express Error Handler Middleware.
 * Catches unhandled errors, logs server-side diagnostic details without leaking secrets,
 * and sends standardized JSON error responses to the client.
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const userId = (req as AuthenticatedRequest).auth?.userId || 'unauthenticated';

  console.error(`[Error] Path: ${req.method} ${req.originalUrl} | User: ${userId} | Status: ${statusCode}`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (res.headersSent) {
    return;
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
  });
};
