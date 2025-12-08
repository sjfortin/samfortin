import { useState, useCallback } from 'react';

interface UseImageGenerationReturn {
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
  modalOpen: boolean;
  selectedText: string;
  generate: (text: string) => Promise<void>;
  closeModal: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const generate = useCallback(async (text: string) => {
    if (!text) return;

    setIsGenerating(true);
    setSelectedText(text);
    setModalOpen(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setGeneratedImage(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    generatedImage,
    error,
    modalOpen,
    selectedText,
    generate,
    closeModal,
  };
}
