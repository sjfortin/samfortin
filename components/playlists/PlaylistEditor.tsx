'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Loader2, Sparkles, Send, LogIn, Music, ExternalLink, Trash2, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PlaylistResponse, SavedPlaylist } from './types';
import ChatMessageComponent from './ChatMessage';
import { cn } from '@/lib/utils';
import {
  useSavePlaylist,
  useDeletePlaylist,
  useCreateSpotifyPlaylist,
  useUpdatePlaylistTracks,
  saveMessageToDb,
  fetchPlaylistWithHistory,
} from './hooks/usePlaylistMutations';
import { usePlaylistChat } from './hooks/usePlaylistChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaylistCoverModal } from './PlaylistCoverModal';
import { Button } from '@/components/ui/button';
import { TracksSection } from './TracksSection';

interface PlaylistEditorProps {
  // For saved playlists (detail view)
  savedPlaylist?: SavedPlaylist;
  // For new playlists (creator mode)
  isNew?: boolean;
}

export default function PlaylistEditor({ savedPlaylist, isNew = false }: PlaylistEditorProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(savedPlaylist?.spotify_playlist_url || null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(savedPlaylist?.cover_image_url || null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserPromptRef = useRef('');

  // Use ref to track the prompt so it's available in the callback closure
  // Stable ID for the chat session
  const [chatSessionId] = useState(() => savedPlaylist?.id || `temp-${Date.now()}`);

  // Use custom hooks
  const savePlaylistMutation = useSavePlaylist();
  const deletePlaylistMutation = useDeletePlaylist();
  const createSpotifyPlaylistMutation = useCreateSpotifyPlaylist();
  const updatePlaylistTracksMutation = useUpdatePlaylistTracks();

  // Use custom playlist chat hook
  const { messages, isGenerating, generatePlaylist, setMessages } = usePlaylistChat({
    playlistId: chatSessionId,
    onPlaylistGenerated: async (playlistData, messageText) => {
      // Always update local state with the generated playlist
      setCurrentPlaylist(playlistData);
      setIsSubmitting(false);
      setInput(''); // Clear input after playlist is generated

      // Handle saving for new playlists (signed in users)
      if (isNew && isSignedIn && !savedPlaylist) {
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
                
                // Navigate to the saved playlist
                router.push(`/playlists/${data.playlist.id}`);
                router.refresh();
              }
            },
            onError: (error) => {
              console.error('Failed to save playlist:', error);
            }
          }
        );
      }

      // Handle updating existing playlists
      if (!isNew && savedPlaylist?.id && isSignedIn) {
        await saveMessageToDb(savedPlaylist.id, 'user', lastUserPromptRef.current);
        await saveMessageToDb(
          savedPlaylist.id,
          'assistant',
          messageText,
          playlistData
        );
        updatePlaylistTracksMutation.mutate({
          playlistId: savedPlaylist.id,
          name: playlistData.name,
          description: playlistData.description,
          tracks: playlistData.tracks,
        });
      }
    },
  });

  // Load playlist history for saved playlists
  useEffect(() => {
    if (!isNew && savedPlaylist?.id && isSignedIn) {
      const loadPlaylistAndHistory = async () => {
        try {
          setIsLoadingHistory(true);
          const { messages: messagesData } = await fetchPlaylistWithHistory(savedPlaylist.id);

          // Convert database messages to AI SDK UIMessage format
          const loadedMessages = messagesData.map((msg: any) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            parts: msg.playlist_snapshot
              ? [
                { type: 'text' as const, text: msg.content },
                {
                  type: 'tool-generatePlaylist' as const,
                  toolName: 'generatePlaylist',
                  result: msg.playlist_snapshot,
                  state: 'result' as const,
                  toolCallId: `loaded-${msg.id}`,
                  args: {},
                },
              ]
              : [{ type: 'text' as const, text: msg.content }],
          }));

          setMessages(loadedMessages);

          // Find the last playlist snapshot
          const lastPlaylistMsg = [...messagesData].reverse().find((m: any) => m.playlist_snapshot);
          if (lastPlaylistMsg?.playlist_snapshot) {
            setCurrentPlaylist(lastPlaylistMsg.playlist_snapshot);
          }
        } catch (error) {
          console.error('Failed to load playlist history:', error);
        } finally {
          setIsLoadingHistory(false);
        }
      };

      loadPlaylistAndHistory();
    } else if (!isNew) {
      setIsLoadingHistory(false);
    }
  }, [isNew, savedPlaylist?.id, isSignedIn, setMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || isSubmitting) return;
    if (isSignedIn && savePlaylistMutation.isPending) return;

    setIsSubmitting(true);
    lastUserPromptRef.current = input;

    // Generate playlist using custom hook
    generatePlaylist(input, {
      playlistLength,
      currentPlaylist: currentPlaylist,
    });
    setInput('');
  };

  const handleCreateSpotify = () => {
    if (!isSignedIn || !currentPlaylist || !savedPlaylist?.id) return;

    createSpotifyPlaylistMutation.mutate(
      {
        name: currentPlaylist.name,
        description: currentPlaylist.description,
        tracks: currentPlaylist.tracks,
        playlistId: savedPlaylist.id,
      },
      {
        onSuccess: async (data) => {
          if (data.playlistUrl) {
            setSpotifyUrl(data.playlistUrl);

            // Reload playlist data to get updated found_on_spotify flags
            try {
              const { playlist: updatedPlaylist } = await fetchPlaylistWithHistory(savedPlaylist.id);
              window.location.reload();
            } catch (error) {
              console.error('Failed to reload playlist data:', error);
            }
          }
        },
      }
    );
  };

  const handleDelete = () => {
    if (!savedPlaylist?.id) return;

    deletePlaylistMutation.mutate(savedPlaylist.id, {
      onSuccess: () => {
        router.push('/playlists');
        router.refresh();
      },
    });
  };

  const handleNewPlaylist = () => {
    if (isNew) {
      setCurrentPlaylist(null);
      setMessages([]);
      setInput('');
      lastUserPromptRef.current = '';
    } else {
      router.push('/playlists');
    }
  };

  const playlistName = currentPlaylist?.name || (isNew ? 'Create Your Playlist' : savedPlaylist?.name);
  const playlistDescription = currentPlaylist?.description || savedPlaylist?.description;
  const tracks = currentPlaylist?.tracks || savedPlaylist?.playlist_tracks || [];

  return (
    <>
      {/* Login Reminder Banner for unauthenticated users in creator mode */}
      {isNew && isLoaded && !isSignedIn && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-3">
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <LogIn className="w-4 h-4 text-primary" />
              <span className="text-foreground">
                <strong>Sign in</strong> to save your playlists and create them on Spotify
              </span>
            </div>
            <div className='hidden md:block'>
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden border-l">
        {/* Header with playlist info */}
        <div className="flex-none border-b border-border bg-background p-6 lg:px-8">
          {/* Cover Image and Actions for saved playlists */}
          {!isNew && savedPlaylist && (
            <>
              <div className="flex gap-4 mb-4">
                {/* Cover Image */}
                {coverImageUrl && (
                  <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden shadow-lg">
                    <img
                      src={coverImageUrl}
                      alt={`${savedPlaylist.name} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{savedPlaylist.name}</h1>
                    {savedPlaylist.description && (
                      <p className="text-sm text-muted-foreground">{savedPlaylist.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {spotifyUrl ? (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Spotify
                  </a>
                ) : (
                  <Button
                    onClick={handleCreateSpotify}
                    disabled={createSpotifyPlaylistMutation.isPending}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
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
                  </Button>
                )}

                {spotifyUrl && (
                  <Button onClick={() => setShowCoverModal(true)}>
                    <ImageIcon className="w-4 h-4" />
                    Generate Cover
                  </Button>
                )}

                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </>
          )}

          {/* Header for new playlists */}
          {isNew && (
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{playlistName}</h1>
                {playlistDescription ? (
                  <p className="text-sm text-muted-foreground">{playlistDescription}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Describe the vibe, mood, or theme you're looking for and AI will curate it.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons for new playlists */}
          {isNew && currentPlaylist && isLoaded && !isSignedIn && (
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <SignInButton mode="modal">
                <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <LogIn className="w-4 h-4" />
                  Sign in to Create on Spotify
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Chat Section */}
          <div className="flex flex-col w-full md:w-[50%] border-b md:border-b-0 md:border-r border-border h-2/3 md:h-full">
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full w-full">
                <div className="space-y-0 pb-4">
                  {!isNew && isLoadingHistory ? (
                    <div className="flex items-center justify-center h-full min-h-[200px] p-8">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading conversation...</span>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px] p-8">
                      <div className="text-center text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-medium">
                          {isNew ? 'Ready to create your playlist' : 'No conversation history yet.'}
                        </p>
                        <p className="text-xs mt-2">
                          {isNew ? 'Describe what you\'re looking for below' : 'Start chatting to modify this playlist!'}
                        </p>
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
                          <span>{currentPlaylist ? 'Updating your playlist...' : 'Creating your playlist...'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="flex-none border-t border-border p-4 bg-background">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Playlist length selector - only show for new playlists before first generation */}
                {isNew && !currentPlaylist && (
                  <div>
                    <label htmlFor="playlist-length" className="block text-xs font-medium mb-2 text-muted-foreground">
                      Playlist length
                    </label>
                    <select
                      id="playlist-length"
                      value={playlistLength}
                      onChange={(e) => setPlaylistLength(e.target.value)}
                      disabled={isGenerating || (isSignedIn && savePlaylistMutation.isPending)}
                      className="block w-full border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring focus:border-ring cursor-pointer"
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                    </select>
                  </div>
                )}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={currentPlaylist ? "Ask me to modify the playlist..." : "Describe the vibe, mood, or theme you're looking for..."}
                  rows={3}
                  disabled={isGenerating || (isSignedIn && savePlaylistMutation.isPending)}
                  className="block w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) || !input.trim()}
                    className={cn(
                      'flex-1 inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all',
                      (isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) || !input.trim()) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating || isSubmitting || (isSignedIn && savePlaylistMutation.isPending) ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {currentPlaylist ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {currentPlaylist ? 'Send' : 'Generate Playlist'}
                      </>
                    )}
                  </button>
                  
                  {/* New Playlist button */}
                  {currentPlaylist && (
                    <button
                      onClick={handleNewPlaylist}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border hover:bg-muted transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isNew ? 'New' : 'Back'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Tracks Section */}
          <TracksSection 
            tracks={tracks}
            showSpotifyStatus={!isNew && !!spotifyUrl}
            className={cn(
              !isNew && spotifyUrl ? "w-full h-full" : "w-full md:w-[50%] h-1/3 md:h-full"
            )}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {!isNew && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border max-w-md w-full p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Playlist?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete this playlist and all its chat history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletePlaylistMutation.isPending}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deletePlaylistMutation.isPending}
                variant="destructive"
              >
                {deletePlaylistMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Cover Modal */}
      {!isNew && savedPlaylist && (
        <PlaylistCoverModal
          isOpen={showCoverModal}
          onClose={() => setShowCoverModal(false)}
          playlistName={savedPlaylist.name}
          playlistDescription={savedPlaylist.description || ''}
          tracks={
            savedPlaylist.playlist_tracks?.map((t) => ({ name: t.name, artist: t.artist })) || []
          }
          spotifyPlaylistId={savedPlaylist.spotify_playlist_id}
          dbPlaylistId={savedPlaylist.id}
          onCoverUploaded={(url) => setCoverImageUrl(url)}
        />
      )}
    </>
  );
}
