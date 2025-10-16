'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { gradients, shadows } from '../theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'primary' | 'secondary' | 'neutral';
  tinted?: boolean;
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  accent = 'primary',
  tinted = true,
  className,
  children,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl backdrop-blur-2xl dark:bg-white/5 dark:text-white ${className ?? ''}`.trim()}
    style={{ boxShadow: shadows.elevation1 }}
    {...props}
  >
    {tinted && (
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: gradients[accent] ?? gradients.primary }}
      />
    )}
    <div className="relative z-10 flex flex-col gap-4 text-slate-900 dark:text-slate-100">
      {children}
    </div>
  </motion.div>
);
