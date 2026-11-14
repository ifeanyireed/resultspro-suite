'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in' | 'parallax';
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialVariant = (() => {
    switch (animation) {
      case 'slide-left':
        return { opacity: 0, x: -28, y: 16 };
      case 'slide-right':
        return { opacity: 0, x: 28, y: 16 };
      case 'zoom-in':
        return { opacity: 0, scale: 0.95, y: 20 };
      case 'fade-in':
        return { opacity: 0, y: 16 };
      default:
        return { opacity: 0, y: 28 };
    }
  })();

  const delaySeconds = delay > 10 ? delay / 1000 : delay;

  return (
    <motion.div
      data-fm-risen="true"
      className={className}
      initial={initialVariant}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -32px 0px' }}
      transition={{
        duration: 0.65,
        delay: delaySeconds,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
