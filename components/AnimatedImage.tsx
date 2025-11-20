'use client';

import { motion } from "motion/react";
import Link from 'next/link';
import Image from 'next/image';

interface AnimatedImageProps {
  coverImage: string;
  slug?: string;
  title: string;
  imageClassName?: string;
}

export default function AnimatedImage({ coverImage, slug, title, imageClassName = "object-cover" }: AnimatedImageProps) {
  return (
    <motion.div
      className="relative w-full aspect-video overflow-hidden rounded-lg bg-gray-50 dark:bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.25 }}
    >
      {slug ? (
        <Link href={`/blog/${slug}`}>
          <Image
            src={coverImage}
            alt={title}
            fill
            className={imageClassName}
          />
        </Link>
      ) : (
        <Image
          src={coverImage}
          alt={title}
          fill
          className={imageClassName}
        />
      )}
    </motion.div>
  );
}
