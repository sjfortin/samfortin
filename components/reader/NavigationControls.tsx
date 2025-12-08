'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationControls({ onPrev, onNext }: NavigationControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm rounded-full px-2 py-1 border border-zinc-800">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onPrev}
        className="text-zinc-400 hover:text-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <span className="text-xs text-zinc-500 px-2">Navigate</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onNext}
        className="text-zinc-400 hover:text-white"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
