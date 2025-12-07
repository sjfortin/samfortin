'use client';

import { User, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-4 p-4', isUser ? 'bg-muted/30' : 'bg-background')}>
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-white-600 dark:bg-white-600 dark:text-white'
          )}
        >
          {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="font-medium text-sm">{isUser ? 'You' : 'AI Assistant'}</div>
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
      </div>
    </div>
  );
}
