'use client';

import { motion, useScroll, useTransform } from "motion/react";
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
    grayscaleScroll?: boolean;
    grayscaleScrollThreshold?: number;
    grayscaleScrollThresholdMobile?: number;
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
    grayscaleScroll = false,
    grayscaleScrollThreshold = 200,
    grayscaleScrollThresholdMobile = 100,
}: AnimatedHomeImageProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const threshold = isMobile ? grayscaleScrollThresholdMobile : grayscaleScrollThreshold;
    const { scrollY } = useScroll();
    const grayscaleValue = useTransform(
        scrollY,
        [0, threshold],
        [1, 0]
    );
    const grayscaleFilter = useTransform(grayscaleValue, (v) => `grayscale(${v})`);

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
            {grayscaleScroll ? (
                <motion.div style={{ filter: grayscaleFilter }}>
                    <Image
                        priority={preload}
                        alt={alt}
                        src={src}
                        width={width}
                        height={height}
                        className={className}
                    />
                </motion.div>
            ) : (
                <Image
                    priority={preload}
                    alt={alt}
                    src={src}
                    width={width}
                    height={height}
                    className={className}
                />
            )}
        </motion.div>
    );
}
