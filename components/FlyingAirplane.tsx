'use client';

import { motion } from "motion/react";
import Image from 'next/image';

export default function FlyingAirplane() {
    return (
        <motion.div
            className="fixed bottom-20 left-0 z-10 pointer-events-none"
            initial={{ x: '-100%', opacity: 0, rotate: -10, y: '100%', scale: 0 }}
            animate={{ x: '100vw', opacity: 1, rotate: -5, y: '-50%', scale: 1 }}
            transition={{
                duration: 4,
                ease: "linear",
                opacity: { duration: 0.5 }
            }}
        >
            <Image
                src="/images/moebius-plane.png"
                alt="Flying airplane"
                width={377}
                height={200}
            />
        </motion.div>
    );
}
