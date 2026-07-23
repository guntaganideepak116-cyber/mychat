import { QueryClient } from '@tanstack/react-query';

/**
 * Factory function for creating a QueryClient instance.
 * Called once per browser session (via useState in QueryProvider).
 * Not a singleton so SSR doesn't share state between requests.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus (chat UX doesn't need it)
        refetchOnWindowFocus: false,
        // 5 minutes stale time
        staleTime: 5 * 60 * 1000,
        // Retry once on failure
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
