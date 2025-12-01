'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Sparkles, Send, Music, Save, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { ChatMessage, PlaylistResponse } from './types';
import ChatMessageComponent from './ChatMessage';
import GenreSelector from './GenreSelector';
import EraSelector from './EraSelector';
import PlaylistSidebar from './PlaylistSidebar';
import { cn } from '@/lib/utils';

interface PlaylistChatInterfaceProps {
  initialPlaylistId?: string;
}

export default function PlaylistChatInterface({ initialPlaylistId }: PlaylistChatInterfaceProps = {}) {
  const { isSignedIn } = useUser();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(initialPlaylistId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistResponse | null>(null);
  const [playlistLength, setPlaylistLength] = useState('1');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [showPlaylistView, setShowPlaylistView] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedPlaylistId, setSavedPlaylistId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to save a message to the database
  const saveMessageToDb = async (playlistId: string, role: 'user' | 'assistant', content: string, playlistSnapshot?: any) => {
    if (!isSignedIn) return; // Only save if user is signed in

    try {
      await fetch('/api/playlist-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId,
          role,
          content,
          playlistSnapshot,
        }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
      // Don't throw - we don't want to break the UI if message saving fails
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load playlist and chat history when selectedPlaylistId changes
  useEffect(() => {
    if (!selectedPlaylistId || !isSignedIn) return;

    const loadPlaylistAndHistory = async () => {
      try {
        // Fetch the playlist details
        const playlistResponse = await fetch(`/api/playlists/${selectedPlaylistId}`);
        if (!playlistResponse.ok) return;
        
        const { playlist } = await playlistResponse.json();
        
        // Fetch the chat history
        const messagesResponse = await fetch(`/api/playlist-messages?playlistId=${selectedPlaylistId}`);
        if (!messagesResponse.ok) return;
        
        const messagesData = await messagesResponse.json();
        
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
        setSavedPlaylistId(selectedPlaylistId);
        
        // Find the last playlist snapshot in the messages
        const lastPlaylistMessage = [...loadedMessages].reverse().find(m => m.playlist);
        if (lastPlaylistMessage?.playlist) {
          setCurrentPlaylist(lastPlaylistMessage.playlist);
          setShowPlaylistView(true);
        }
      } catch (error) {
        console.error('Failed to load playlist history:', error);
      }
    };

    loadPlaylistAndHistory();
  }, [selectedPlaylistId, isSignedIn]);

  const generatePlaylistMutation = useMutation({
    mutationFn: async ({ prompt, isModification }: { prompt: string; isModification: boolean }) => {
      const response = await fetch('/api/playlist-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          playlistLength,
          genres: selectedGenres,
          eras: selectedEras,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          currentPlaylist: isModification ? currentPlaylist : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }

      return response.json() as Promise<PlaylistResponse>;
    },
    onSuccess: async (playlistData, variables) => {
      // Add assistant message with playlist
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: variables.isModification
          ? `I've updated your playlist! Here's "${playlistData.name}".`
          : `I've created a playlist for you! Here's "${playlistData.name}".`,
        playlist: playlistData,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentPlaylist(playlistData);
      setShowPlaylistView(true);
      
      // Save assistant message to DB if playlist is already saved
      if (savedPlaylistId) {
        await saveMessageToDb(savedPlaylistId, 'assistant', assistantMessage.content, playlistData);
      }
    },
  });

  const savePlaylistMutation = useMutation({
    mutationFn: async () => {
      if (!currentPlaylist) throw new Error('No playlist to save');

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentPlaylist.name,
          description: currentPlaylist.description,
          prompt: messages.find(m => m.role === 'user')?.content || '',
          playlist_length: playlistLength,
          tracks: currentPlaylist.tracks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save playlist');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setShowSavePrompt(false);
      
      // Save the playlist ID and save all messages to database
      if (data.playlist?.id) {
        setSavedPlaylistId(data.playlist.id);
        
        // Save all messages in the conversation
        for (const message of messages) {
          await saveMessageToDb(
            data.playlist.id,
            message.role,
            message.content,
            message.playlist
          );
        }
      }
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
      // Reset to new chat state
      handleNewChat();
      setShowDeleteConfirm(false);
    },
  });

  const createSpotifyPlaylistMutation = useMutation({
    mutationFn: async () => {
      if (!currentPlaylist) throw new Error('No playlist to create');

      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentPlaylist.name,
          description: currentPlaylist.description,
          tracks: currentPlaylist.tracks,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Spotify playlist');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.playlistUrl) {
        setSpotifyUrl(data.playlistUrl);
      }
    },
  });

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
    
    // Save user message to DB if playlist is already saved
    if (savedPlaylistId) {
      await saveMessageToDb(savedPlaylistId, 'user', input);
    }
    
    setInput('');

    // Generate playlist
    const isModification = currentPlaylist !== null;
    generatePlaylistMutation.mutate({ prompt: input, isModification });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentPlaylist(null);
    setShowPlaylistView(false);
    setSpotifyUrl(null);
    setSelectedGenres([]);
    setSelectedEras([]);
    setSavedPlaylistId(null);
    setSelectedPlaylistId(null);
  };

  const handleSelectPlaylist = (playlistId: string) => {
    // Reset state and load the selected playlist
    setSelectedPlaylistId(playlistId);
    setShowPlaylistView(false);
    setSpotifyUrl(null);
  };

  const handleDeleteFromSidebar = (playlistId: string) => {
    // If deleting the currently open playlist, close it first
    if (playlistId === savedPlaylistId) {
      handleNewChat();
    }
    // Show confirmation and delete
    setSavedPlaylistId(playlistId);
    setShowDeleteConfirm(true);
  };

  const handleSavePlaylist = () => {
    if (!isSignedIn) {
      setShowSavePrompt(true);
      return;
    }
    savePlaylistMutation.mutate();
  };

  const handleCreateSpotify = () => {
    if (!isSignedIn) {
      setShowSavePrompt(true);
      return;
    }
    createSpotifyPlaylistMutation.mutate();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      {isSignedIn && <PlaylistSidebar onSelectPlaylist={handleSelectPlaylist} onDeletePlaylist={handleDeleteFromSidebar} />}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header with New Chat button */}
        {messages.length > 0 && (
          <div className="border-b border-border p-3 flex items-center justify-between bg-background">
            <div className="text-sm text-muted-foreground">
              {savedPlaylistId ? 'Continuing conversation' : 'New conversation'}
            </div>
            <button
              onClick={handleNewChat}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        )}


        {/* Messages Area */}
        <div className="flex-1 overflow-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Generate Your Perfect Playlist</h1>
                  <p className="text-muted-foreground text-lg">
                    Describe the vibe, mood, or theme you're looking for and I'll curate the perfect tracks.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 border border-border bg-card">
                    <p className="text-sm font-medium mb-1">Try asking:</p>
                    <p className="text-sm text-muted-foreground">"Create a chill indie playlist for studying"</p>
                  </div>
                  <div className="p-4 border border-border bg-card">
                    <p className="text-sm font-medium mb-1">Or be specific:</p>
                    <p className="text-sm text-muted-foreground">"90s hip hop with a focus on East Coast artists"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map((message) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  onViewPlaylist={() => setShowPlaylistView(true)}
                />
              ))}
              {generatePlaylistMutation.isPending && (
                <div className="flex gap-4 p-4 bg-background">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-2">AI Assistant</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Curating your playlist...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Playlist View Sidebar */}
        {showPlaylistView && currentPlaylist && (
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-background border-l border-border overflow-auto shadow-lg z-10">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold">Current Playlist</h2>
              <button
                onClick={() => setShowPlaylistView(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{currentPlaylist.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentPlaylist.description}</p>
              </div>

              <div className="flex flex-col gap-2">
                {!isSignedIn && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 border border-border">
                    Sign in to save this playlist or create it on Spotify
                  </div>
                )}

                {spotifyUrl ? (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Spotify
                  </a>
                ) : (
                  <button
                    onClick={handleCreateSpotify}
                    disabled={createSpotifyPlaylistMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
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

                {isSignedIn && !savePlaylistMutation.isSuccess && (
                  <button
                    onClick={handleSavePlaylist}
                    disabled={savePlaylistMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {savePlaylistMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save to Library
                      </>
                    )}
                  </button>
                )}

                {savePlaylistMutation.isSuccess && (
                  <div className="text-sm text-green-600 dark:text-green-500 font-medium text-center py-2">
                    ✓ Saved to your library
                  </div>
                )}

                {/* Delete button - only show if playlist is saved */}
                {savedPlaylistId && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Playlist
                  </button>
                )}
              </div>

              {createSpotifyPlaylistMutation.error && (
                <div className="text-xs text-destructive bg-destructive/10 p-3 border border-destructive/20">
                  {createSpotifyPlaylistMutation.error.message}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Tracks ({currentPlaylist.tracks.length})</h4>
                <div className="space-y-2">
                  {currentPlaylist.tracks.map((track, index) => (
                    <div key={index} className="flex gap-3 text-sm p-2 border border-border bg-card">
                      <div className="text-muted-foreground w-6 flex-shrink-0">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{track.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
            {/* Genre and Era Selectors */}
            {messages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GenreSelector
                  selectedGenres={selectedGenres}
                  onGenresChange={setSelectedGenres}
                  disabled={generatePlaylistMutation.isPending}
                />
                <EraSelector
                  selectedEras={selectedEras}
                  onErasChange={setSelectedEras}
                  disabled={generatePlaylistMutation.isPending}
                />
              </div>
            )}

            {/* Input Box */}
            <div className="relative border border-input bg-background shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  currentPlaylist
                    ? "Ask me to modify the playlist..."
                    : "Describe the vibe, mood, or theme you're looking for..."
                }
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
                    'inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all',
                    (generatePlaylistMutation.isPending || !input.trim()) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {generatePlaylistMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {currentPlaylist ? 'Send' : 'Generate'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Sign In Prompt Dialog */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold">Sign in to continue</h3>
            <p className="text-sm text-muted-foreground">
              You need to sign in to save playlists or create them on Spotify.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSavePrompt(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold">Delete Playlist?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete this playlist and all its chat history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletePlaylistMutation.isPending}
                className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => savedPlaylistId && deletePlaylistMutation.mutate(savedPlaylistId)}
                disabled={deletePlaylistMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
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
