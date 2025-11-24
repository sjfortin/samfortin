'use client';

import { Loader2, Music } from 'lucide-react';

interface CreateSpotifyButtonProps {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    created: boolean;
}

export default function CreateSpotifyButton({
    onClick,
    disabled,
    loading,
    created,
}: CreateSpotifyButtonProps) {
    return (
        <div className="space-y-2">
            <button
                onClick={onClick}
                disabled={disabled}
                className="inline-flex items-center gap-2 bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Playlist...
                    </>
                ) : created ? (
                    <>
                        <Music className="h-4 w-4" />
                        Playlist Created!
                    </>
                ) : (
                    <>
                        <Music className="h-4 w-4" />
                        Create in Spotify
                    </>
                )}
            </button>
        </div>
    );
}
