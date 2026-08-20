'use client';

import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import type { TranslationKey } from '@/types/ui';

/**
 * Shown while the thread has no messages. The example queries are real
 * NOM-001-SEDE questions, never placeholder text (spec section 7), and each row
 * is a button that fills the composer.
 */
const EXAMPLES: TranslationKey[] = [
  'empty.example1',
  'empty.example2',
  'empty.example3',
  'empty.example4',
  'empty.example5',
];

export function EmptyState({ onPickExample }: { onPickExample: (query: string) => void }) {
  const { t } = useLanguage();

  return (
    <div className="pb-10 pt-14">
      <h2 className="text-3xl font-semibold tracking-tight">{t('empty.title')}</h2>
      <p className="mt-2 max-w-[52ch] text-pretty text-md text-muted2">{t('empty.body')}</p>

      <SectionLabel marker="green" className="mb-2.5 mt-[34px]">
        {t('empty.examplesLabel')}
      </SectionLabel>

      <ul className="border-t border-line">
        {EXAMPLES.map((key, index) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => onPickExample(t(key))}
              className="flex w-full items-baseline gap-3.5 border-b border-line px-2 py-3.5 text-left text-[14px] transition-colors hover:bg-hoverAlt"
            >
              <span className="shrink-0 font-mono text-mini text-violet" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-pretty">{t(key)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
