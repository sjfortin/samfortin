'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Sparkles, Send, Music, ExternalLink, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ChatMessage, PlaylistResponse, SavedPlaylist } from './types';
import ChatMessageComponent from './ChatMessage';
import { cn } from '@/lib/utils';
import {
  useGeneratePlaylist,
  useDeletePlaylist,
  useCreateSpotifyPlaylist,
  useUpdatePlaylistTracks,
  saveMessageToDb,
  fetchPlaylistWithHistory,
} from './hooks/usePlaylistMutations';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlaylistDetailViewProps {
  playlist: SavedPlaylist;
}

export default function PlaylistDetailView({ playlist }: PlaylistDetailViewProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistResponse | null>(null);
  const [playlistLength, setPlaylistLength] = useState(playlist.playlist_length || '1');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(playlist.spotify_playlist_url);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const generatePlaylistMutation = useGeneratePlaylist();
  const deletePlaylistMutation = useDeletePlaylist();
  const createSpotifyPlaylistMutation = useCreateSpotifyPlaylist();
  const updatePlaylistTracksMutation = useUpdatePlaylistTracks();

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
        const { playlist: playlistData, messages: messagesData } = await fetchPlaylistWithHistory(playlist.id);

        // Convert database messages to ChatMessage format
        const loadedMessages: ChatMessage[] = messagesData.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          playlist: msg.playlist_snapshot,
          timestamp: new Date(msg.created_at),
        }));

        // Set the state
        setMessages(loadedMessages);

        // Find the last playlist snapshot in the messages
        const lastPlaylistMessage = [...loadedMessages].reverse().find(m => m.playlist);
        if (lastPlaylistMessage?.playlist) {
          setCurrentPlaylist(lastPlaylistMessage.playlist);
        }
      } catch (error) {
        console.error('Failed to load playlist history:', error);
      }
    };

    loadPlaylistAndHistory();
  }, [playlist.id, isSignedIn]);

  // Handle successful playlist generation
  const handlePlaylistGenerated = async (playlistData: PlaylistResponse) => {
    const assistantMessage: ChatMessage = {
      id: Date.now().toString() + '-assistant',
      role: 'assistant',
      content: `I've updated your playlist! Here's "${playlistData.name}".`,
      playlist: playlistData,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setCurrentPlaylist(playlistData);

    // Save assistant message to DB and update tracks in database
    if (playlist.id && isSignedIn) {
      // Save the message with playlist snapshot
      await saveMessageToDb(playlist.id, 'assistant', assistantMessage.content, playlistData);

      // Update the tracks in the database
      updatePlaylistTracksMutation.mutate({
        playlistId: playlist.id,
        name: playlistData.name,
        description: playlistData.description,
        tracks: playlistData.tracks,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || generatePlaylistMutation.isPending) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save user message to DB
    if (playlist.id) {
      await saveMessageToDb(playlist.id, 'user', input);
    }

    setInput('');

    // Generate playlist modification
    generatePlaylistMutation.mutate(
      {
        prompt: input,
        playlistLength,
        genres: [],
        eras: [],
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        currentPlaylist,
        isModification: true,
      },
      {
        onSuccess: (data) => handlePlaylistGenerated(data),
      }
    );
  };

  const handleCreateSpotify = () => {
    if (!isSignedIn) return;
    if (!currentPlaylist) return;

    createSpotifyPlaylistMutation.mutate(
      {
        name: currentPlaylist.name,
        description: currentPlaylist.description,
        tracks: currentPlaylist.tracks,
      },
      {
        onSuccess: (data) => {
          if (data.playlistUrl) {
            setSpotifyUrl(data.playlistUrl);
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
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-hidden">
      <div className="flex-none border-b border-border bg-background p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {spotifyUrl ? (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors rounded-md"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Spotify
            </a>
          ) : (
            <button
              onClick={handleCreateSpotify}
              disabled={createSpotifyPlaylistMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 rounded-md"
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

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {!spotifyUrl ? (
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
                      {messages.map((message) => (
                        <ChatMessageComponent
                          key={message.id}
                          message={message}
                          onViewPlaylist={() => { }}
                        />
                      ))}
                    </>
                  )}
                  {generatePlaylistMutation.isPending && (
                    <div className="flex gap-4 p-4 bg-background">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full text-white flex items-center justify-center">
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
              <form onSubmit={handleSubmit}>
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
                    placeholder="Ask me to modify the playlist..."
                    rows={3}
                    disabled={generatePlaylistMutation.isPending}
                    className="block w-full border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm resize-none"
                  />

                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-2 py-2 border-t border-input bg-muted/30">
                    <div className="flex items-center gap-2">
                      <select
                        value={playlistLength}
                        onChange={(e) => setPlaylistLength(e.target.value)}
                        disabled={generatePlaylistMutation.isPending}
                        className="block border-0 bg-transparent py-1.5 pl-3 pr-8 text-muted-foreground focus:ring-2 focus:ring-ring sm:text-xs cursor-pointer hover:text-foreground transition-colors"
                      >
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="3">3 hours</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={generatePlaylistMutation.isPending || !input.trim()}
                      className={cn(
                        'inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all rounded-md',
                        (generatePlaylistMutation.isPending || !input.trim()) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {generatePlaylistMutation.isPending ? (
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
                  </div>
                </div>
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
              Tracks ({currentPlaylist?.tracks?.length ?? playlist.playlist_tracks?.length ?? 0})
            </h2>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="p-4 space-y-2">
                {/* Use currentPlaylist tracks if available (after modifications), otherwise use original playlist tracks */}
                {currentPlaylist?.tracks && currentPlaylist.tracks.length > 0 ? (
                  currentPlaylist.tracks.map((track, index) => (
                    <div key={`${track.name}-${track.artist}-${index}`} className="flex gap-3 text-sm p-3 border border-border bg-card rounded-md shadow-sm">
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
                          "flex gap-3 text-sm p-3 border rounded-md shadow-sm",
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
          <div className="bg-background border border-border max-w-md w-full p-6 space-y-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Delete Playlist?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete this playlist and all its chat history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletePlaylistMutation.isPending}
                className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePlaylistMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 rounded-md"
              >
                {deletePlaylistMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
