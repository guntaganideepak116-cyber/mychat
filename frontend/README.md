# MyChat — Personal AI Assistant (Frontend)

MyChat is a personal AI assistant application offering real-time streamed responses. Built as a high-performance Next.js 14+ App Router application with Clerk authentication and TanStack Query state management.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Authentication**: Clerk (@clerk/nextjs)
- **Server State**: TanStack Query (@tanstack/react-query)
- **Icons**: Lucide React
- **Markdown & Syntax Highlighting**: react-markdown & react-syntax-highlighter
- **PWA**: Web App Manifest & Service Worker

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Set your environment variables in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

*(Note: If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is omitted, the app will run in local demo mode without an auth wall. If `NEXT_PUBLIC_API_URL` is omitted, responses stream from a local AI mock generator).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```
