'use client';

import { Loader2, Music, Save, ExternalLink, Trash2 } from 'lucide-react';
import type { PlaylistResponse } from './types';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface PlaylistViewSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlist: PlaylistResponse | null;
    isSignedIn: boolean;
    spotifyUrl: string | null;
    savedPlaylistId: string | null;
    savePlaylistMutation: {
        isPending: boolean;
        isSuccess: boolean;
    };
    createSpotifyPlaylistMutation: {
        isPending: boolean;
        error: Error | null;
    };
    onSavePlaylist: () => void;
    onCreateSpotify: () => void;
    onDeletePlaylist: () => void;
}

export default function PlaylistViewSheet({
    open,
    onOpenChange,
    playlist,
    isSignedIn,
    spotifyUrl,
    savedPlaylistId,
    savePlaylistMutation,
    createSpotifyPlaylistMutation,
    onSavePlaylist,
    onCreateSpotify,
    onDeletePlaylist,
}: PlaylistViewSheetProps) {
    if (!playlist) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="w-full h-3/4">
                <SheetHeader>
                    <SheetTitle>Current Playlist</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <div>
                        <h3 className="text-xl font-bold">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
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
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors rounded-md"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open in Spotify
                            </a>
                        ) : (
                            <button
                                onClick={onCreateSpotify}
                                disabled={createSpotifyPlaylistMutation.isPending}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 rounded-md"
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
                                onClick={onSavePlaylist}
                                disabled={savePlaylistMutation.isPending}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-md"
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
                            <Button
                                onClick={onDeletePlaylist}
                                variant="destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Playlist
                            </Button>
                        )}
                    </div>

                    {createSpotifyPlaylistMutation.error && (
                        <div className="text-xs text-destructive bg-destructive/10 p-3 border border-destructive/20 rounded-md">
                            {createSpotifyPlaylistMutation.error.message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Tracks ({playlist.tracks.length})</h4>
                        <div className="space-y-2">
                            {playlist.tracks.map((track, index) => (
                                <div key={index} className="flex gap-3 text-sm p-2 border border-border bg-card rounded-md">
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
            </SheetContent>
        </Sheet>
    );
}
