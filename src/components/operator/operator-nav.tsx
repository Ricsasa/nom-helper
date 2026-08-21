'use client';

import Link from 'next/link';
import { BrandSquares } from '@/components/shared/brand-mark';
import { useLanguage } from '@/components/shared/language-provider';

/**
 * The header of the operator mode. It is not the chat topbar: the two are
 * different work modes, and the only link between them is the way back
 * (addendum, "Access").
 */
export function OperatorNav() {
  const { t } = useLanguage();

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-line bg-muted px-5 py-2.5">
      <BrandSquares size={8} gap="gap-[3px]" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-ink">{t('operator.nav.title')}</h1>
        <p className="truncate text-mini text-muted2">{t('operator.nav.subtitle')}</p>
      </div>
      <Link
        href="/chat"
        className="shrink-0 border border-lineGhost px-2.5 py-[5px] font-mono text-mini text-muted2 transition-colors hover:border-[#B9BCB8] hover:text-ink"
      >
        ← {t('operator.nav.backToApp')}
      </Link>
    </header>
  );
}
