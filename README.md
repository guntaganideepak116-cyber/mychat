# MyChat — Personal AI Assistant

MyChat is your personal AI assistant application. The project is organized as a clean monorepo with two independent top-level subdirectories: `/frontend` and `/backend`.

---

## Repository Structure

```
/mychat
├── /frontend              -> Next.js 14+ App Router Client (Deployed on Cloudflare Pages)
│   ├── /app               -> Pages, Layouts, and App Router structure
│   ├── /components        -> Chat UI & shadcn primitives
│   ├── /hooks             -> TanStack Query & SSE streaming hooks
│   ├── /lib               -> API wrapper & utilities
│   ├── /providers         -> Client QueryClientProvider
│   ├── /public            -> Favicon, webmanifest, PWA icons, SW stub
│   ├── /types             -> TypeScript interfaces (Message, Conversation)
│   ├── middleware.ts      -> Clerk edge auth middleware
│   ├── next.config.js     -> Next.js configuration
│   ├── tailwind.config.ts -> Tactical theme & OKLCH color config
│   ├── package.json       -> Frontend dependencies
│   ├── .env.local.example -> Frontend environment variable template
│   └── README.md          -> Detailed frontend documentation
│
├── /backend               -> Express + TypeScript API (Deployed on Railway)
│   ├── /src
│   │   ├── /config        -> Firebase Admin & OpenRouter clients
│   │   ├── /controllers   -> Conversations & SSE message controllers
│   │   ├── /middleware    -> Clerk auth middleware & error handler
│   │   ├── /routes        -> Express router endpoints
│   │   ├── /services      -> Firestore DB & OpenRouter stream services
│   │   ├── /types         -> TypeScript interfaces (Message, Conversation)
│   │   ├── app.ts         -> Express application setup (CORS, Rate Limiting)
│   │   └── server.ts      -> Entrypoint & graceful shutdown
│   ├── package.json       -> Backend dependencies
│   ├── .env.example       -> Backend environment variable template
│   └── README.md          -> Detailed backend documentation
│
├── .gitignore             -> Root gitignore covering both projects
├── package.json           -> Root script runner (concurrently)
└── README.md              -> Project monorepo documentation
```

> **Note on Types**: To maintain decoupled independence between deployment targets, domain types (`Message`, `Conversation`) are maintained in both `/frontend/types/index.ts` and `/backend/src/types/index.ts`. Keep these in sync if shared fields change.

---

## Quick Start (Local Development)

### Option 1: Run Both Concurrently (Recommended)

1. **Install Root & Subdirectory Dependencies**:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

2. **Configure Environment Variables**:
   - Copy `frontend/.env.local.example` to `frontend/.env.local`
   - Copy `backend/.env.example` to `backend/.env`

3. **Start Both Dev Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001

---

### Option 2: Run Separately in Two Terminals

**Terminal 1 (Backend)**:
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment Configuration

Both projects deploy independently from their respective subfolders:

- **Frontend**: Deployed on **Cloudflare Pages** (or Vercel)
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `.next` (or build export)

- **Backend**: Deployed on **Railway**
  - **Root Directory**: `backend`
  - **Build Command**: `npm run build`
  - **Start Command**: `npm start`
