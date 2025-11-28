'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
  disabled?: boolean;
}

const POPULAR_GENRES = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Jazz',
  'Classical',
  'Electronic',
  'Country',
  'Indie',
  'Alternative',
  'Metal',
  'Folk',
  'Blues',
  'Reggae',
  'Soul',
  'Funk',
  'Disco',
  'Punk',
  'Latin',
  'K-Pop',
];

export default function GenreSelector({
  selectedGenres,
  onGenresChange,
  disabled = false,
}: GenreSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedGenres = showAll ? POPULAR_GENRES : POPULAR_GENRES.slice(0, 10);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  const clearAll = () => {
    onGenresChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
        </label>
        {selectedGenres.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {displayedGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              disabled={disabled}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors border',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-input hover:bg-accent',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {genre}
              {isSelected && <X className="w-3 h-3" />}
            </button>
          );
        })}
        {!showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            disabled={disabled}
            className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Show more...
          </button>
        )}
      </div>
    </div>
  );
}
