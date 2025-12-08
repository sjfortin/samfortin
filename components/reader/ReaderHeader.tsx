'use client';

import Link from 'next/link';
import { BookOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/LogoMark';

interface ReaderHeaderProps {
  bookTitle: string;
  onToggleToc: () => void;
  onChangeBook: () => void;
}

export function ReaderHeader({ bookTitle, onToggleToc, onChangeBook }: ReaderHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 z-10">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex-shrink-0">
          <LogoMark className="rounded-full" width={32} height={32} />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleToc}
          className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-white" />
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {bookTitle || 'Visual Reader'}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onChangeBook}
        className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
      >
        Change Book
      </Button>
    </header>
  );
}
