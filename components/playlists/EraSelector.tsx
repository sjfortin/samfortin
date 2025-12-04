'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EraSelectorProps {
  selectedEras: string[];
  onErasChange: (eras: string[]) => void;
  disabled?: boolean;
}

const TIME_ERAS = [
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  '2020s',
  'Modern',
  'Classic',
];

export default function EraSelector({
  selectedEras,
  onErasChange,
  disabled = false,
}: EraSelectorProps) {
  const toggleEra = (era: string) => {
    if (selectedEras.includes(era)) {
      onErasChange(selectedEras.filter((e) => e !== era));
    } else {
      onErasChange([...selectedEras, era]);
    }
  };

  const clearAll = () => {
    onErasChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Time Period {selectedEras.length > 0 && `(${selectedEras.length})`}
        </label>
        {selectedEras.length > 0 && (
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
        {TIME_ERAS.map((era) => {
          const isSelected = selectedEras.includes(era);
          return (
            <button
              key={era}
              type="button"
              onClick={() => toggleEra(era)}
              disabled={disabled}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors border',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-input hover:bg-accent',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {era}
              {isSelected && <X className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
