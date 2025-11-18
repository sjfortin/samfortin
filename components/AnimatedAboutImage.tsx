'use client';

import { motion } from "motion/react";
import Image from 'next/image';

interface AnimatedAboutImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function AnimatedAboutImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "" 
}: AnimatedAboutImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority
      />
    </motion.div>
  );
}
