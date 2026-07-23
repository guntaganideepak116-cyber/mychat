'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useConversations } from '@/hooks/useConversations';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const {
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
  } = useConversations();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <div className="h-dvh w-full flex bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-72 shrink-0 h-full">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={() => {
            createConversation();
          }}
          onDelete={deleteConversation}
          onRename={renameConversation}
          onTogglePin={togglePinConversation}
          clerkEnabled={clerkEnabled}
        />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 transition-opacity duration-300',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[min(288px,85vw)] transition-transform duration-300 ease-out shadow-2xl',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              setSidebarOpen(false);
            }}
            onNew={() => {
              createConversation();
              setSidebarOpen(false);
            }}
            onDelete={deleteConversation}
            onRename={renameConversation}
            onTogglePin={togglePinConversation}
            onCloseMobile={() => setSidebarOpen(false)}
            clerkEnabled={clerkEnabled}
          />
        </div>
      </div>

      <ChatWindow
        conversation={active}
        onOpenSidebar={() => setSidebarOpen(true)}
        onCreate={createConversation}
        appendMessage={appendMessage}
        updateMessage={updateMessage}
      />
    </div>
  );
}
