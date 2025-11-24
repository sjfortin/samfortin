'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SavedPlaylist, Track } from './types';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Home, ArrowLeft, ExternalLink, Trash2, Music, Calendar, Clock, AlertCircle, Loader2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import TracksNotFoundWarning from './TracksNotFoundWarning';
import PlaylistSidebar from './PlaylistSidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlaylistDetailProps {
  playlist: SavedPlaylist;
}

export default function PlaylistDetail({ playlist: initialPlaylist }: PlaylistDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [notFoundTracks, setNotFoundTracks] = useState<Track[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const createSpotifyPlaylistMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlist.name,
          description: playlist.description,
          tracks: playlist.playlist_tracks?.map(t => ({
            name: t.name,
            artist: t.artist,
            uri: t.spotify_uri,
          })) || [],
          playlistId: playlist.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Spotify playlist');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.tracksNotFound && data.tracksNotFound.length > 0) {
        setNotFoundTracks(data.tracksNotFound);
      }
      if (data.playlistUrl) {
        window.open(data.playlistUrl, '_blank');
      }
      // Update local playlist state
      setPlaylist(prev => ({
        ...prev,
        spotify_playlist_id: data.spotifyPlaylistId,
        spotify_playlist_url: data.playlistUrl,
      }));
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['playlist', playlist.id] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      router.push('/playlists');
    },
  });

  const handleDelete = () => {
    deletePlaylistMutation.mutate(playlist.id);
  };

  const handleCreateSpotify = () => {
    createSpotifyPlaylistMutation.mutate();
  };

  // Sort tracks by position
  const sortedTracks = playlist.playlist_tracks?.sort((a, b) => a.position - b.position) || [];
  const foundTracks = sortedTracks.filter(t => t.found_on_spotify);
  const notFoundInPlaylist = sortedTracks.filter(t => !t.found_on_spotify);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <PlaylistSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-border">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* <span className="ml-2 font-semibold">Details</span> */}
        </div>

        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold tracking-tight">{playlist.name}</h1>
                  {playlist.description && (
                    <p className="mt-2 text-muted-foreground">{playlist.description}</p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {!playlist.spotify_playlist_url && (
                    <button
                      onClick={handleCreateSpotify}
                      disabled={createSpotifyPlaylistMutation.isPending || sortedTracks.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createSpotifyPlaylistMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Music className="w-4 h-4" />
                          Create on Spotify
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 border border-border">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stats
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="block text-muted-foreground text-xs">Total Tracks</span>
                      <span className="font-medium text-lg">{sortedTracks.length}</span>
                    </div>
                    {playlist.spotify_playlist_url && <div>
                      <span className="block text-muted-foreground text-xs">On Spotify</span>
                      <span className="font-medium text-lg text-green-600 dark:text-green-500">{foundTracks.length}</span>
                    </div>}
                    {notFoundInPlaylist.length > 0 && (
                      <div>
                        <span className="block text-muted-foreground text-xs">Not Found</span>
                        <span className="font-medium text-lg text-amber-600 dark:text-amber-500">{notFoundInPlaylist.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {playlist.prompt && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Original Prompt
                    </div>
                    <p className="text-sm text-muted-foreground italic line-clamp-3 hover:line-clamp-none transition-all">
                      "{playlist.prompt}"
                    </p>
                  </div>
                )}
              </div>

              {/* Error Messages */}
              {createSpotifyPlaylistMutation.error && (
                <div className="bg-destructive/10 p-4 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    {createSpotifyPlaylistMutation.error.message}
                  </p>
                </div>
              )}

              {/* Success Message with Tracks Not Found Warning */}
              {createSpotifyPlaylistMutation.isSuccess && notFoundTracks.length > 0 && (
                <TracksNotFoundWarning tracks={notFoundTracks} />
              )}

              <div className="flex flex-col flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(playlist.created_at).toLocaleDateString()}</span>
                </div>
                {playlist.playlist_length && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Estimated Length: {playlist.playlist_length} hour{playlist.playlist_length !== '1' ? 's' : ''}</span>
                  </div>
                )}
                {playlist.spotify_playlist_url && (
                  <a
                    href={playlist.spotify_playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-green-600 dark:text-green-500 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Spotify
                  </a>
                )}
              </div>
            </div>

            {/* Tracks List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tracks</h2>

              {sortedTracks.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 border border-border">
                  <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tracks in this playlist</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border transition-colors",
                        track.found_on_spotify
                          ? "bg-card border-border hover:bg-accent/50"
                          : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
                      )}
                    >
                      <div className="flex-shrink-0 w-8 text-center text-sm text-muted-foreground font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{track.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                      </div>
                      {!track.found_on_spotify && (
                        <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
                          <AlertCircle className="w-4 h-4" />
                          <span>Not found</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deletePlaylistMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Playlist
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{playlist.name}" from your library
              {playlist.spotify_playlist_url && " and unfollow it on Spotify"}.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deletePlaylistMutation.isPending}
              className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deletePlaylistMutation.isPending}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              {deletePlaylistMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
