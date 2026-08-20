import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

/**
 * Two families: sans carries the prose, mono carries the metadata (references,
 * states, labels). Weight 700 is deliberately absent — the design caps emphasis
 * at 600 (design 4.1).
 */
export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
