'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Music, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  name: string;
  artist: string;
  album?: string;
  uri?: string;
  found_on_spotify?: boolean;
  id?: string;
  position?: number;
}

interface TracksSectionProps {
  tracks: Track[];
  showSpotifyStatus?: boolean;
  className?: string;
}

export function TracksSection({ tracks, showSpotifyStatus = false, className = "" }: TracksSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const TracksContent = () => (
    <>
      <div className="flex-none p-4 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-sm">
          Tracks ({tracks.length})
        </h2>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-2">
            {/* Show info message if Spotify status is enabled and some tracks weren't found */}
            {showSpotifyStatus && tracks.some(t => t.found_on_spotify === false) && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-sm">
                <p className="text-destructive font-medium">Some tracks were not found on Spotify</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Tracks marked below could not be added to your Spotify playlist.
                </p>
              </div>
            )}

            {tracks && tracks.length > 0 ? (
              tracks
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((track, index) => (
                  <div
                    key={track.id || `${track.name}-${track.artist}-${index}`}
                    className={cn(
                      "flex gap-3 text-sm p-3 border shadow-sm",
                      showSpotifyStatus && track.found_on_spotify === false
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="text-muted-foreground w-6 flex-shrink-0 font-mono text-xs flex items-center">
                      {track.position ?? index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium truncate", showSpotifyStatus && track.found_on_spotify === false && "text-muted-foreground")}>
                        {track.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                      {showSpotifyStatus && track.found_on_spotify === false && (
                        <div className="text-xs text-destructive mt-1">Not found on Spotify</div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-muted-foreground py-8 text-sm">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No tracks yet</p>
                <p className="text-xs mt-2">Your playlist will appear here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: Sheet trigger */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full border-b border-border bg-background">
              <ListMusic className="w-4 h-4" />
              Tracks ({tracks.length})
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <SheetHeader className="border-b border-border px-4 py-3 flex-shrink-0">
              <SheetTitle>Playlist Tracks</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full overflow-hidden">
              <TracksContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Normal layout */}
      <div className={cn("hidden md:flex flex-col bg-muted/10 overflow-hidden", className)}>
        <TracksContent />
      </div>
    </>
  );
}
