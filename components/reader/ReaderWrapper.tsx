'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const EpubReader = dynamic(
  () => import('./EpubReader').then((mod) => mod.EpubReader),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-zinc-400">Loading reader...</p>
        </div>
      </div>
    ),
  }
);

export function ReaderWrapper() {
  return <EpubReader />;
}
