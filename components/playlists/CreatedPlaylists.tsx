'use client';

import { ExternalLink, Music, Calendar, Disc, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import type { SavedPlaylist } from './types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface CreatedPlaylistsProps {
  onSelectPlaylist?: (playlistId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export default function CreatedPlaylists({ onSelectPlaylist, onDeletePlaylist }: CreatedPlaylistsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch('/api/playlists');
      if (!response.ok) throw new Error('Failed to fetch playlists');
      return response.json();
    },
  });

  const playlists: SavedPlaylist[] = data?.playlists || [];



  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No playlists yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm transition-colors group hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <button
            onClick={() => onSelectPlaylist?.(playlist.id)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center">
              <MessageSquare className="w-4 h-4 opacity-50" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{playlist.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {playlist.prompt || `${playlist.playlist_tracks?.length || 0} tracks`}
              </div>
            </div>
          </button>
          {onDeletePlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePlaylist(playlist.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
              title="Delete playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
