'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string | null;
  selectedText: string;
  isLoading: boolean;
  error: string | null;
}

export function ImageModal({
  isOpen,
  onClose,
  imageData,
  selectedText,
  isLoading,
  error,
}: ImageModalProps) {
  const handleDownload = () => {
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `visual-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-zinc-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Visual Interpretation</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-amber-400 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Generating your visual...</p>
                    <p className="text-zinc-400 text-sm mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-center max-w-md">{error}</p>
                  <Button variant="outline" onClick={onClose} className="mt-2">
                    Close
                  </Button>
                </div>
              )}

              {imageData && !isLoading && !error && (
                <div className="space-y-6">
                  {/* Generated Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={imageData}
                      alt="Generated visual interpretation"
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  {/* Selected Text Quote */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50"
                  >
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-zinc-300 italic text-sm leading-relaxed line-clamp-4">
                        &ldquo;{selectedText}&rdquo;
                      </p>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-end gap-3"
                  >
                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
