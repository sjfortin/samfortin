'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaylistFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  playlistLength: string;
  setPlaylistLength: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PlaylistForm({
  prompt,
  setPrompt,
  playlistLength,
  setPlaylistLength,
  loading,
  onSubmit,
}: PlaylistFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <label htmlFor="prompt" className="sr-only">
          Describe your playlist
        </label>
        <div className="relative rounded-xl border border-input bg-background shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
            <textarea
              id="prompt"
              rows={4}
              className="block w-full rounded-t-xl border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm sm:leading-6 resize-none"
              placeholder="Describe the vibe, mood, or theme you're looking for..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            
            {/* Toolbar area */}
            <div className="flex items-center justify-between px-2 py-2 border-t border-input bg-muted/30 rounded-b-xl">
                <div className="flex items-center gap-2">
                    <select
                      id="playlistLength"
                      className="block w-full rounded-md border-0 bg-transparent py-1.5 pl-3 pr-8 text-muted-foreground focus:ring-2 focus:ring-ring sm:text-xs sm:leading-6 cursor-pointer hover:text-foreground transition-colors"
                      value={playlistLength}
                      onChange={(e) => setPlaylistLength(e.target.value)}
                      disabled={loading}
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                    </select>
                </div>
                
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all",
                        (loading || !prompt.trim()) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate
                      </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </form>
  );
}
