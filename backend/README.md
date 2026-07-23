# MyChat Backend API

Production-grade Express + TypeScript backend for **MyChat** — personal AI assistant application. Built with Server-Sent Events (SSE) for real-time token streaming, Firestore for persistent encrypted thread storage, Clerk for token-based authentication, and OpenRouter for AI model access.

---

## Architecture Overview

```
               +-----------------------+
               |  Next.js Frontend     |
               | (Cloudflare Pages)    |
               +-----------+-----------+
                           |
            Authorization: Bearer <Clerk Token>
            Content-Type: application/json
                           |
                           v
               +-----------+-----------+
               |  Express Backend      |
               | (Node.js / Railway)   |
               +-----+-----+-----+-----+
                     |     |     |
       +-------------+     |     +-------------+
       |                   |                   |
       v                   v                   v
+--------------+    +--------------+    +--------------+
|  Clerk Auth  |    |  Firestore   |    | OpenRouter   |
| Verification |    | (Firebase)   |    | (Claude 3.5) |
+--------------+    +--------------+    +--------------+
```

---

## Key Features

- **Server-Sent Events (SSE) Streaming**: Real-time token-by-token response streaming (`text/event-stream`).
- **Clean Disconnection Abort**: Uses `AbortController` linked to client socket `req.on('close')` to stop OpenRouter streaming immediately if the user disconnects.
- **Firebase Firestore Integration**: Stores conversations and message subcollections with automatic title generation from the first prompt.
- **Clerk Express Authentication**: Token verification via `@clerk/express` middleware; every route checks ownership (`req.auth.userId`).
- **In-Memory Rate Limiting**: `express-rate-limit` enforcing max 20 message calls per minute per user.
- **Production Error Handling**: Centralized error handler preventing credential/stack leaks to clients.

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server with auto-reloading
npm run dev
```

The API server will run at `http://localhost:3001`.

```bash
# Build for production
npm run build

# Start production server
npm start
```
