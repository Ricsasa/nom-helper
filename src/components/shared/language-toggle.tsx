'use client';

import { useLanguage } from './language-provider';
import type { Language } from '@/types/ui';

/**
 * Two-option control shown before authentication. No flags, and each language
 * is named in its own language (spec section 5). The choice applies to the
 * current session; it persists only once the user saves it in account settings.
 */
const OPTIONS: ReadonlyArray<{ code: Language; labelKey: 'language.es' | 'language.en' }> = [
  { code: 'es-MX', labelKey: 'language.es' },
  { code: 'en-US', labelKey: 'language.en' },
];

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex border border-line" role="group" aria-label={t('language.selector')}>
      {OPTIONS.map(({ code, labelKey }) => {
        const active = code === language;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={[
              'px-2.5 py-[5px] font-mono text-mini uppercase tracking-label transition-colors',
              active ? 'bg-selected font-medium text-ink' : 'bg-transparent text-faint hover:text-ink',
            ].join(' ')}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
