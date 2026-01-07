'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Music, ListMusic } from 'lucide-react';

interface Track {
  name: string;
  artist: string;
  album?: string;
  uri?: string;
}

interface TracksSectionProps {
  tracks: Track[];
}

export function TracksSection({ tracks }: TracksSectionProps) {
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
            {tracks && tracks.length > 0 ? (
              tracks.map((track, index) => (
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
      <div className="hidden md:flex flex-col w-full md:w-[50%] bg-muted/10 overflow-hidden h-1/3 md:h-full">
        <TracksContent />
      </div>
    </>
  );
}
