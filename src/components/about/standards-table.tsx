'use client';

import { useLanguage } from '@/components/shared/language-provider';
import {
  formatStandardDate,
  STATUS_KEY,
  type LoadedStandard,
} from '@/lib/utils/standards';
import type { TranslationKey } from '@/types/ui';

/**
 * One row per loaded document, rendered from the catalogue it is given. The
 * component knows nothing about which standards exist: a new version, or a
 * second version coexisting with the one in effect, is a data change only
 * (addendum, section 2).
 *
 * The status of a row is never carried by colour alone. A row that is not in
 * effect changes its background, its marker outline and its label weight, and
 * the label itself spells the status out.
 */
const FIELD_LABEL: TranslationKey[] = [
  'about.standards.field.version',
  'about.standards.field.publication',
  'about.standards.field.loaded',
];

export function StandardsTable({ standards }: { standards: LoadedStandard[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="border border-line bg-surface">
      {standards.map((standard, index) => {
        const current = standard.status === 'current';
        const values = [
          standard.version,
          `${formatStandardDate(standard.publishedOn, language)} · ${standard.publisher}`,
          formatStandardDate(standard.loadedOn, language),
        ];

        return (
          <div
            key={standard.code}
            data-status={standard.status}
            className={[
              'p-[18px]',
              index === standards.length - 1 ? '' : 'border-b border-lineSoft',
              current ? '' : 'bg-subtle',
            ].join(' ')}
          >
            <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
              <span className="font-mono text-base font-medium tracking-ref">{standard.code}</span>
              <span className="ml-auto flex items-center gap-[7px]">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 ${current ? 'bg-ink' : 'border-[1.5px] border-faint2'}`}
                />
                <span
                  className={[
                    'font-mono text-mini uppercase tracking-[0.07em]',
                    current ? 'font-medium text-ink' : 'text-faint',
                  ].join(' ')}
                >
                  {t(STATUS_KEY[standard.status])}
                </span>
              </span>
            </div>

            <p className="mt-[5px] text-md text-body">{standard.name}</p>

            {standard.noteKey ? (
              <p className="mt-1.5 text-base text-muted2">{t(standard.noteKey)}</p>
            ) : null}

            <dl className="mt-3.5 flex flex-wrap gap-x-7 gap-y-2">
              {FIELD_LABEL.map((label, field) => (
                <div key={label}>
                  <dt className="font-mono text-[10px] uppercase tracking-label text-faint2">
                    {t(label)}
                  </dt>
                  <dd className="mt-[3px] font-mono text-sm text-ink">{values[field]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
