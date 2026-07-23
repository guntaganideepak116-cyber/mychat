import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiPost } from '@/lib/api';
import type { Conversation } from '@/types';

/**
 * TanStack Query mutation for creating a new conversation on the Express backend.
 * Only active when NEXT_PUBLIC_API_URL is set.
 */
export function useCreateConversation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, { title?: string }>({
    mutationFn: async (payload) => {
      const token = await getToken();
      return apiPost<Conversation>('/api/conversations', payload, token);
    },
    onSuccess: () => {
      // Invalidate the conversations list so it refetches
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
