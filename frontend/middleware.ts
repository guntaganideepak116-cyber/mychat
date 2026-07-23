import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Minimal Clerk middleware.
 *
 * Purpose: sets up Clerk's auth context so that `auth()` works inside
 * Server Components (e.g. the (protected)/layout.tsx).
 *
 * We intentionally do NOT protect any routes here — route protection is
 * handled server-side in (protected)/layout.tsx with a redirect to /sign-in.
 * This avoids the middleware → landing page redirect loop that occurred
 * when middleware ran before Clerk had finished loading on the client.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
