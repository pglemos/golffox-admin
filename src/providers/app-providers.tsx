'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@features/auth/context/auth-provider';
import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
