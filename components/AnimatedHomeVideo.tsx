'use client';

import { motion } from "motion/react";

interface AnimatedHomeVideoProps {
    src: string;
    poster?: string;
}

export default function AnimatedHomeVideo({
    src,
    poster = ""
}: AnimatedHomeVideoProps) {
    return (
        <motion.video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 1.6,
                ease: "easeOut"
            }}
            poster={poster}
            src={src}
        />
    );
}
