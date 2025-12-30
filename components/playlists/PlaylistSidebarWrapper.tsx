'use client';

import { useState } from 'react';
import { Music, PanelLeftClose, PanelLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface PlaylistSidebarWrapperProps {
  children: React.ReactNode;
}

export default function PlaylistSidebarWrapper({ children }: PlaylistSidebarWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile: Top bar with sheet trigger */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-30">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full border-b border-border bg-background">
              <Music className="h-4 w-4" />
              <span>My Playlists</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-4 py-3">
              <SheetTitle>Your Playlists</SheetTitle>
            </SheetHeader>
            <div onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Collapsible sidebar */}
      <div className="hidden md:flex relative">
        <div
          className={cn(
            'flex flex-col h-full border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden',
            isCollapsed ? 'w-0' : 'w-64'
          )}
        >
          <div className="w-64">
            {children}
          </div>
        </div>
        
        {/* Collapse/Expand toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-l-none bg-background hover:bg-muted flex-shrink-0"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
        </Button>
      </div>
    </>
  );
}
