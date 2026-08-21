'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/shared/language-provider';
import { SavedMark, SettingsError } from './settings-primitives';
import type { SettingsErrorCode, SettingsResult } from '@/app/(app)/settings/actions';
import type { Language } from '@/types/ui';

/**
 * The persistent language control (spec section 5). Two options, no flags, each
 * named in its own language — the same rule as the auth toggle, but this one
 * writes profiles.language.
 *
 * Order matters: setLanguage runs only after the write succeeds, and it is what
 * re-renders the whole tree, this modal included, without a reload. Switching
 * the interface first and rolling it back on failure would flicker the copy of
 * the very error message explaining the failure.
 */
const OPTIONS: ReadonlyArray<{ code: Language; labelKey: 'language.es' | 'language.en' }> = [
  { code: 'es-MX', labelKey: 'language.es' },
  { code: 'en-US', labelKey: 'language.en' },
];

export function LanguageSetting({
  onSave,
}: {
  onSave: (language: Language) => Promise<SettingsResult>;
}) {
  const { language, setLanguage, t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<SettingsErrorCode | null>(null);

  async function choose(code: Language) {
    if (code === language) return;
    setError(null);
    const result = await onSave(code);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    setLanguage(code);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium tracking-[0.01em] text-muted2">
          {t('settings.language')}
        </span>
        {saved ? <SavedMark /> : null}
      </div>
      <div className="flex border border-line" role="group" aria-label={t('settings.language')}>
        {OPTIONS.map(({ code, labelKey }) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => choose(code)}
              aria-pressed={active}
              className={[
                'px-2.5 py-[5px] font-mono text-mini uppercase tracking-label transition-colors',
                active
                  ? 'bg-selected font-medium text-ink'
                  : 'bg-transparent text-faint hover:text-ink',
              ].join(' ')}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
      {error ? <SettingsError code={error} /> : null}
    </div>
  );
}
