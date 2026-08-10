'use client';

import { ReactNode } from 'react';
import ConvexProvider from './ConvexProvider';
import ThemeProvider from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

/**
 * Convex keeps its own reactive cache, so React Query is not mounted here: data
 * from Convex comes through `useQuery` from `convex/react`. Add QueryProvider
 * back only if the app also talks to a REST API.
 *
 * When you install an auth provider, swap ConvexProvider for its authenticated
 * wrapper (`ConvexAuthNextjsProvider`, or `ConvexProviderWithClerk`).
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}
