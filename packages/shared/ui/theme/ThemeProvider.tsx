'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { themes, ThemeName } from './themes';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  useEffect(() => {
    const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const storedTheme = typeof window !== 'undefined' ? (window.localStorage.getItem('golffox-theme') as ThemeName | null) : null;
    const initialTheme: ThemeName = storedTheme ?? (prefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.setProperty('--golffox-surface', themes[theme].surface);
    document.documentElement.style.setProperty('--golffox-background', themes[theme].background);
    document.documentElement.style.setProperty('--golffox-text', themes[theme].text);
    document.documentElement.style.setProperty('--golffox-muted', themes[theme].muted);
    document.documentElement.style.setProperty('--golffox-border', themes[theme].border);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('golffox-theme', theme);
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
    isDark: theme === 'dark',
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
