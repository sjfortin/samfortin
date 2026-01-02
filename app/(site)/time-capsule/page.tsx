import { Metadata } from 'next';
import { TimeCapsuleGallery } from '@/components/TimeCapsuleGallery';

export const metadata: Metadata = {
  title: 'Time Capsule | Sam Fortin',
  description: 'A visual time capsule - weekly AI-generated avatars inspired by current events, rendered in the style of Moebius.',
};

export default function TimeCapsulePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mx-auto lg:mx-0">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
            Time Capsule
          </h1>
        </div>
        <TimeCapsuleGallery />
      </div>
    </div>
  );
}
