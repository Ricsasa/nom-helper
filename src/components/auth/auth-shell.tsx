'use client';

import type { ReactNode } from 'react';
import { BrandSquares } from '@/components/shared/brand-mark';
import { FooterStrip } from '@/components/shared/footer-strip';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { useLanguage } from '@/components/shared/language-provider';

/**
 * Full-height column. The inner area scrolls, the page does not, so the footer
 * strip stays on screen at any viewport height (design 7.1).
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-5 py-10">
        <LanguageToggle />

        <div className="flex flex-col items-center gap-2">
          <BrandSquares size={10} gap="gap-2" />
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">{t('brand.name')}</h1>
          <p className="font-mono text-xs uppercase tracking-[0.04em] text-faint">
            {t('brand.tagline')}
          </p>
        </div>

        {children}
      </div>

      <FooterStrip />
    </div>
  );
}
