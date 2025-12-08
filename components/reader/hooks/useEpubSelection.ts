import { useState, useCallback, useEffect, useRef } from 'react';
import type { Rendition, Contents } from 'epubjs';

export interface Selection {
  cfiRange: string;
  text: string;
  x: number;
  y: number;
}

interface UseEpubSelectionReturn {
  selection: Selection | null;
  renditionRef: React.MutableRefObject<Rendition | null>;
  clearSelection: () => void;
  setupRendition: (rendition: Rendition) => void;
}

export function useEpubSelection(): UseEpubSelectionReturn {
  const [selection, setSelection] = useState<Selection | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  // Handle text selection in the epub
  const handleSelection = useCallback((cfiRange: string, contents: Contents) => {
    if (!renditionRef.current) return;

    try {
      const range = renditionRef.current.getRange(cfiRange);
      const text = range.toString().trim();

      if (!text || text.length < 10) {
        setSelection(null);
        return;
      }

      const rect = range.getBoundingClientRect();

      // Get the iframe element
      const iframe = contents.document.defaultView?.frameElement as HTMLIFrameElement | null;
      if (!iframe) return;

      const iframeRect = iframe.getBoundingClientRect();

      // Calculate absolute position
      setSelection({
        cfiRange,
        text,
        x: rect.x + iframeRect.x + rect.width / 2,
        y: rect.y + iframeRect.y - 10,
      });
    } catch (err) {
      console.error('Selection error:', err);
      setSelection(null);
    }
  }, []);

  // Clear selection on window resize
  useEffect(() => {
    const handleResize = () => setSelection(null);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clearSelection = useCallback(() => setSelection(null), []);

  // Setup rendition with selection handling and theming
  const setupRendition = useCallback(
    (rendition: Rendition) => {
      renditionRef.current = rendition;

      rendition.on('selected', handleSelection);

      // Clear selection on click elsewhere
      rendition.on('click', () => {
        setTimeout(() => {
          const windowSelection = window.getSelection();
          if (!windowSelection || windowSelection.toString().trim().length === 0) {
            setSelection(null);
          }
        }, 100);
      });

      // Style the epub content
      rendition.themes.default({
        body: {
          'font-family': '"Georgia", serif !important',
          'line-height': '1.8 !important',
          color: '#e4e4e7 !important',
          background: 'transparent !important',
        },
        'p, div, span': {
          color: '#e4e4e7 !important',
        },
        'h1, h2, h3, h4, h5, h6': {
          color: '#fafafa !important',
        },
        a: {
          color: '#00b8db !important', // cyan
        },
        '::selection': {
          background: 'rgba(251, 191, 36, 0.3) !important',
        },
      });
    },
    [handleSelection]
  );

  return {
    selection,
    renditionRef,
    clearSelection,
    setupRendition,
  };
}
