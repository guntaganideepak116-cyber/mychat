import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiGet } from '@/lib/api';
import type { Message } from '@/types';

/**
 * Fetches messages for a specific conversation from the Express backend.
 * Only fires when NEXT_PUBLIC_API_URL is set (skips in demo/local mode).
 */
export function useMessages(conversationId: string | null) {
  const { getToken } = useAuth();
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId && !!apiBase,
    queryFn: async () => {
      const token = await getToken();
      return apiGet<Message[]>(`/api/conversations/${conversationId}/messages`, token);
    },
  });
}
