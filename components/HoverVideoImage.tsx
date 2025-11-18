'use client';

import { motion } from "motion/react";
import Image from 'next/image';
import { useState, useRef } from 'react';

interface HoverVideoImageProps {
  imageSrc: string;
  videoSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  longPressDuration?: number; // in milliseconds
}

export default function HoverVideoImage({ 
  imageSrc,
  videoSrc,
  alt, 
  width, 
  height, 
  className = "",
  longPressDuration = 500
}: HoverVideoImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const playVideo = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const stopVideo = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    playVideo();
  };

  const handleMouseLeave = () => {
    stopVideo();
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      playVideo();
    }, longPressDuration);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    stopVideo();
  };

  const handleTouchMove = () => {
    // Cancel long press if user moves their finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className="relative"
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority
      />
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        playsInline
        className={`${className} absolute inset-0 w-full h-full object-cover ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </motion.div>
  );
}
