'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Plus, Music4 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import CreatedPlaylists from './CreatedPlaylists';
import { useQuery } from '@tanstack/react-query';
import { SavedPlaylist } from './types';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface PlaylistSidebarProps {
  onNewPlaylist?: () => void;
  className?: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function PlaylistSidebar({ 
  onNewPlaylist, 
  className,
  mobileOpen = false,
  setMobileOpen
}: PlaylistSidebarProps) {
  const router = useRouter();

  const { data: playlistsData, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch('/api/playlists');
      if (!response.ok) throw new Error('Failed to fetch playlists');
      return response.json() as Promise<{ playlists: SavedPlaylist[] }>;
    },
  });

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background">
        {/* Header */}
        <div className="p-4 h-14 flex items-center gap-2 font-semibold border-b border-border">
          <Music4 className="w-5 h-5" />
          <span>Your Playlists</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="px-3 mb-2">
                 <button 
                    onClick={() => {
                        if (onNewPlaylist) {
                            onNewPlaylist();
                        } else {
                            router.push('/playlists');
                        }
                        if (setMobileOpen) setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                 >
                    <Plus className="w-4 h-4" />
                    New Playlist
                 </button>
            </div>

            <CreatedPlaylists 
                playlists={playlistsData?.playlists || []} 
                isLoading={isLoadingPlaylists}
                mode="list"
                className="px-2"
            />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-4">
           <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
             <Home className="w-4 h-4" />
             Back to Sam
           </Link>
           <div className="flex items-center gap-2">
             <UserButton afterSignOutUrl="/" />
             <span className="text-sm font-medium">Account</span>
           </div>
        </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex w-64 flex-col h-full border-r border-border bg-muted/30", className)}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetTitle className="sr-only">Playlist Library</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate your playlists and create new ones
          </SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
