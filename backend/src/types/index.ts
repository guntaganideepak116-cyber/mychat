import type { Request } from 'express';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateConversationResponse {
  id: string;
  title: string;
  createdAt: number;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthenticatedAuth {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  auth: AuthenticatedAuth;
}

export interface SSEChunk {
  token?: string;
  done?: boolean;
  error?: string;
}
