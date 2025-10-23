'use client';

import React from 'react';
import { gradients } from '../theme';

const gradientByStatus: Record<string, string> = {
  active: gradients.primary,
  inactive: gradients.warning,
  alert: gradients.danger,
};

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'alert';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => (
  <span
    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_15px_30px_rgba(91,46,255,0.2)]"
    style={{ background: gradientByStatus[status] ?? gradients.primary }}
  >
    <span className="h-2 w-2 animate-pulse rounded-full bg-white/5" />
    {label ?? status}
  </span>
);
