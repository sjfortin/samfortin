'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Upload, Check, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaylistCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  playlistDescription: string;
  tracks: Array<{ name: string; artist: string }>;
  spotifyPlaylistId: string | null;
  dbPlaylistId: string;
  onCoverUploaded?: (coverImageUrl: string) => void;
}

export function PlaylistCoverModal({
  isOpen,
  onClose,
  playlistName,
  playlistDescription,
  tracks,
  spotifyPlaylistId,
  dbPlaylistId,
  onCoverUploaded,
}: PlaylistCoverModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setImageData(null);
    setBase64Data(null);
    setUploadSuccess(false);

    try {
      const response = await fetch('/api/generate-playlist-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistName,
          playlistDescription,
          tracks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover');
      }

      setImageData(data.imageData);
      setBase64Data(data.base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadToSpotify = async () => {
    if (!base64Data || !spotifyPlaylistId) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload-playlist-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotifyPlaylistId,
          dbPlaylistId,
          base64Image: base64Data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload cover');
      }

      setUploadSuccess(true);
      if (data.coverImageUrl && onCoverUploaded) {
        onCoverUploaded(data.coverImageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload to Spotify');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageData) return;

    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${playlistName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-cover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setImageData(null);
    setBase64Data(null);
    setError(null);
    setUploadSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-zinc-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Generate Cover Art</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Initial state - no image yet */}
              {!imageData && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center py-8 gap-6">
                  <div className="w-32 h-32 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Generate AI Cover Art</p>
                    <p className="text-zinc-400 text-sm mt-1">
                      Create a unique cover image for &quot;{playlistName}&quot;
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Cover
                  </Button>
                </div>
              )}

              {/* Loading state */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Creating your cover art...</p>
                    <p className="text-zinc-400 text-sm mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-center max-w-md">{error}</p>
                  <Button variant="outline" onClick={handleGenerate} className="mt-2 gap-2">
                    <Sparkles className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success state - image generated */}
              {imageData && !isGenerating && !error && (
                <div className="space-y-6">
                  {/* Generated Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-xl overflow-hidden shadow-2xl aspect-square max-w-sm mx-auto"
                  >
                    <img
                      src={imageData}
                      alt="Generated playlist cover"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Upload success message */}
                  {uploadSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 justify-center text-green-400 bg-green-400/10 p-3 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                      <span>Cover uploaded to Spotify!</span>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-3"
                  >
                    {spotifyPlaylistId && !uploadSuccess && (
                      <Button
                        onClick={handleUploadToSpotify}
                        disabled={isUploading}
                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Set as Spotify Cover
                          </>
                        )}
                      </Button>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="flex-1 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex-1 gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
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
