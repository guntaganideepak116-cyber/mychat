import express, { Express } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { clerkAuthMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import conversationsRouter from './routes/conversations';
import messagesRouter from './routes/messages';
import { AuthenticatedRequest } from './types';

dotenv.config();

const app: Express = express();

// ── 1. CORS Configuration ──────────────────────────────────────────────────
const rawOrigins = process.env.FRONTEND_URL || '*';
const allowedOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.pages.dev') ||
        origin.startsWith('http://localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// Explicitly handle preflight OPTIONS requests for all routes
app.options('*', cors());

// ── 2. Body Parsing Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 3. Clerk Global Session Parser ──────────────────────────────────────────
app.use(clerkAuthMiddleware);

// ── 4. Rate Limiting (20 messages per minute per user/IP) ────────────────────
const messageRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 requests per minute
  keyGenerator: (req) => {
    return (req as AuthenticatedRequest).auth?.userId || req.ip || 'anonymous';
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many message requests. Rate limit of 20 messages per minute exceeded.',
  },
});

// Apply rate limiter specifically to message posting routes
app.use('/api/conversations/:id/messages', messageRateLimiter);
app.use('/api/messages', messageRateLimiter);

// ── 5. API Routes ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MyChat Backend API',
  });
});

app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);

// ── 6. Centralized Error Handling Middleware ────────────────────────────────
app.use(errorHandler);

export default app;
