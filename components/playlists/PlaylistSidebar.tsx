'use client';

import { Music, Plus } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { usePlaylists } from './hooks/usePlaylistMutations';
import { SavedPlaylist } from './types';
import { Loader2 } from 'lucide-react';

export default function PlaylistSidebar() {
  const { data, isLoading } = usePlaylists();

  const playlists: SavedPlaylist[] = data?.playlists || [];

  return (
    <div className="flex flex-col md:h-full md:w-64 md:border-r border-gray-200 p-4">
      <div className="flex justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Music />
          <span>Playlists</span>
        </div>
        <Link href="/playlists" className="text-xs flex items-center gap-1">
          New
          <Plus className="w-3 h-3" />
        </Link>
      </div>
      <SignedIn>
        <div>
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-center text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : !playlists.length ? (
            <div className="py-4 text-sm text-muted-foreground">
              No playlists yet.
            </div>
          ) : (
            <div>
              <ul>
                {playlists.map((playlist: SavedPlaylist) => (
                  <li key={playlist.id} className="py-2">
                    <Link href={`/playlists/${playlist.id}`} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      </div>
                      <div className="flex flex-col gap-0.5 text-left min-w-0 text-sm">
                        <span className="font-medium truncate">{playlist.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
