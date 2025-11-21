'use client';

import Link from 'next/link';
import { ExternalLink, Music, Calendar, Disc } from 'lucide-react';
import type { SavedPlaylist } from './types';
import { cn } from '@/lib/utils';

interface CreatedPlaylistsProps {
    playlists: SavedPlaylist[];
    isLoading: boolean;
    mode?: 'grid' | 'list';
    className?: string;
}

export default function CreatedPlaylists({ playlists, isLoading, mode = 'grid', className }: CreatedPlaylistsProps) {
    if (isLoading) {
        return (
            <div className={cn("space-y-4", className)}>
                {mode === 'grid' && (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Playlists
                    </h2>
                )}
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </div>
        );
    }

    if (!playlists || playlists.length === 0) {
        if (mode === 'list') {
            return (
                <div className={cn("p-4 text-center text-sm text-muted-foreground", className)}>
                    No playlists yet.
                </div>
            );
        }
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                    Your Playlists
                </h2>
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Music className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        No playlists created yet. Generate your first playlist above!
                    </p>
                </div>
            </div>
        );
    }

    if (mode === 'list') {
        return (
            <div className={cn("flex flex-col gap-1", className)}>
                {playlists.map((playlist) => (
                    <Link
                        key={playlist.id}
                        href={`/playlists/${playlist.id}`}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group",
                            "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <Disc className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{playlist.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                                {playlist.prompt || `${playlist.playlist_tracks?.length || 0} tracks`}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black dark:text-white">
                Your Playlists
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                                    {playlist.name}
                                </h3>
                                {playlist.spotify_playlist_url && (
                                    <a
                                        href={playlist.spotify_playlist_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 ml-2 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors"
                                        title="Open in Spotify"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                )}
                            </div>

                            {playlist.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {playlist.description}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Music className="h-3.5 w-3.5" />
                                    <span>{playlist.playlist_tracks?.length || 0} tracks</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{new Date(playlist.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {playlist.prompt && (
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 dark:text-gray-500 italic line-clamp-2">
                                        "{playlist.prompt}"
                                    </p>
                                </div>
                            )}

                            {!playlist.spotify_playlist_url && (
                                <div className="pt-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                                        Not added to Spotify
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
