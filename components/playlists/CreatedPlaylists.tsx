'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import type { SavedPlaylist } from './types';
import { useState, useEffect } from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { usePlaylists } from './hooks/usePlaylistMutations';

interface CreatedPlaylistsProps {
  onSelectPlaylist?: (playlistId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export default function CreatedPlaylists({ onSelectPlaylist, onDeletePlaylist }: CreatedPlaylistsProps) {
  const { data, isLoading } = usePlaylists();

  const playlists: SavedPlaylist[] = data?.playlists || [];

  if (isLoading) {
    return null
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No playlists yet.
      </div>
    );
  }

  return (
    <SidebarMenu>
      {playlists.map((playlist) => (
        <SidebarMenuItem key={playlist.id}>
          <SidebarMenuButton asChild size="lg">
            <button onClick={() => onSelectPlaylist?.(playlist.id)}>
              <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5 text-left min-w-0">
                <span className="font-medium truncate">{playlist.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {playlist.prompt || `${playlist.playlist_tracks?.length || 0} tracks`}
                </span>
              </div>
            </button>
          </SidebarMenuButton>
          {onDeletePlaylist && (
            <SidebarMenuAction
              showOnHover
              onClick={(e) => {
                e.stopPropagation();
                onDeletePlaylist(playlist.id);
              }}
              title="Delete playlist"
            >
              <Trash2 />
              <span className="sr-only">Delete playlist</span>
            </SidebarMenuAction>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
