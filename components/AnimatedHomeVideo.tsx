'use client';

import { motion } from "motion/react";

interface AnimatedHomeVideoProps {
    src: string;
    type?: string;
}

export default function AnimatedHomeVideo({
    src,
    type = "video/mp4"
}: AnimatedHomeVideoProps) {
    return (
        <motion.video
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 1.6,
                ease: "easeOut"
            }}
        >
            <source src={src} type={type} />
        </motion.video>
    );
}
