'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Newspaper } from 'lucide-react';

interface Headline {
  title: string;
  source: string;
  url?: string;
}

interface AvatarData {
  id: string;
  week_date: string;
  image_url: string;
  headlines: Headline[];
  generated_prompt: string;
  created_at: string;
}

export function TimeCapsuleGallery() {
  const [avatars, setAvatars] = useState<AvatarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarData | null>(null);

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const response = await fetch('/api/weekly-avatar/all');
        const data = await response.json();

        if (data.success && data.avatars) {
          setAvatars(data.avatars);
        }
      } catch (error) {
        console.error('Failed to fetch avatars:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvatars();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (avatars.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No avatars yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The first weekly avatar will be generated soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {avatars.map((avatar, index) => (
          <motion.button
            key={avatar.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => setSelectedAvatar(avatar)}
            className="group relative aspect-square overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-none"
          >
            <img
              src={avatar.image_url}
              alt={`Week of ${formatDate(avatar.week_date)}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80">
              <p className="text-white text-xs font-medium">
                {formatDate(avatar.week_date)}
              </p>
            </div>
          </motion.button>
        ))}
      </div >

      {/* Detail Modal */}
      <AnimatePresence>
        {
          selectedAvatar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedAvatar(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedAvatar(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/2 aspect-square">
                    <img
                      src={selectedAvatar.image_url}
                      alt={`Week of ${formatDate(selectedAvatar.week_date)}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:w-1/2 p-6 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Week of {formatDate(selectedAvatar.week_date)}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      News That Inspired This Week
                    </h2>

                    <div className="space-y-4">
                      {selectedAvatar.headlines.map((headline, index) => (
                        <div
                          key={index}
                          className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800"
                        >
                          <Newspaper className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-900 dark:text-white text-sm font-medium">
                              {headline.title}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                              {headline.source}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedAvatar.generated_prompt && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          AI Visual Concept
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          &quot;{selectedAvatar.generated_prompt}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </>
  );
}
