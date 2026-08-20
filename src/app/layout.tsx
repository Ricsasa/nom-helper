import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { plexMono, plexSans } from './fonts';
import { LanguageProvider } from '@/components/shared/language-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOM Helper',
  description: 'Consulta técnica sobre la NOM-001-SEDE con citas rastreables.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * The provider sits at the root so the auth screens and the application share
 * one language state. Once src/lib/auth/ can resolve a session, the (app)
 * layout passes profiles.language down as `initialLanguage`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
