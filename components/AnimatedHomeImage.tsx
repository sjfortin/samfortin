'use client';

import { motion } from "motion/react";
import Image from 'next/image';

interface AnimatedHomeImageProps {
    src: string;
    alt?: string;
    preload?: boolean;
    delay?: number;
    width?: number;
    height?: number;
    initialY?: number;
    animateY?: number;
    className?: string;
    duration?: number;
    grayscaleHover?: boolean;
}

export default function AnimatedHomeImage({
    src,
    alt = "",
    preload = false,
    delay = 0,
    width = 528,
    height = 528,
    initialY = 20,
    animateY = 0,
    className = "",
    duration = 0.6,
    grayscaleHover = false,
}: AnimatedHomeImageProps) {
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: initialY }}
            animate={{ opacity: 1, y: animateY }}
            transition={{
                duration,
                delay,
                ease: "easeOut"
            }}
        >
            <Image
                preload={preload}
                alt={alt}
                src={src}
                width={width}
                height={height}
                className={`${grayscaleHover ? 'grayscale hover:grayscale-0 transition-all duration-500 ease-in-out' : ''} ${className}`}
            />
        </motion.div>
    );
}
