'use client';

import { Loader2, MinusIcon, PlusIcon, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type AIModel = "gemini" | "openai" | "claude";

export const GENRES = [
  'Rock', 'Pop', 'Hip Hop', 'R&B', 'Jazz', 'Classical',
  'Electronic', 'Country', 'Blues', 'Reggae', 'Metal',
  'Punk', 'Folk', 'Soul', 'Funk', 'Disco', 'House',
  'Techno', 'Indie', 'Alternative', 'Grunge', 'Ambient',
  'Latin', 'Afrobeat', 'K-Pop', 'J-Pop'
] as const;

export const DECADES = [
  '1950s', '1960s', '1970s', '1980s', '1990s',
  '2000s', '2010s', '2020s'
] as const;

interface PlaylistFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  playlistLength: string;
  setPlaylistLength: (value: string) => void;
  model: AIModel;
  setModel: (value: AIModel) => void;
  genres: string[];
  setGenres: (value: string[]) => void;
  decades: string[];
  setDecades: (value: string[]) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PlaylistForm({
  prompt,
  setPrompt,
  playlistLength,
  setPlaylistLength,
  model,
  setModel,
  genres,
  setGenres,
  decades,
  setDecades,
  loading,
  onSubmit,
}: PlaylistFormProps) {
  const [showGenres, setShowGenres] = useState(false);
  const [showDecades, setShowDecades] = useState(false);

  const toggleGenre = (genre: string) => {
    setGenres(
      genres.includes(genre)
        ? genres.filter(g => g !== genre)
        : [...genres, genre]
    );
  };

  const toggleDecade = (decade: string) => {
    setDecades(
      decades.includes(decade)
        ? decades.filter(d => d !== decade)
        : [...decades, decade]
    );
  };
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                      id="model"
                      className="block rounded-md border-0 bg-transparent py-1.5 pl-3 pr-8 text-muted-foreground focus:ring-2 focus:ring-ring sm:text-xs sm:leading-6 cursor-pointer hover:text-foreground transition-colors"
                      value={model}
                      onChange={(e) => setModel(e.target.value as AIModel)}
                      disabled={loading}
                    >
                      <option value="gemini">Gemini</option>
                      <option value="openai">ChatGPT</option>
                      <option value="claude">Claude</option>
                    </select>
                    <select
                      id="playlistLength"
                      className="block rounded-md border-0 bg-transparent py-1.5 pl-3 pr-8 text-muted-foreground focus:ring-2 focus:ring-ring sm:text-xs sm:leading-6 cursor-pointer hover:text-foreground transition-colors"
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

      {/* Filters Section */}
      <div className="space-y-3">
        {/* Genre Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowGenres(!showGenres)}
              disabled={loading}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
            >
              {showGenres ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              Genres {genres.length > 0 && `(${genres.length})`}
            </button>
            {genres.length > 0 && (
              <button
                type="button"
                onClick={() => setGenres([])} 
                disabled={loading}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    disabled={loading}
                    className="hover:text-primary/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {showGenres && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 rounded-lg border border-input bg-muted/30">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  disabled={loading}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                    genres.includes(genre)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decade Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowDecades(!showDecades)}
              disabled={loading}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
            >
              {showDecades ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              Decades {decades.length > 0 && `(${decades.length})`}
            </button>
            {decades.length > 0 && (
              <button
                type="button"
                onClick={() => setDecades([])}
                disabled={loading}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          {decades.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {decades.map((decade) => (
                <span
                  key={decade}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                >
                  {decade}
                  <button
                    type="button"
                    onClick={() => toggleDecade(decade)}
                    disabled={loading}
                    className="hover:text-primary/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {showDecades && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg border border-input bg-muted/30">
              {DECADES.map((decade) => (
                <button
                  key={decade}
                  type="button"
                  onClick={() => toggleDecade(decade)}
                  disabled={loading}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    decades.includes(decade)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {decade}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
