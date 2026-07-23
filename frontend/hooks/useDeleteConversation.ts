import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiFetch } from '@/lib/api';

/**
 * TanStack Query mutation for deleting a conversation on the Express backend.
 * Only active when NEXT_PUBLIC_API_URL is set.
 */
export function useDeleteConversation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (conversationId: string) => {
      const token = await getToken();
      const res = await apiFetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        token,
      });
      if (!res.ok) throw new Error(`DELETE /api/conversations/${conversationId} failed: ${res.status}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
