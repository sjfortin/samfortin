'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HighlightMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onGenerate: () => void;
  onClose: () => void;
  isGenerating: boolean;
}

export function HighlightMenu({
  isVisible,
  position,
  selectedText,
  onGenerate,
  onClose,
  isGenerating,
}: HighlightMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isVisible || !selectedText || !mounted) return null;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent the click from propagating to the iframe/reader
    e.stopPropagation();
    e.preventDefault();
  };

  const menu = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
        }}
        onClick={handleClick}
        onMouseDown={handleClick}
      >
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl border border-zinc-700/50 p-1 flex items-center gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onGenerate();
            }}
            disabled={isGenerating}
            size="sm"
            className="rounded-none gap-2 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-600 hover:to-cyan-600 text-white border-0 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Visualize'}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            size="icon-sm"
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Arrow pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-zinc-800" />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
}
