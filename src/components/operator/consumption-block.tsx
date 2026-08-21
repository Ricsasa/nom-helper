'use client';

import { useState } from 'react';
import { revealIdentity } from '@/app/(operator)/dashboard/actions';
import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import {
  NORMAL_COST_THRESHOLD_USD,
  formatUsd,
  isAboveThreshold,
  orderByCost,
  type ProfileConsumption,
} from '@/lib/utils/consumption';
import { pseudonymFor } from '@/lib/utils/pseudonym';
import type { ConsumptionSummary } from '@/lib/db/types';

/**
 * Block 2: what the operation costs. Rows and numbers, no chart — at this
 * volume an ordered table says more than a visualisation (addendum).
 *
 * Two privacy rules are encoded in the render, not in a comment:
 * - The identifier is derived from profile_id on the client. The name never
 *   arrives with the page, so it cannot leak by inspecting the payload.
 * - Revealing is a per-row action that hits the server. It is deliberate, it is
 *   one row at a time, and it does not persist.
 */
export function ConsumptionBlock({
  summary,
  rows,
}: {
  summary: ConsumptionSummary;
  rows: ProfileConsumption[];
}) {
  const { t, language } = useLanguage();
  const ordered = orderByCost(rows);
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [revealing, setRevealing] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  async function reveal(profileId: string) {
    setRevealing(profileId);
    setFailed(null);
    const result = await revealIdentity(profileId);
    setRevealing(null);
    if (result) setRevealed((current) => ({ ...current, [profileId]: result.name }));
    else setFailed(profileId);
  }

  return (
    <section aria-labelledby="consumption-heading" className="border border-line bg-surface">
      <header className="flex flex-wrap items-center gap-x-3.5 gap-y-1 border-b border-line bg-muted px-3.5 py-2.5">
        <SectionLabel marker="violet">
          <span id="consumption-heading">{t('operator.consumption.label')}</span>
        </SectionLabel>
        <span className="font-mono text-mini text-faint">{t('operator.consumption.period')}</span>
        <span className="ml-auto font-mono text-mini text-muted2">
          {t('operator.consumption.threshold').replace(
            '{threshold}',
            formatUsd(NORMAL_COST_THRESHOLD_USD)
          )}
        </span>
      </header>

      <dl className="grid grid-cols-3 divide-x divide-lineSoft border-b border-lineSoft">
        <Total label={t('operator.consumption.totalQueries')} value={String(summary.total_queries)} />
        <Total
          label={t('operator.consumption.totalTokens')}
          value={summary.total_tokens.toLocaleString(language)}
        />
        <Total
          label={t('operator.consumption.totalCost')}
          value={formatUsd(summary.total_cost)}
        />
      </dl>

      {ordered.length === 0 ? (
        <p className="px-3.5 py-6 text-base text-ink">{t('operator.consumption.empty')}</p>
      ) : (
        <>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-lineSoft font-mono text-micro uppercase tracking-label text-faint">
                <th scope="col" className="px-3.5 py-1.5 font-normal">
                  {t('operator.consumption.column.user')}
                </th>
                <th scope="col" className="px-3.5 py-1.5 text-right font-normal">
                  {t('operator.consumption.column.queries')}
                </th>
                <th scope="col" className="px-3.5 py-1.5 text-right font-normal">
                  {t('operator.consumption.column.tokens')}
                </th>
                <th scope="col" className="px-3.5 py-1.5 text-right font-normal">
                  {t('operator.consumption.column.cost')}
                </th>
                <th scope="col" className="px-3.5 py-1.5 font-normal">
                  {t('operator.consumption.column.range')}
                </th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((row) => {
                const above = isAboveThreshold(row);
                const name = revealed[row.profile_id];
                return (
                  <tr key={row.profile_id} className="border-b border-lineSoft last:border-b-0">
                    <td className="px-3.5 py-1.5">
                      <span className="font-mono text-sm text-ink">
                        {pseudonymFor(row.profile_id)}
                      </span>
                      {name ? (
                        <span className="ml-2 text-sm text-body">{name}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => reveal(row.profile_id)}
                          disabled={revealing === row.profile_id}
                          className="ml-2 font-mono text-mini text-muted2 underline-offset-2 hover:text-ink disabled:text-faint2"
                        >
                          {revealing === row.profile_id
                            ? t('operator.consumption.revealing')
                            : t('operator.consumption.reveal')}
                        </button>
                      )}
                      {failed === row.profile_id ? (
                        <span className="ml-2 text-mini text-ink" role="alert">
                          {t('operator.consumption.revealFailed')}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3.5 py-1.5 text-right font-mono text-sm text-body">
                      {row.queries}
                    </td>
                    <td className="px-3.5 py-1.5 text-right font-mono text-sm text-body">
                      {row.tokens.toLocaleString(language)}
                    </td>
                    <td className="px-3.5 py-1.5 text-right font-mono text-sm text-ink">
                      {formatUsd(row.cost)}
                    </td>
                    {/* The out-of-range mark is a word, never a colour alone. */}
                    <td
                      className={`px-3.5 py-1.5 text-mini ${
                        above ? 'font-semibold text-ink' : 'text-muted2'
                      }`}
                    >
                      {t(
                        above ? 'operator.consumption.above' : 'operator.consumption.within'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="border-t border-lineSoft px-3.5 py-2 text-mini text-muted2">
            {t('operator.consumption.pseudonymNote')}
          </p>
        </>
      )}
    </section>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3.5 py-2">
      <dt className="font-mono text-micro uppercase tracking-label text-faint">{label}</dt>
      <dd className="mt-0.5 font-mono text-md text-ink">{value}</dd>
    </div>
  );
}
