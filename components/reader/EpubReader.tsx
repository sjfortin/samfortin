'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import type { Rendition, Contents } from 'epubjs';
import { HighlightMenu } from './HighlightMenu';
import { ImageModal } from './ImageModal';
import { Upload, BookOpen, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface Selection {
  cfiRange: string;
  text: string;
  x: number;
  y: number;
}

interface EpubReaderProps {
  initialUrl?: string;
}

export function EpubReader({ initialUrl }: EpubReaderProps) {
  const [epubData, setEpubData] = useState<ArrayBuffer | string | null>(initialUrl || null);
  const [location, setLocation] = useState<string | number>(0);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedTextForModal, setSelectedTextForModal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [toc, setToc] = useState<Array<{ label: string; href: string }>>([]);
  const [bookTitle, setBookTitle] = useState<string>('');
  
  const renditionRef = useRef<Rendition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle file upload - convert to ArrayBuffer for epub.js
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.epub')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setEpubData(arrayBuffer);
        setBookTitle(file.name.replace('.epub', ''));
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

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
        x: rect.x + iframeRect.x + (rect.width / 2),
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

  // Generate image from selected text
  const handleGenerate = useCallback(async () => {
    if (!selection?.text) return;

    setIsGenerating(true);
    setSelectedTextForModal(selection.text);
    setModalOpen(true);
    setError(null);
    setGeneratedImage(null);
    setSelection(null);

    try {
      const response = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selection.text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [selection]);

  const closeMenu = useCallback(() => setSelection(null), []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setGeneratedImage(null);
    setError(null);
  }, []);

  // Rendition setup
  const getRendition = useCallback((rendition: Rendition) => {
    renditionRef.current = rendition;
    
    rendition.on('selected', handleSelection);
    
    // Clear selection on click elsewhere
    rendition.on('click', () => {
      // Small delay to allow selection event to fire first
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
        'color': '#e4e4e7 !important',
        'background': 'transparent !important',
      },
      'p, div, span': {
        'color': '#e4e4e7 !important',
      },
      'h1, h2, h3, h4, h5, h6': {
        'color': '#fafafa !important',
      },
      a: {
        'color': '#fbbf24 !important',
      },
      '::selection': {
        'background': 'rgba(251, 191, 36, 0.3) !important',
      },
    });
  }, [handleSelection]);

  // Get table of contents
  const handleTocChange = useCallback((tocItems: Array<{ label: string; href: string }>) => {
    setToc(tocItems);
  }, []);

  // Upload screen
  if (!epubData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/25 mb-6"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Visual Reader</h1>
            <p className="text-zinc-400">
              Upload an EPUB book and transform passages into AI-generated artwork
            </p>
          </div>

          <label className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-2xl p-12 text-center cursor-pointer transition-colors bg-zinc-900/50 hover:bg-zinc-800/50"
            >
              <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <p className="text-white font-medium mb-1">Drop your EPUB file here</p>
              <p className="text-zinc-500 text-sm">or click to browse</p>
              <input
                type="file"
                accept=".epub"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </motion.div>
          </label>

          <div className="mt-8 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <h3 className="text-sm font-medium text-amber-400 mb-2">How it works</h3>
            <ol className="text-sm text-zinc-400 space-y-2">
              <li className="flex gap-2">
                <span className="text-amber-500">1.</span>
                Upload any EPUB book
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">2.</span>
                Highlight a passage that inspires you
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">3.</span>
                Click &ldquo;Visualize&rdquo; to generate AI artwork
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen w-full bg-zinc-950 flex flex-col relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTocOpen(!tocOpen)}
            className="text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
              {bookTitle || 'Visual Reader'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEpubData(null);
            setLocation(0);
            setBookTitle('');
            setToc([]);
          }}
          className="text-zinc-400 hover:text-white"
        >
          Change Book
        </Button>
      </header>

      {/* Table of Contents Sidebar */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20"
              onClick={() => setTocOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 z-30 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">Contents</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTocOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {toc.length > 0 ? (
                  <ul className="space-y-1">
                    {toc.map((item, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            setLocation(item.href);
                            setTocOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500 text-sm">No table of contents available</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Reader */}
      <div className="flex-1 relative">
        <ReactReader
          url={epubData}
          location={location}
          locationChanged={(loc: string) => setLocation(loc)}
          getRendition={getRendition}
          tocChanged={handleTocChange}
          epubOptions={{
            allowScriptedContent: true,
          }}
          readerStyles={{
            ...ReactReaderStyle,
            container: {
              ...ReactReaderStyle.container,
              background: '#09090b',
            },
            readerArea: {
              ...ReactReaderStyle.readerArea,
              background: '#09090b',
            },
            reader: {
              ...ReactReaderStyle.reader,
              background: '#18181b',
            },
            tocArea: {
              ...ReactReaderStyle.tocArea,
              display: 'none',
            },
            tocButton: {
              ...ReactReaderStyle.tocButton,
              display: 'none',
            },
            arrow: {
              ...ReactReaderStyle.arrow,
              color: '#71717a',
              background: 'transparent',
            },
            arrowHover: {
              ...ReactReaderStyle.arrowHover,
              color: '#fafafa',
              background: 'rgba(255,255,255,0.1)',
            },
          }}
        />

        {/* Navigation buttons overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm rounded-full px-2 py-1 border border-zinc-800">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => renditionRef.current?.prev()}
            className="text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-xs text-zinc-500 px-2">Navigate</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => renditionRef.current?.next()}
            className="text-zinc-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Highlight Menu */}
      <HighlightMenu
        isVisible={!!selection}
        position={{ x: selection?.x || 0, y: selection?.y || 0 }}
        selectedText={selection?.text || ''}
        onGenerate={handleGenerate}
        onClose={closeMenu}
        isGenerating={isGenerating}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageData={generatedImage}
        selectedText={selectedTextForModal}
        isLoading={isGenerating}
        error={error}
      />
    </div>
  );
}
