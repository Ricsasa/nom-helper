'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

// `attribute="class"` writes `.dark` on <html>, which is what
// tailwind.config.ts `darkMode: 'class'` reads.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}
