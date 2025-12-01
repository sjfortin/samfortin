import { Home, Music4 } from 'lucide-react';
import CreatedPlaylists from './CreatedPlaylists';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

interface PlaylistSidebarProps {
  onSelectPlaylist?: (playlistId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export default function PlaylistSidebar({ onSelectPlaylist, onDeletePlaylist }: PlaylistSidebarProps) {
  return (
    <>
      <aside className="hidden md:flex w-64 flex-col h-full border-r border-border bg-muted/30">
        <div className="flex flex-col bg-background h-full">
          {/* Header */}
          <div className="p-4 flex items-center gap-2 font-semibold border-b border-border">
            <Music4 className="w-5 h-5" />
            <span>Your Playlists</span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <CreatedPlaylists onSelectPlaylist={onSelectPlaylist} onDeletePlaylist={onDeletePlaylist} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex flex-col justify-between gap-4">
            <div className="flex items-center">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </div>
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
              Back Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
