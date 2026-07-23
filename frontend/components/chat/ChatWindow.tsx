'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { MyChatLogo } from '@/components/ui/MyChatLogo';
import { RadarLoader } from './RadarLoader';
import { useSendMessage } from '@/hooks/useSendMessage';
import { uid } from '@/hooks/useConversations';
import type { Conversation, Message } from '@/types';

interface Props {
  conversation: Conversation | null;
  onOpenSidebar: () => void;
  onCreate: () => Conversation;
  appendMessage: (id: string, m: Message) => void;
  updateMessage: (convId: string, msgId: string, updater: (m: Message) => Message) => void;
}

export function ChatWindow({
  conversation,
  onOpenSidebar,
  onCreate,
  appendMessage,
  updateMessage,
}: Props) {
  const [input, setInput] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sendMessage, stop, streaming, thinking } = useSendMessage();

  useEffect(() => {
    const savedTheme = localStorage.getItem('mychat_theme');
    const isLight = savedTheme === 'light' || document.documentElement.classList.contains('light');
    setIsLightMode(isLight);
    if (isLight) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextLight = !isLightMode;
    setIsLightMode(nextLight);
    if (nextLight) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mychat_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('mychat_theme', 'dark');
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversation?.messages.length, streaming]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    let conv = conversation;
    if (!conv) conv = onCreate();
    const convId = conv.id;

    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };
    appendMessage(convId, userMsg);
    setInput('');

    const assistantId = uid();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };

    const allMessages = [...(conv.messages ?? []), userMsg];

    await sendMessage(allMessages, convId, {
      conversationId: convId,
      onStart: () => {
        appendMessage(convId, assistantMsg);
      },
      onToken: (chunk) => {
        updateMessage(convId, assistantId, (m) => ({ ...m, content: m.content + chunk }));
      },
      onDone: () => {
        // streaming state is managed inside the hook
      },
      onError: (err) => {
        console.error('[ChatWindow] stream error:', err);
        updateMessage(convId, assistantId, (m) => ({
          ...m,
          content: m.content || '⚠ Connection error. Please try again.',
        }));
      },
    });
  }

  const messages = conversation?.messages ?? [];
  const showEmpty = !conversation || messages.length === 0;

  return (
    <section className="flex flex-1 flex-col min-w-0 h-full bg-background transition-colors duration-200 overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-6 border-b border-border bg-background/70 backdrop-blur shrink-0">
        {/* Mobile sidebar toggle — 44px tap target */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title — truncates cleanly */}
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {conversation?.title ?? 'New Conversation'}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">
            AI Assistant · Live
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle — 44px tap target */}
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle theme"
            title="Toggle Light / Dark Mode"
          >
            {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Model status badge — desktop only */}
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              MyChat AI
            </span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        {showEmpty ? (
          /* Empty state */
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative">
              <span className="absolute inset-0 rounded-full border border-brand-blue/40 animate-pulse-ring" />
              <MyChatLogo size={72} animated />
            </div>
            <h2 className="mt-8 font-bold text-2xl sm:text-3xl text-foreground">
              What can I help you with?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs sm:max-w-sm">
              Ask me anything — I&apos;ll stream you an answer instantly.
            </p>
          </div>
        ) : (
          /* Message list */
          <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 space-y-4">
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                message={m}
                streaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
              />
            ))}
            {thinking && (
              <div className="flex items-center gap-3 pl-11 text-muted-foreground">
                <RadarLoader size={20} />
                <span className="text-xs uppercase tracking-widest">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => handleSend()}
        onStop={stop}
        streaming={streaming || thinking}
      />
    </section>
  );
}
