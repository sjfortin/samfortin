'use client';

import { User, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  onViewPlaylist?: (playlist: any) => void;
}

export default function ChatMessage({ message, onViewPlaylist }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-4 p-4', isUser ? 'bg-muted/30' : 'bg-background')}>
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-purple-600 text-white'
          )}
        >
          {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="font-medium text-sm">{isUser ? 'You' : 'AI Assistant'}</div>
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        {message.playlist && (
          <div className="mt-4 border border-border bg-card p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-base">{message.playlist.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{message.playlist.description}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {message.playlist.tracks.length} tracks
            </div>
            {onViewPlaylist && (
              <button
                onClick={() => onViewPlaylist(message.playlist)}
                className="text-xs text-primary hover:underline font-medium"
              >
                View full playlist →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
