import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Protected route group layout.
 * Clerk middleware already blocks unauthenticated requests, but we add a
 * server-side check here as an extra safety net for the route group.
 * When NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set, we allow through
 * (demo / local dev mode without Clerk).
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If Clerk is configured, enforce auth server-side
  if (clerkKey) {
    const { userId } = await auth();
    if (!userId) {
      redirect('/sign-in');
    }
  }

  return <>{children}</>;
}
