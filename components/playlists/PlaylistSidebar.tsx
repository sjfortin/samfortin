'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Plus, Music4, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import CreatedPlaylists from './CreatedPlaylists';
import { useQuery } from '@tanstack/react-query';
import { SavedPlaylist } from './types';
import { cn } from '@/lib/utils';
import { Dialog, DialogPanel } from '@headlessui/react';

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
    <div className="flex h-full flex-col bg-background border-r border-border">
        {/* Header */}
        <div className="p-4 h-14 flex items-center gap-2 font-semibold border-b border-border">
          <Music4 className="w-5 h-5" />
          <span>Your Library</span>
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
      <aside className={cn("hidden md:flex w-64 flex-col h-full", className)}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
       <Dialog as="div" className="relative z-50 md:hidden" open={mobileOpen} onClose={() => setMobileOpen?.(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        
        <div className="fixed inset-0 flex z-50">
            <DialogPanel 
                className={cn(
                    "relative mr-16 flex w-full max-w-[300px] flex-1 transform flex-col transition duration-300 ease-in-out bg-background h-full shadow-xl",
                    "data-[closed]:-translate-x-full"
                )}
            >
                <div className="absolute top-3 right-3 z-50">
                    <button 
                        type="button"
                        className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                        onClick={() => setMobileOpen?.(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent />
            </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
