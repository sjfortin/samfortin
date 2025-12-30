'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Sparkles, Send, Music, ExternalLink, Trash2, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PlaylistResponse, SavedPlaylist } from './types';
import ChatMessageComponent from './ChatMessage';
import { cn } from '@/lib/utils';
import {
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

interface PlaylistDetailViewProps {
  playlist: SavedPlaylist;
}

export default function PlaylistDetailView({ playlist }: PlaylistDetailViewProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(playlist.spotify_playlist_url);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(playlist.cover_image_url);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Local input state (AI SDK v5 doesn't provide input/setInput)
  const [input, setInput] = useState('');

  // Use custom hooks for non-chat operations
  const deletePlaylistMutation = useDeletePlaylist();
  const createSpotifyPlaylistMutation = useCreateSpotifyPlaylist();
  const updatePlaylistTracksMutation = useUpdatePlaylistTracks();

  // Use custom playlist chat hook
  const { messages, isGenerating, generatePlaylist, setMessages } = usePlaylistChat({
    playlistId: playlist.id,
    onPlaylistGenerated: async (playlistData, messageText) => {
      setCurrentPlaylist(playlistData);

      // Save to database
      if (playlist.id && isSignedIn) {
        await saveMessageToDb(playlist.id, 'assistant', messageText, playlistData);
        updatePlaylistTracksMutation.mutate({
          playlistId: playlist.id,
          name: playlistData.name,
          description: playlistData.description,
          tracks: playlistData.tracks,
        });
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load playlist and chat history on mount
  useEffect(() => {
    if (!playlist.id || !isSignedIn) return;

    const loadPlaylistAndHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const { messages: messagesData } = await fetchPlaylistWithHistory(playlist.id);

        // Convert database messages to AI SDK UIMessage format
        const loadedMessages = messagesData.map((msg: any) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          // Store playlist snapshot in parts for tool results
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
  }, [playlist.id, isSignedIn, setMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userInput = input;

    // Save user message to DB first
    if (playlist.id) {
      await saveMessageToDb(playlist.id, 'user', userInput);
    }

    // Generate playlist using custom hook
    generatePlaylist(userInput, {
      playlistLength: playlist.playlist_length || '1',
      currentPlaylist,
    });
    setInput('');
  };

  const handleCreateSpotify = () => {
    if (!isSignedIn) return;
    if (!currentPlaylist) return;

    createSpotifyPlaylistMutation.mutate(
      {
        name: currentPlaylist.name,
        description: currentPlaylist.description,
        tracks: currentPlaylist.tracks,
        playlistId: playlist.id,
      },
      {
        onSuccess: async (data) => {
          if (data.playlistUrl) {
            setSpotifyUrl(data.playlistUrl);

            // Reload playlist data to get updated found_on_spotify flags
            if (playlist.id) {
              try {
                const { playlist: updatedPlaylist } = await fetchPlaylistWithHistory(playlist.id);
                // Force a re-render by updating the playlist reference
                window.location.reload();
              } catch (error) {
                console.error('Failed to reload playlist data:', error);
              }
            }
          }
        },
      }
    );
  };

  const handleDelete = () => {
    if (!playlist.id) return;

    deletePlaylistMutation.mutate(playlist.id, {
      onSuccess: () => {
        router.push('/playlists');
        router.refresh();
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-hidden">
      <div className="flex-none border-b border-border bg-background p-4 md:p-6">
        <div className="flex gap-4">
          {/* Cover Image */}
          {coverImageUrl && (
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden shadow-lg">
              <img
                src={coverImageUrl}
                alt={`${playlist.name} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
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
            <Button
              onClick={() => setShowCoverModal(true)}
            >
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
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {!spotifyUrl ? (
          <div className="flex flex-col w-full md:w-[50%] border-b md:border-b-0 md:border-r border-border h-1/2 md:h-full">
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full w-full">
                <div className="space-y-0 pb-4">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center h-full min-h-[200px] p-8">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading conversation...</span>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
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
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

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
        ) : null}

        <div className={cn(
          "flex flex-col bg-muted/10 overflow-hidden",
          spotifyUrl ? "w-full h-full" : "w-full md:w-[50%] h-1/2 md:h-full"
        )}>
          <div className="flex-none p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-sm">
              Tracks ({spotifyUrl ? playlist.playlist_tracks?.length ?? 0 : currentPlaylist?.tracks?.length ?? playlist.playlist_tracks?.length ?? 0})
            </h2>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="p-4 space-y-2">
                {/* Show info message if Spotify playlist exists and some tracks weren't found */}
                {spotifyUrl && playlist.playlist_tracks && playlist.playlist_tracks.some(t => t.found_on_spotify === false) && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-sm">
                    <p className="text-destructive font-medium">Some tracks were not found on Spotify</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Tracks marked below could not be added to your Spotify playlist.
                    </p>
                  </div>
                )}

                {/* If Spotify playlist exists, always show playlist_tracks with found_on_spotify info */}
                {/* Otherwise, use currentPlaylist tracks if available (after modifications), or original playlist tracks */}
                {spotifyUrl && playlist.playlist_tracks && playlist.playlist_tracks.length > 0 ? (
                  playlist.playlist_tracks
                    .sort((a, b) => a.position - b.position)
                    .map((track, index) => (
                      <div
                        key={track.id}
                        className={cn(
                          "flex gap-3 text-sm p-3 border shadow-sm",
                          track.found_on_spotify === false
                            ? "border-destructive/30 bg-destructive/5"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="text-muted-foreground w-6 flex-shrink-0 font-mono text-xs flex items-center">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("font-medium truncate", track.found_on_spotify === false && "text-muted-foreground")}>
                            {track.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          {track.found_on_spotify === false && (
                            <div className="text-xs text-destructive mt-1">Not found on Spotify</div>
                          )}
                        </div>
                      </div>
                    ))
                ) : currentPlaylist?.tracks && currentPlaylist.tracks.length > 0 ? (
                  currentPlaylist.tracks.map((track, index) => (
                    <div key={`${track.name}-${track.artist}-${index}`} className="flex gap-3 text-sm p-3 border border-border bg-card shadow-sm">
                      <div className="text-muted-foreground w-6 flex-shrink-0 font-mono text-xs flex items-center">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{track.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                      </div>
                    </div>
                  ))
                ) : playlist.playlist_tracks && playlist.playlist_tracks.length > 0 ? (
                  playlist.playlist_tracks
                    .sort((a, b) => a.position - b.position)
                    .map((track, index) => (
                      <div
                        key={track.id}
                        className={cn(
                          "flex gap-3 text-sm p-3 border shadow-sm",
                          track.found_on_spotify === false
                            ? "border-destructive/30 bg-destructive/5"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="text-muted-foreground w-6 flex-shrink-0 font-mono text-xs flex items-center">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("font-medium truncate", track.found_on_spotify === false && "text-muted-foreground")}>
                            {track.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          {track.found_on_spotify === false && (
                            <div className="text-xs text-destructive mt-1">Not found on Spotify</div>
                          )}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
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
      <PlaylistCoverModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        playlistName={playlist.name}
        playlistDescription={playlist.description || ''}
        tracks={
          playlist.playlist_tracks?.map((t) => ({ name: t.name, artist: t.artist })) || []
        }
        spotifyPlaylistId={playlist.spotify_playlist_id}
        dbPlaylistId={playlist.id}
        onCoverUploaded={(url) => setCoverImageUrl(url)}
      />
    </div>
  );
}
