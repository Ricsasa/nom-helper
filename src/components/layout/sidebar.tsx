'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { signOutAction } from '@/app/(app)/settings/actions';
import { BrandSquares } from '@/components/shared/brand-mark';
import { GhostButton } from '@/components/ui/ghost-button';
import { useLanguage } from '@/components/shared/language-provider';
import type { TranslationKey } from '@/types/ui';

/**
 * Navigation, calculators and query history. Below 860px it leaves the flow and
 * becomes a fixed drawer with a scrim, closing on Escape and on any item choice
 * (design 7.2, accessibility section 10).
 */
const CALCULATORS: TranslationKey[] = ['nav.calculator1', 'nav.calculator2', 'nav.calculator3'];

const NAV_ITEM =
  'flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-base text-muted2 transition-colors hover:bg-hover hover:text-ink';

function Glyph({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`w-3 shrink-0 font-mono text-[13px] ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}

export type SidebarProps = {
  open: boolean;
  onClose: () => void;
  history: string[];
  activeHistory: number;
  onSelectHistory: (index: number) => void;
  onNewQuery: () => void;
  profileName: string;
  profileEmail: string;
  onOpenSettings: () => void;
  /**
   * The operator entry is rendered only for the operator. It is not disabled
   * and not hidden for anyone else: for a regular user the element does not
   * exist in the tree at all (addendum, "Access").
   */
  isOperator?: boolean;
};

export function Sidebar({
  open,
  onClose,
  history,
  activeHistory,
  onSelectHistory,
  onNewQuery,
  profileName,
  profileEmail,
  onOpenSettings,
  isOperator = false,
}: SidebarProps) {
  const { t } = useLanguage();
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <aside
      ref={drawerRef}
      className={[
        'flex h-full flex-col overflow-hidden border-r border-line bg-muted',
        // Below the breakpoint the sidebar is a drawer; the shadow token is the
        // full-viewport scrim, which is why it is the one shadow in the product.
        'fixed inset-y-0 left-0 z-40 w-drawer shadow-drawer',
        open ? 'flex' : 'hidden',
        'shell:static shell:z-auto shell:flex shell:w-sidebar shell:shrink-0 shell:shadow-none',
      ].join(' ')}
    >
      <div className="flex items-center justify-between border-b border-line px-4 pb-3.5 pt-[18px]">
        <div className="flex items-center gap-2.5">
          <BrandSquares size={8} gap="gap-[3px]" />
          <span className="text-[14.5px] font-semibold">{t('brand.name')}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('nav.closeSidebar')}
          className="font-mono text-[13px] text-muted2 hover:text-ink shell:hidden"
        >
          ✕
        </button>
      </div>

      <nav className="flex shrink-0 flex-col gap-0.5 border-b border-line px-2.5 py-3">
        <button type="button" onClick={onNewQuery} className={`${NAV_ITEM} font-medium text-ink`}>
          <Glyph className="text-green">+</Glyph>
          {t('nav.newQuery')}
        </button>

        <div className="flex items-center gap-2.5 px-2.5 pb-1.5 pt-3.5">
          <Glyph className="text-violet">×÷</Glyph>
          <span className="font-mono text-micro uppercase tracking-label text-faint2">
            {t('nav.calculators')}
          </span>
        </div>
        {CALCULATORS.map((key) => (
          <div key={key} className="py-[7px] pl-8 text-base text-muted2">
            {t(key)}
          </div>
        ))}

        <Link href="/about" onClick={onClose} className={NAV_ITEM}>
          <Glyph className="text-faint">§</Glyph>
          {t('nav.about')}
        </Link>

        {isOperator ? (
          <Link href="/dashboard" onClick={onClose} className={NAV_ITEM}>
            <Glyph className="text-faint">◧</Glyph>
            {t('operator.entry')}
          </Link>
        ) : null}
      </nav>

      <div className="flex-1 overflow-y-auto px-2.5 py-3.5">
        <span className="font-mono text-micro uppercase tracking-label text-faint">
          {t('history.label')}
        </span>

        {history.length === 0 ? (
          <div className="mt-2.5 border border-dashed border-lineDash p-3.5">
            <p className="text-base text-muted2">{t('history.emptyTitle')}</p>
            <p className="mt-1 text-base text-muted2">{t('history.emptyBody')}</p>
          </div>
        ) : (
          <ul className="mt-2.5 flex flex-col gap-0.5">
            {history.map((topic, index) => (
              <li key={`${topic}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectHistory(index);
                    onClose();
                  }}
                  aria-current={index === activeHistory ? 'true' : undefined}
                  className={[
                    'w-full truncate border-l-2 px-2.5 py-2 text-left text-base transition-colors',
                    index === activeHistory
                      ? 'border-violet bg-selected font-medium text-ink'
                      : 'border-transparent text-muted2 hover:bg-hover hover:text-ink',
                  ].join(' ')}
                >
                  {topic}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="shrink-0 border-t border-line px-4 py-3">
        <p className="truncate text-[13px] font-medium">{profileName}</p>
        <p className="truncate font-mono text-mini text-faint">{profileEmail}</p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <GhostButton
            type="button"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
          >
            {t('settings.open')}
          </GhostButton>
          <GhostButton type="button" onClick={() => void signOutAction()}>
            {t('nav.signOut')}
          </GhostButton>
        </div>
      </div>
    </aside>
  );
}
