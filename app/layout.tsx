import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'App',
  description: 'Describe the app here',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
        <SpeedInsights />
      </body>
    </html>
  );
}
