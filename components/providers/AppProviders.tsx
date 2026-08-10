'use client';

import { ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

/**
 * Single mount point for every client provider. A backend variant that needs
 * its own provider (Convex does) replaces this file and wraps the rest.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
