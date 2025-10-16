'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../theme';

export interface LoaderProps {
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ label }) => (
  <div className="flex flex-col items-center gap-4 text-white">
    <motion.div
      className="relative h-14 w-14"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
    >
      <span
        className="absolute inset-0 rounded-full border-[3px] border-transparent"
        style={{ borderTopColor: colors.primary, borderRightColor: colors.secondary }}
      />
      <span className="absolute inset-3 rounded-full border-[3px] border-white/20" />
    </motion.div>
    {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
  </div>
);
