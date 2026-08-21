'use client';

import { useMemo, useState } from 'react';
import { ReviewCard, reasonKey } from './review-card';
import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import { ALL_FILTERS, visibleQueue, type QueueFilters } from '@/lib/utils/review-queue';
import type { ReasonCategory, ReviewQueueEntry, ReviewStatus } from '@/lib/db/types';
import type { TranslationKey } from '@/types/ui';

/**
 * Block 1 of the operator module: the list of negatively rated responses.
 *
 * The list is dense on purpose (addendum, "Visual direction"). One row per
 * rating, four columns, no card chrome — the operator scans it, they do not
 * read it.
 *
 * A recorded review does not remove the row. It changes the status in place, so
 * the item stays queryable through the status filter instead of vanishing and
 * leaving the operator unsure whether the write landed.
 */

const CATEGORIES: ReasonCategory[] = [
  'citation_mismatch',
  'off_topic',
  'missing_info',
  'wrong_interpretation',
  'wrong_reference',
  'other',
];

const STATUSES: ReviewStatus[] = ['pending', 'reviewed', 'discarded', 'not_applicable'];

export function ReviewQueue({ entries }: { entries: ReviewQueueEntry[] }) {
  const { t, language } = useLanguage();
  const [rows, setRows] = useState(entries);
  const [filters, setFilters] = useState<QueueFilters>(ALL_FILTERS);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => visibleQueue(rows, filters), [rows, filters]);
  const filtering = filters.category !== 'all' || filters.status !== 'all';

  function markReviewed(ratingId: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === ratingId ? { ...row, review_status: 'reviewed' as ReviewStatus } : row
      )
    );
  }

  return (
    <section aria-labelledby="review-queue-heading" className="border border-line bg-surface">
      <header className="flex flex-wrap items-center gap-x-3.5 gap-y-2 border-b border-line bg-muted px-3.5 py-2.5">
        <SectionLabel marker="green">
          <span id="review-queue-heading">{t('operator.queue.label')}</span>
        </SectionLabel>
        <span className="font-mono text-mini text-faint">
          {t('operator.queue.count').replace('{count}', String(visible.length))}
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <Filter
            label={t('operator.queue.filter.category')}
            value={filters.category}
            options={CATEGORIES.map((value) => ({
              value,
              label: t(`operator.reason.${value}` as TranslationKey),
            }))}
            allLabel={t('operator.filter.all')}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                category: value as QueueFilters['category'],
              }))
            }
          />
          <Filter
            label={t('operator.queue.filter.status')}
            value={filters.status}
            options={STATUSES.map((value) => ({
              value,
              label: t(`operator.status.${value}` as TranslationKey),
            }))}
            allLabel={t('operator.filter.all')}
            onChange={(value) =>
              setFilters((current) => ({ ...current, status: value as QueueFilters['status'] }))
            }
          />
        </div>
      </header>

      {visible.length === 0 ? (
        // A neutral fact, not a congratulation (addendum). Empty is normal.
        <div className="px-3.5 py-6">
          <p className="text-base text-ink">
            {t(filtering ? 'operator.queue.emptyFiltered.title' : 'operator.queue.empty.title')}
          </p>
          <p className="mt-1 max-w-doc text-sm text-muted2">
            {t(filtering ? 'operator.queue.emptyFiltered.body' : 'operator.queue.empty.body')}
          </p>
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="hidden grid-cols-[1fr_15rem_7rem_7rem_4rem] gap-3 border-b border-lineSoft px-3.5 py-1.5 font-mono text-micro uppercase tracking-label text-faint shell:grid"
          >
            <span>{t('operator.queue.column.query')}</span>
            <span>{t('operator.queue.column.reason')}</span>
            <span>{t('operator.queue.column.when')}</span>
            <span>{t('operator.queue.column.status')}</span>
            <span />
          </div>

          <ul aria-label={t('operator.queue.label')}>
            {visible.map((entry) => {
              const open = openId === entry.id;
              return (
                <li key={entry.id} className="border-b border-lineSoft last:border-b-0">
                  <div className="grid grid-cols-1 gap-1 px-3.5 py-2 shell:grid-cols-[1fr_15rem_7rem_7rem_4rem] shell:items-baseline shell:gap-3">
                    <span className="truncate text-base text-ink">{entry.message.query}</span>
                    <span className="truncate text-sm text-muted2">{t(reasonKey(entry))}</span>
                    <span className="font-mono text-mini text-faint">
                      {formatDate(entry.created_at, language)}
                    </span>
                    <span
                      className={`text-mini ${
                        entry.review_status === 'pending'
                          ? 'font-semibold text-ink'
                          : 'text-muted2'
                      }`}
                    >
                      {t(`operator.status.${entry.review_status}` as TranslationKey)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : entry.id)}
                      aria-expanded={open}
                      className="justify-self-start font-mono text-mini text-muted2 underline-offset-2 hover:text-ink shell:justify-self-end"
                    >
                      {open ? t('operator.queue.close') : t('operator.queue.open')}
                    </button>
                  </div>

                  {open ? <ReviewCard entry={entry} onReviewed={markReviewed} /> : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

function formatDate(iso: string, language: string): string {
  return new Date(iso).toLocaleDateString(language, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

function Filter({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 font-mono text-mini text-muted2">
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-[13rem] border border-lineInput bg-surface px-1.5 py-[3px] font-sans text-sm text-ink outline-none focus:border-green"
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
