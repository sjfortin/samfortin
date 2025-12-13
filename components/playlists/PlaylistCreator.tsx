'use client';

import { useState } from 'react';
import { useUser, SignInButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GenreSelector from './GenreSelector';
import EraSelector from './EraSelector';
import { cn } from '@/lib/utils';
import {
  useSavePlaylist,
  saveMessageToDb,
} from './hooks/usePlaylistMutations';
import { usePlaylistChat } from './hooks/usePlaylistChat';
import type { PlaylistResponse } from './types';

export default function PlaylistCreator() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hooks
  const savePlaylistMutation = useSavePlaylist();

  // Use custom playlist chat hook
  const { isGenerating, generatePlaylist } = usePlaylistChat({
    onPlaylistGenerated: async (playlistData, messageText) => {
      const userPrompt = input; // Capture before clearing

      // Immediately save the playlist to database
      savePlaylistMutation.mutate(
        {
          name: playlistData.name,
          description: playlistData.description,
          prompt: userPrompt,
          playlist_length: playlistLength,
          tracks: playlistData.tracks,
        },
        {
          onSuccess: async (data) => {
            if (data.playlist?.id) {
              // Save the initial user message
              await saveMessageToDb(data.playlist.id, 'user', userPrompt);

              // Save the assistant response with playlist
              await saveMessageToDb(
                data.playlist.id,
                'assistant',
                messageText,
                playlistData
              );

              // Navigate to the playlist detail page
              router.push(`/playlists/${data.playlist.id}`);
            }
          },
        }
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || isSubmitting || savePlaylistMutation.isPending) return;
    if (!isSignedIn) return;

    setIsSubmitting(true);

    // Generate playlist using custom hook
    generatePlaylist(input, {
      playlistLength,
      genres: selectedGenres,
      eras: selectedEras,
      currentPlaylist: null,
    });

    // Clear input after submitting
    setInput('');
  };

  return (
    <>
      <SignedOut>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full dark:text-white flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Create AI Playlists</h2>
            <p className="text-muted-foreground">
              Sign in to start generating personalized playlists with AI. Describe your mood, vibe, or theme, and let AI curate it.
            </p>
            <SignInButton mode="modal">
              <button className="px-6 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {/* Hero Section */}
        <div className="flex py-8 px-4 md:px-10">
          <div className="w-full">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Create Your Playlist</h1>
              <p className="text-muted-foreground">
                Add a mood, vibe, or theme for your playlist and let AI curate it.
              </p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border py-8">
          <div className="w-full px-4 md:px-10">
            <form onSubmit={handleSubmit}>
              {/* Genre and Era Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <GenreSelector
                  selectedGenres={selectedGenres}
                  onGenresChange={setSelectedGenres}
                  disabled={isGenerating || savePlaylistMutation.isPending}
                />
                <EraSelector
                  selectedEras={selectedEras}
                  onErasChange={setSelectedEras}
                  disabled={isGenerating || savePlaylistMutation.isPending}
                />
              </div>

              {/* Input Box */}
              <div className="relative border border-input bg-background shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring rounded-lg">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Describe the vibe, mood, or theme you're looking for..."
                  rows={4}
                  disabled={isGenerating || savePlaylistMutation.isPending}
                  className="block w-full border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm resize-none"
                />

                {/* Toolbar */}
                <div className="flex items-center justify-between px-2 py-2 border-t border-input bg-muted/30">
                  <div className="flex items-center gap-2">
                    <select
                      value={playlistLength}
                      onChange={(e) => setPlaylistLength(e.target.value)}
                      disabled={isGenerating || savePlaylistMutation.isPending}
                      className="block border-0 bg-transparent py-1.5 pl-3 pr-8 text-muted-foreground focus:ring-2 focus:ring-ring sm:text-xs cursor-pointer hover:text-foreground transition-colors"
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || isSubmitting || savePlaylistMutation.isPending || !input.trim()}
                    className={cn(
                      'inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all rounded-md',
                      (isGenerating || isSubmitting || savePlaylistMutation.isPending || !input.trim()) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating || isSubmitting || savePlaylistMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Generate Playlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </SignedIn>
    </>
  );
}
