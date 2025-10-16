'use client';

import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';
import { colors } from '../theme';

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const variantClasses: Record<'primary' | 'secondary' | 'ghost', string> = {
  primary: 'text-white shadow-[0_18px_35px_rgba(91,46,255,0.35)]',
  secondary: 'text-slate-900 shadow-[0_18px_35px_rgba(0,224,255,0.25)]',
  ghost: 'text-white border border-white/20 backdrop-blur-md',
};

const backgroundByVariant: Record<string, string> = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
  ghost: 'rgba(255, 255, 255, 0.1)',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  shimmer?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, variant = 'primary', size = 'md', shimmer = true, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ y: -2, rotateX: 3, rotateY: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      style={{ background: backgroundByVariant[variant] }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ''}`.trim()}
      {...props}
    >
      {shimmer && (
        <span className="absolute inset-0 overflow-hidden rounded-2xl">
          <span className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  ));

Button.displayName = 'Button';
