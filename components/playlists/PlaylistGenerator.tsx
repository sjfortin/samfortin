'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlaylistResponse } from './types';
import PlaylistForm from './PlaylistForm';
import PlaylistSidebar from './PlaylistSidebar';
import { Menu } from 'lucide-react';

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const generatePlaylistMutation = useMutation({
    mutationFn: async ({ prompt, playlistLength }: { prompt: string; playlistLength: string }) => {
      // Step 1: Generate the playlist
      const generateResponse = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, playlistLength }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate playlist');
      }

      const playlistData = await generateResponse.json() as PlaylistResponse;

      // Step 2: Save the playlist to the database
      const saveResponse = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistData.name,
          description: playlistData.description,
          prompt: prompt,
          playlist_length: playlistLength,
          tracks: playlistData.tracks,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save playlist');
      }

      const { playlist } = await saveResponse.json();
      return playlist;
    },
    onSuccess: (playlist) => {
      // Invalidate playlists query to refresh the sidebar
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      // Navigate to the playlist detail page
      router.push(`/playlists/${playlist.id}`);
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlaylistMutation.mutate({ prompt, playlistLength });
  };

  const handleNewPlaylist = () => {
    setPrompt('');
    generatePlaylistMutation.reset();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <PlaylistSidebar 
        onNewPlaylist={handleNewPlaylist} 
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-border">
            <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md"
            >
                <Menu className="w-6 h-6" />
            </button>
            <span className="ml-2 font-semibold">Playlists</span>
        </div>
        
        <div className="flex-1 overflow-auto p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Generate a Playlist</h1>
                    <p className="text-muted-foreground">Describe the vibe you want and AI will curate the tracks.</p>
                </div>

                <PlaylistForm
                    prompt={prompt}
                    setPrompt={setPrompt}
                    playlistLength={playlistLength}
                    setPlaylistLength={setPlaylistLength}
                    loading={generatePlaylistMutation.isPending}
                    onSubmit={handleGenerate}
                />

                {generatePlaylistMutation.error && (
                    <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                        <p className="text-sm text-destructive font-medium">
                            {generatePlaylistMutation.error?.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
