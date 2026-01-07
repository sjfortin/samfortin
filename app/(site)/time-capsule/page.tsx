import { Metadata } from 'next';
import { getAllAvatars } from '@/lib/weekly-avatar/avatar-service';
import { TimeCapsuleGalleryServer } from '@/components/TimeCapsuleGalleryServer';

export const metadata: Metadata = {
  title: 'Time Capsule | Sam Fortin',
  description: 'A visual time capsule - weekly AI-generated avatars inspired by current events, rendered in the style of Moebius.',
};

export default async function TimeCapsulePage() {
  const avatars = await getAllAvatars();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mx-auto lg:mx-0">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
            Time Capsule
          </h1>
        </div>
        <TimeCapsuleGalleryServer avatars={avatars} />
      </div>
    </div>
  );
}
