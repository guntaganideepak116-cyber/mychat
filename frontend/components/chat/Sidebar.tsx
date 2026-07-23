'use client';

import { useState } from 'react';
import { Plus, X, MoreHorizontal, Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { MyChatLogo } from '@/components/ui/MyChatLogo';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onCloseMobile?: () => void;
  clerkEnabled: boolean;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onTogglePin,
  onCloseMobile,
  clerkEnabled,
}: Props) {
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const pinned = conversations.filter((c) => c.pinned);
  const others = conversations.filter((c) => !c.pinned);

  function openRename(c: Conversation) {
    setRenameTarget(c);
    setRenameValue(c.title);
  }

  function commitRename() {
    if (renameTarget) {
      onRename(renameTarget.id, renameValue);
    }
    setRenameTarget(null);
  }

  function renderItem(c: Conversation) {
    const isActive = c.id === activeId;
    return (
      <li key={c.id}>
        <div
          className={cn(
            'group flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer transition-colors',
            isActive
              ? 'bg-primary/15 border border-primary/30 text-foreground'
              : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent',
          )}
          onClick={() => onSelect(c.id)}
        >
          {c.pinned ? (
            <Pin className="h-3 w-3 shrink-0 text-primary" />
          ) : (
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full shrink-0',
                isActive ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm">{c.title}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {new Date(c.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
              {' · '}
              {new Date(c.updatedAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-60 md:opacity-0 md:group-hover:opacity-100 data-[state=open]:opacity-100 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Thread options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-40 bg-surface border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onSelect={() => onTogglePin(c.id)}
                className="gap-2 cursor-pointer"
              >
                {c.pinned ? (
                  <>
                    <PinOff className="h-4 w-4" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => openRename(c)}
                className="gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onDelete(c.id)}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
    );
  }

  return (
    <aside className="flex h-full w-full flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <MyChatLogo size={22} />
          <span className="font-display text-sm tracking-widest uppercase text-foreground">
            MyChat
          </span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* New */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 justify-center rounded-md border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:glow-cyan px-3 py-2.5 text-sm font-medium text-primary transition-all"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {conversations.length === 0 && (
          <>
            <div className="px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Intel Threads
            </div>
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No threads yet. Start a new conversation.
            </div>
          </>
        )}

        {pinned.length > 0 && (
          <>
            <div className="px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Pinned
            </div>
            <ul className="space-y-0.5">{pinned.map(renderItem)}</ul>
          </>
        )}

        {others.length > 0 && (
          <>
            <div className="px-2 pt-3 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Intel Threads
            </div>
            <ul className="space-y-0.5">{others.map(renderItem)}</ul>
          </>
        )}
      </div>

      {/* User */}
      <div className="border-t border-border p-3 flex items-center gap-3">
        {clerkEnabled ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'h-8 w-8 ring-1 ring-primary/40',
              },
            }}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 grid place-items-center text-primary text-xs font-mono">
            OP
          </div>
        )}
        <div className="text-xs">
          <div className="text-foreground font-medium">Operator</div>
          <div className="text-muted-foreground text-[10px] uppercase tracking-wider">
            Status: Online
          </div>
        </div>
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="font-display tracking-widest uppercase text-sm">
              Rename thread
            </DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
            }}
            placeholder="Thread name"
            className="bg-background border-border"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={commitRename}
              className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
