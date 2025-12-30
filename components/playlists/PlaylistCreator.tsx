'use client';

import { useState, useRef } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Loader2, Sparkles, Send, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  useSavePlaylist,
  saveMessageToDb,
} from './hooks/usePlaylistMutations';
import { usePlaylistChat } from './hooks/usePlaylistChat';
import type { PlaylistResponse } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageComponent from './ChatMessage';

export default function PlaylistCreator() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistResponse | null>(null);
  // Use ref to track the prompt so it's available in the callback closure
  const lastUserPromptRef = useRef('');
  // Stable ID for the chat session (for unauthenticated users)
  const [chatSessionId] = useState(() => `temp-${Date.now()}`);

  // Use custom hooks
  const savePlaylistMutation = useSavePlaylist();

  // Use custom playlist chat hook with stable ID for message tracking
  const { messages, isGenerating, generatePlaylist, setMessages } = usePlaylistChat({
    playlistId: chatSessionId,
    onPlaylistGenerated: async (playlistData, messageText) => {
      // Always update local state with the generated playlist
      setCurrentPlaylist(playlistData);
      setIsSubmitting(false);

      // Only save to database if user is signed in
      if (isSignedIn) {
        savePlaylistMutation.mutate(
          {
            name: playlistData.name,
            description: playlistData.description,
            prompt: lastUserPromptRef.current,
            playlist_length: playlistLength,
            tracks: playlistData.tracks,
          },
          {
            onSuccess: async (data) => {
              if (data.playlist?.id) {
                // Save the initial user message
                await saveMessageToDb(data.playlist.id, 'user', lastUserPromptRef.current);

                // Save the assistant response with playlist
                await saveMessageToDb(
                  data.playlist.id,
                  'assistant',
                  messageText,
                  playlistData
                );

                // Navigate to the playlist detail page and refresh server components
                router.push(`/playlists/${data.playlist.id}`);
                router.refresh();
              }
            },
          }
        );
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || isSubmitting) return;
    // For signed in users, also check if save mutation is pending
    if (isSignedIn && savePlaylistMutation.isPending) return;

    setIsSubmitting(true);
    lastUserPromptRef.current = input;

    // Generate playlist using custom hook
    generatePlaylist(input, {
      playlistLength,
      currentPlaylist: currentPlaylist,
    });

    // Clear input after submitting
    setInput('');
  };

  const handleNewPlaylist = () => {
    setCurrentPlaylist(null);
    setMessages([]);
    setInput('');
    lastUserPromptRef.current = '';
  };

  // Determine if we should show the playlist preview (for unauthenticated users with a generated playlist)
  const showPlaylistPreview = !isSignedIn && (currentPlaylist || messages.length > 0);

  return (
    <>
      {/* Login Reminder Banner for unauthenticated users */}
      {!isSignedIn && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <LogIn className="w-4 h-4 text-primary" />
              <span className="text-foreground">
                <strong>Sign in</strong> to save your playlists and create them on Spotify
              </span>
            </div>
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {showPlaylistPreview ? (
        // Show playlist preview with chat for unauthenticated users
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
          {/* Header with playlist info */}
          <div className="flex-none border-b border-border bg-background p-4 md:p-6">
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{currentPlaylist?.name || 'Your Playlist'}</h1>
                {currentPlaylist?.description && (
                  <p className="text-sm text-muted-foreground">{currentPlaylist.description}</p>
                )}
              </div>
            </div>

            {/* Action buttons for unauthenticated users */}
            <div className="flex flex-wrap gap-2 mt-4">
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <LogIn className="w-4 h-4" />
                  Sign in to Save & Create on Spotify
                </button>
              </SignInButton>
              <button
                onClick={handleNewPlaylist}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border hover:bg-muted transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                New Playlist
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Chat Section */}
            <div className="flex flex-col w-full md:w-[50%] border-b md:border-b-0 md:border-r border-border h-1/2 md:h-full">
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-0 pb-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full min-h-[200px] p-8">
                        <div className="text-center text-muted-foreground">
                          <p className="text-sm">No conversation history yet.</p>
                          <p className="text-xs mt-2">Start chatting to modify this playlist!</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => {
                          // AI SDK v5 messages can have content as string or parts array
                          const textContent = typeof (message as any).content === 'string'
                            ? (message as any).content
                            : message.parts
                                ?.filter((p: any) => p.type === 'text')
                                .map((p: any) => p.text)
                                .join('') || '';
                          
                          const playlistData = message.parts?.find(
                            (p: any) => p.type?.startsWith('tool-') && p.state === 'output-available' && p.output
                          ) as { output?: PlaylistResponse } | undefined;

                          return (
                            <ChatMessageComponent
                              key={message.id}
                              message={{
                                id: message.id,
                                role: message.role as 'user' | 'assistant',
                                content: textContent,
                                timestamp: new Date(),
                                playlist: playlistData?.output,
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                    {isGenerating && (
                      <div className="flex gap-4 p-4 bg-background">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 text-white flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-2">AI Assistant</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating your playlist...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Input */}
              <div className="flex-none border-t border-border p-4 bg-background">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Ask me to modify the playlist..."
                    rows={3}
                    disabled={isGenerating}
                    className="block w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !input.trim()}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all',
                      (isGenerating || !input.trim()) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Tracks Section */}
            <div className="flex flex-col w-full md:w-[50%] bg-muted/10 overflow-hidden h-1/2 md:h-full">
              <div className="flex-none p-4 border-b border-border bg-muted/30">
                <h2 className="font-semibold text-sm">
                  Tracks ({currentPlaylist?.tracks?.length ?? 0})
                </h2>
              </div>
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full w-full">
                  <div className="p-4 space-y-2">
                    {currentPlaylist?.tracks && currentPlaylist.tracks.length > 0 ? (
                      currentPlaylist.tracks.map((track, index) => (
                        <div key={`${track.name}-${track.artist}-${index}`} className="flex gap-3 text-sm p-3 border border-border bg-card shadow-sm">
                          <div className="text-muted-foreground w-6 flex-shrink-0 font-mono text-xs flex items-center">{index + 1}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{track.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8 text-sm">
                        No tracks in this playlist yet.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show the initial creation form
        <>
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
            <div className="w-full px-4 md:px-10 max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Textarea */}
                <div>
                  <label htmlFor="playlist-prompt" className="block text-sm font-medium mb-2">
                    Describe your playlist
                  </label>
                  <textarea
                    id="playlist-prompt"
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
                    disabled={isGenerating || (isSignedIn && savePlaylistMutation.isPending)}
                    className="block w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm resize-none"
                  />
                </div>

                {/* Length Selector */}
                <div>
                  <label htmlFor="playlist-length" className="block text-sm font-medium mb-2">
                    Playlist length
                  </label>
                  <select
                    id="playlist-length"
                    value={playlistLength}
                    onChange={(e) => setPlaylistLength(e.target.value)}
                    disabled={isGenerating || (isSignedIn && savePlaylistMutation.isPending)}
                    className="block w-full border border-input bg-background px-4 py-2.5 text-foreground focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm cursor-pointer"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) || !input.trim()}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all',
                    (isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) || !input.trim()) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Playlist
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
