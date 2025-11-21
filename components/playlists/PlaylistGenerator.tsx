'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PlaylistResponse, Track, SavedPlaylist } from './types';
import PlaylistForm from './PlaylistForm';
import GeneratedPlaylist from './GeneratedPlaylist';
import CreatedPlaylists from './CreatedPlaylists';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Home, Plus, Disc, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [notFoundTracks, setNotFoundTracks] = useState<Track[]>([]);
  const queryClient = useQueryClient();

  const { data: playlistsData, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch('/api/playlists');
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      return response.json() as Promise<{ playlists: SavedPlaylist[] }>;
    },
  });

  const generatePlaylistMutation = useMutation({
    mutationFn: async ({ prompt, playlistLength }: { prompt: string; playlistLength: string }) => {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, playlistLength }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }

      return response.json() as Promise<PlaylistResponse>;
    },
    onSuccess: () => {
      setNotFoundTracks([]);
    },
  });

  const createSpotifyPlaylistMutation = useMutation({
    mutationFn: async (playlist: PlaylistResponse) => {
      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
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
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlaylistMutation.mutate({ prompt, playlistLength });
  };

  const handleCreateSpotifyPlaylist = () => {
    if (generatePlaylistMutation.data) {
      createSpotifyPlaylistMutation.mutate(generatePlaylistMutation.data);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col hidden md:flex">
        <div className="p-4 h-14 flex items-center gap-2 font-semibold border-b border-border">
          <Music4 className="w-5 h-5" />
          <span>Your Library</span>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
            <div className="px-3 mb-2">
                 <button 
                    onClick={() => {
                        setPrompt('');
                        generatePlaylistMutation.reset();
                        setNotFoundTracks([]);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header (TODO: Add mobile sidebar toggle if needed) */}
        
        <div className="flex-1 overflow-auto p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {!generatePlaylistMutation.data && (
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Generate a Playlist</h1>
                        <p className="text-muted-foreground">Describe the vibe you want and AI will curate the tracks.</p>
                    </div>
                )}

                <div className={cn(
                    "transition-all duration-500 ease-in-out",
                    generatePlaylistMutation.data ? "opacity-100" : "opacity-100"
                )}>
                    <PlaylistForm
                        prompt={prompt}
                        setPrompt={setPrompt}
                        playlistLength={playlistLength}
                        setPlaylistLength={setPlaylistLength}
                        loading={generatePlaylistMutation.isPending}
                        onSubmit={handleGenerate}
                    />
                </div>

                {(generatePlaylistMutation.error || createSpotifyPlaylistMutation.error) && (
                    <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                        <p className="text-sm text-destructive font-medium">
                            {generatePlaylistMutation.error?.message || createSpotifyPlaylistMutation.error?.message}
                        </p>
                    </div>
                )}

                {generatePlaylistMutation.data && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GeneratedPlaylist
                            playlist={generatePlaylistMutation.data}
                            onCreateSpotify={handleCreateSpotifyPlaylist}
                            creatingPlaylist={createSpotifyPlaylistMutation.isPending}
                            playlistCreated={createSpotifyPlaylistMutation.isSuccess}
                            notFoundTracks={notFoundTracks}
                        />
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
