'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useState } from 'react'
import { LogoMark } from './LogoMark'

interface AnimatedLogoProps {
  width?: number
  height?: number
  className?: string
}

export function AnimatedLogo({ width = 40, height = 40, className = '' }: AnimatedLogoProps) {
  const [initialAnimationDone, setInitialAnimationDone] = useState(false)
  const { scrollY } = useScroll()
  const scrollRotation = useTransform(scrollY, [0, 100], [0, 360])

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.25, ease: "easeOut" }}
      onAnimationComplete={() => setInitialAnimationDone(true)}
      style={initialAnimationDone ? { rotate: scrollRotation } : undefined}
    >
      <LogoMark width={width} height={height} className={className} />
    </motion.div>
  )
}
