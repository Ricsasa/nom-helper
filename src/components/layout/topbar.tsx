'use client';

import { useLanguage } from '@/components/shared/language-provider';

/**
 * The standard code on the right is never translated and never abbreviated
 * (spec section 7).
 */
export function Topbar({ title, onOpenSidebar }: { title: string; onOpenSidebar: () => void }) {
  const { t } = useLanguage();

  return (
    <header className="flex h-topbar shrink-0 items-center gap-3 border-b border-line px-5">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label={t('nav.openSidebar')}
        className="font-mono text-[13px] text-muted2 hover:text-ink shell:hidden"
      >
        ☰
      </button>

      <h1 className="min-w-0 flex-1 truncate text-base font-medium">{title}</h1>

      <span className="shrink-0 font-mono text-mini tracking-[0.04em] text-faint">
        NOM-001-SEDE-2018
      </span>
    </header>
  );
}
