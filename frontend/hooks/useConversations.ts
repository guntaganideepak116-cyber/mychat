import { useCallback, useEffect, useState } from 'react';
import type { Conversation, Message } from '@/types';

export type { Conversation, Message };

const STORAGE_KEY = 'mychat:conversations:v1';

function load(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function save(convos: Conversation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Local-only conversation store. Isolated here so a real backend can replace
 * these functions without touching UI components.
 */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const c = load();
    setConversations(c);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(conversations);
  }, [conversations, hydrated]);

  const createConversation = useCallback((): Conversation => {
    const now = Date.now();
    const c: Conversation = {
      id: uid(),
      title: 'New intel thread',
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
    return c;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: trimmed, updatedAt: Date.now() } : c)),
    );
  }, []);

  const togglePinConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    );
  }, []);

  const appendMessage = useCallback((id: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextTitle =
          c.messages.length === 0 && message.role === 'user'
            ? message.content.slice(0, 48).trim() || c.title
            : c.title;
        return {
          ...c,
          title: nextTitle,
          messages: [...c.messages, message],
          updatedAt: Date.now(),
        };
      }),
    );
  }, []);

  const updateMessage = useCallback(
    (convId: string, msgId: string, updater: (m: Message) => Message) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== convId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) => (m.id === msgId ? updater(m) : m)),
                updatedAt: Date.now(),
              },
        ),
      );
    },
    [],
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    togglePinConversation,
    appendMessage,
    updateMessage,
    hydrated,
  };
}
