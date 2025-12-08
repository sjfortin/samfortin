'use client';

import React, { useCallback } from 'react';
import { Upload, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadScreenProps {
  onFileUpload: (arrayBuffer: ArrayBuffer, fileName: string) => void;
}

export function UploadScreen({ onFileUpload }: UploadScreenProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.name.endsWith('.epub')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          onFileUpload(arrayBuffer, file.name.replace('.epub', ''));
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [onFileUpload]
  );

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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-2xl shadow-cyan-500/25 mb-6"
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
            className="relative border-2 border-dashed border-zinc-700 hover:border-cyan-500/50 p-12 text-center cursor-pointer transition-colors bg-zinc-900/50 hover:bg-zinc-800/50"
          >
            <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Drop your EPUB file here</p>
            <p className="text-zinc-500 text-sm">or click to browse</p>
            <input
              type="file"
              accept=".epub"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </motion.div>
        </label>

        <div className="mt-8 p-4 bg-zinc-800/50 border border-zinc-700/50">
          <h3 className="text-sm font-medium text-cyan-400 mb-2">How it works</h3>
          <ol className="text-sm text-zinc-400 space-y-2">
            <li className="flex gap-2">
              <span className="text-cyan-500">1.</span>
              Upload any EPUB book
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-500">2.</span>
              Highlight a passage that inspires you
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-500">3.</span>
              Click &ldquo;Visualize&rdquo; to generate AI artwork
            </li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}
