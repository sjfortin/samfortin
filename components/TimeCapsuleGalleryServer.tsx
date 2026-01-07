'use client';

import { motion } from 'motion/react';
import { Calendar, Newspaper } from 'lucide-react';

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

interface TimeCapsuleGalleryServerProps {
  avatars: AvatarData[];
}

export function TimeCapsuleGalleryServer({ avatars }: TimeCapsuleGalleryServerProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
    <div className="space-y-8">
      {avatars.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white dark:bg-gray-900 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 lg:w-1/4 aspect-square md:aspect-auto">
              <img
                src={avatar.image_url}
                alt={`Week of ${formatDate(avatar.week_date)}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Week of {formatDate(avatar.week_date)}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                News That Inspired This Week
              </h2>

              <div className="space-y-3 mb-6">
                {avatar.headlines.map((headline, headlineIndex) => (
                  <div
                    key={headlineIndex}
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

              {avatar.generated_prompt && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    AI Visual Concept
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    &quot;{avatar.generated_prompt}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
