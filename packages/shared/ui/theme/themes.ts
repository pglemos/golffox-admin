import { colors } from './colors';

export const themes = {
  light: {
    background: '#FFFFFF',
    text: '#111827',
    surface: '#F9FAFB',
    muted: '#E5E7EB',
    border: 'rgba(17, 24, 39, 0.08)',
  },
  dark: {
    background: '#0B0B0F',
    text: '#E5E7EB',
    surface: '#1F2937',
    muted: '#4B5563',
    border: 'rgba(229, 231, 235, 0.12)',
  },
} as const;

export type ThemeName = keyof typeof themes;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  success: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
  warning: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.warning} 100%)`,
  danger: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.primary} 100%)`,
  neutral: `linear-gradient(135deg, rgba(209, 213, 219, 0.7) 0%, rgba(148, 163, 184, 0.85) 100%)`,
} as const;

export const shadows = {
  elevation1: '0 15px 35px rgba(91, 46, 255, 0.12)',
  elevation2: '0 20px 45px rgba(0, 224, 255, 0.18)',
  glow: '0 0 40px rgba(0, 224, 255, 0.45)',
} as const;

export const radii = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  pill: '999px',
} as const;

export const transitions = {
  spring: { type: 'spring', stiffness: 320, damping: 24 },
  gentle: { type: 'spring', stiffness: 180, damping: 26 },
};
