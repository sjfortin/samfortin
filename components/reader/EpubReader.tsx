'use client';

import { useState, useCallback } from 'react';
import { ReactReader } from 'react-reader';
import { HighlightMenu } from './HighlightMenu';
import { ImageModal } from './ImageModal';
import { UploadScreen } from './UploadScreen';
import { ReaderHeader } from './ReaderHeader';
import { TableOfContents, TocItem } from './TableOfContents';
import { NavigationControls } from './NavigationControls';
import { useEpubSelection } from './hooks/useEpubSelection';
import { useImageGeneration } from './hooks/useImageGeneration';
import { darkReaderStyles } from './readerStyles';

interface EpubReaderProps {
  initialUrl?: string;
}

export function EpubReader({ initialUrl }: EpubReaderProps) {
  // Book state
  const [epubData, setEpubData] = useState<ArrayBuffer | string | null>(initialUrl || null);
  const [location, setLocation] = useState<string | number>(0);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);

  // Custom hooks
  const { selection, renditionRef, clearSelection, setupRendition } = useEpubSelection();
  const { isGenerating, generatedImage, error, modalOpen, selectedText, generate, closeModal } =
    useImageGeneration();

  // Handlers
  const handleFileUpload = useCallback((arrayBuffer: ArrayBuffer, fileName: string) => {
    setEpubData(arrayBuffer);
    setBookTitle(fileName);
  }, []);

  const handleChangeBook = useCallback(() => {
    setEpubData(null);
    setLocation(0);
    setBookTitle('');
    setToc([]);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selection?.text) return;
    clearSelection();
    await generate(selection.text);
  }, [selection, clearSelection, generate]);

  const handleTocChange = useCallback((tocItems: TocItem[]) => {
    setToc(tocItems);
  }, []);

  const handleNavigate = useCallback((href: string) => {
    setLocation(href);
  }, []);

  // Upload screen
  if (!epubData) {
    return <UploadScreen onFileUpload={handleFileUpload} />;
  }

  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col relative">
      <ReaderHeader
        bookTitle={bookTitle}
        onToggleToc={() => setTocOpen(!tocOpen)}
        onChangeBook={handleChangeBook}
      />

      <TableOfContents
        isOpen={tocOpen}
        items={toc}
        onClose={() => setTocOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Reader */}
      <div className="flex-1 relative">
        <ReactReader
          url={epubData}
          location={location}
          locationChanged={(loc: string) => setLocation(loc)}
          getRendition={setupRendition}
          tocChanged={handleTocChange}
          epubOptions={{ allowScriptedContent: true }}
          readerStyles={darkReaderStyles}
        />

        <NavigationControls
          onPrev={() => renditionRef.current?.prev()}
          onNext={() => renditionRef.current?.next()}
        />
      </div>

      {/* Highlight Menu */}
      <HighlightMenu
        isVisible={!!selection}
        position={{ x: selection?.x || 0, y: selection?.y || 0 }}
        selectedText={selection?.text || ''}
        onGenerate={handleGenerate}
        onClose={clearSelection}
        isGenerating={isGenerating}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageData={generatedImage}
        selectedText={selectedText}
        isLoading={isGenerating}
        error={error}
      />
    </div>
  );
}
