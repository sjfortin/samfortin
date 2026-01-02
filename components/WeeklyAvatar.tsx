'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedHomeImage from '@/components/AnimatedHomeImage';

interface WeeklyAvatarData {
  week_date: string;
  image_url: string;
  headlines: Array<{ title: string; source: string }>;
}

const FALLBACK_IMAGE = '/images/moebius-sam.png';

export function WeeklyAvatar() {
  const [avatarData, setAvatarData] = useState<WeeklyAvatarData | null>(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_IMAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const response = await fetch('/api/weekly-avatar/current');
        const data = await response.json();

        if (data.success && data.avatar) {
          setAvatarData(data.avatar);
          setImageSrc(data.avatar.image_url);
        }
      } catch (error) {
        console.error('Failed to fetch weekly avatar:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvatar();
  }, []);

  return (
    <Link
      href="/time-capsule"
      className="group relative block cursor-pointer"
      title={avatarData ? `Week of ${avatarData.week_date} - Click to see all avatars` : 'View time capsule'}
    >
      <AnimatedHomeImage
        src={imageSrc}
        preload={true}
        width={120}
        height={120}
        className="aspect-[1/1] bg-white dark:bg-black object-cover shadow-lg mb-4 p-1 border border-gray-300 transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-400"
        initialY={0}
        animateY={0}
        duration={0.6}
        grayscaleScroll={false}
      />
      {/* Hover indicator */}
      {!isLoading && avatarData && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 pointer-events-none">
          <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
            View Time Capsule
          </span>
        </div>
      )}
    </Link>
  );
}
