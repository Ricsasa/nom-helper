'use client';

import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import type { TranslationKey } from '@/types/ui';

/**
 * Layer two of the amber notice: it sits in the flow as the first block of the
 * scroll area, never as a modal, and collapses to a one-line pill. The parent
 * collapses it automatically when the first query is sent (design 7.8).
 */
const PARAGRAPHS: TranslationKey[] = ['notice.thread.p1', 'notice.thread.p2', 'notice.thread.p3'];

const AMBER = 'border border-l-[3px] border-noticeBorder border-l-noticeRule bg-noticeBg';

export function ThreadNotice({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { t } = useLanguage();

  if (!open) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={false}
        className={`${AMBER} flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-noticeBgHov`}
      >
        <span className="truncate font-mono text-sm text-noticeText">
          {t('notice.thread.collapsedRef')}
        </span>
        <span className="shrink-0 font-mono text-mini text-noticeLink">
          {t('notice.thread.expand')}
        </span>
      </button>
    );
  }

  return (
    <section className={`${AMBER} px-[18px] py-4`} aria-label={t('notice.thread.title')}>
      <div className="flex items-center justify-between gap-3">
        <SectionLabel marker="notice">{t('notice.thread.title')}</SectionLabel>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded
          className="shrink-0 font-mono text-mini text-noticeLink hover:underline"
        >
          {t('notice.thread.collapse')}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {PARAGRAPHS.map((key) => (
          <p key={key} className="text-base leading-[1.6] text-body">
            {t(key)}
          </p>
        ))}
      </div>

      <a
        href="/about"
        className="mt-3 inline-block font-medium text-noticeLink underline underline-offset-[3px]"
      >
        {t('notice.thread.link')}
      </a>
    </section>
  );
}
