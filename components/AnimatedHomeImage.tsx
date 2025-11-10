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
                className={className}
            />
            {/* <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" /> */}
        </motion.div>
    );
}
