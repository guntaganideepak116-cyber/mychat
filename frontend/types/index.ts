/**
 * Shared domain types used across the app.
 * Extracted from hooks/useConversations.ts so they can be imported
 * without pulling in all the hook logic.
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  pinned?: boolean;
}
