'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/components/shared/language-provider';
import type { SettingsErrorCode } from '@/app/(app)/settings/actions';
import type { TranslationKey } from '@/types/ui';

/**
 * The parts every block of the modal repeats: a titled section, an inline
 * error, and the discreet confirmation that follows a save. They live in one
 * file because none of them is useful on its own outside this modal.
 */
export function SettingsSection({
  titleKey,
  children,
  separated = false,
}: {
  titleKey: TranslationKey;
  children: ReactNode;
  separated?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <section
      className={
        separated
          ? 'border-t border-line px-5 pb-5 pt-6 sm:px-6'
          : 'border-t border-line px-5 py-5 sm:px-6'
      }
    >
      <h3 className="font-mono text-micro uppercase tracking-label text-faint2">{t(titleKey)}</h3>
      <div className="mt-3.5 flex flex-col gap-4">{children}</div>
    </section>
  );
}

/**
 * Error copy is keyed by the code the server action returns, so a new failure
 * needs two dictionary entries and no branching here (spec section 10 of the
 * addendum: what happened, and how to resolve it).
 */
export function SettingsError({ code }: { code: SettingsErrorCode }) {
  const { t } = useLanguage();
  return (
    <p role="alert" className="border-l-2 border-ink pl-2.5 text-sm text-ink">
      <span className="font-medium">{t(`settings.error.${code}.title` as TranslationKey)}</span>{' '}
      <span className="text-muted2">{t(`settings.error.${code}.help` as TranslationKey)}</span>
    </p>
  );
}

/** Save confirmation. No colour, no celebration: a word and a rule (addendum). */
export function SavedMark({ labelKey = 'settings.saved' }: { labelKey?: TranslationKey }) {
  const { t } = useLanguage();
  return (
    <span role="status" className="font-mono text-mini uppercase tracking-label text-faint">
      {t(labelKey)}
    </span>
  );
}
