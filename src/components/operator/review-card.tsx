'use client';

import { useEffect, useState } from 'react';
import { readMessage, submitReview } from '@/app/(operator)/dashboard/actions';
import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import type {
  Message,
  ReviewDestination,
  ReviewQueueEntry,
  TechnicalCause,
} from '@/lib/db/types';
import type { TranslationKey } from '@/types/ui';

/**
 * The diagnosis surface for one negatively rated response.
 *
 * Layout rule from the addendum: the operator is comparing the query against
 * the retrieved citations, so those two must be readable together. They sit in
 * two columns above the fold on a wide screen, and each column scrolls inside
 * itself rather than pushing the other one off the screen.
 *
 * The full message is read when the card opens, not with the list. The list is
 * a decision surface — query, reason, age, status — and loading every
 * explanation and every citation for rows nobody opens is work thrown away.
 */

const CAUSES: TechnicalCause[] = [
  'wrong_chunk_retrieved',
  'correct_chunk_wrong_response',
  'content_not_in_corpus',
  'wrong_citation_attribution',
  'no_issue',
];

const DESTINATIONS: ReviewDestination[] = ['add_to_eval_set', 'marked_reviewed', 'discarded'];

export function ReviewCard({
  entry,
  onReviewed,
}: {
  entry: ReviewQueueEntry;
  /** The list owns the status, so a recorded review is reported upwards. */
  onReviewed: (ratingId: string) => void;
}) {
  const { t } = useLanguage();
  const [message, setMessage] = useState<Message | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [cause, setCause] = useState<TechnicalCause | null>(null);
  const [destination, setDestination] = useState<ReviewDestination | null>(null);
  const [pending, setPending] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [done, setDone] = useState(false);

  const messageId = entry.message.id;

  useEffect(() => {
    let live = true;
    setLoadFailed(false);
    readMessage(messageId)
      .then((value) => {
        if (!live) return;
        if (value) setMessage(value);
        else setLoadFailed(true);
      })
      .catch(() => {
        if (live) setLoadFailed(true);
      });
    return () => {
      live = false;
    };
  }, [messageId]);

  async function record() {
    if (!cause || !destination || pending) return;
    setPending(true);
    setSubmitFailed(false);
    const result = await submitReview(entry.id, {
      technical_cause: cause,
      destination,
    });
    setPending(false);
    if (result.ok) {
      setDone(true);
      onReviewed(entry.id);
    } else {
      setSubmitFailed(true);
    }
  }

  return (
    <div className="border-t border-line bg-surface px-3.5 py-3">
      <div className="grid gap-3.5 shell:grid-cols-2">
        <section className="min-w-0">
          <SectionLabel marker="green" className="mb-1.5">
            {t('operator.card.query')}
          </SectionLabel>
          {/* The query is shown in full: it is the object of the review. */}
          <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-base text-ink">
            {entry.message.query}
          </p>

          <SectionLabel className="mb-1.5 mt-3">{t('operator.card.reason')}</SectionLabel>
          <p className="text-sm text-body">{t(reasonKey(entry))}</p>
          <p className="mt-1 text-sm text-muted2">
            {entry.reason_text ? entry.reason_text : t('operator.card.noComment')}
          </p>
        </section>

        <section className="min-w-0">
          <SectionLabel marker="violet" className="mb-1.5">
            {t('operator.card.citations')}
          </SectionLabel>

          {loadFailed ? (
            <p className="text-sm text-ink" role="alert">
              {t('operator.card.loadFailed')}
            </p>
          ) : !message ? (
            <p className="text-sm text-muted2">{t('operator.card.loading')}</p>
          ) : (
            <ul className="max-h-40 overflow-y-auto border border-line">
              {message.citations.map((citation, index) => (
                <li
                  key={`${citation.chapter}-${citation.article}-${citation.page}-${index}`}
                  className="border-b border-lineSoft px-2.5 py-2 last:border-b-0"
                >
                  {/* Citation content is the text of the standard: never translated. */}
                  <p className="font-mono text-mini tracking-ref text-ink">
                    {citation.chapter} · {citation.article} · {citation.page}
                  </p>
                  <p className="mt-1 text-sm leading-[1.5] text-body">{citation.excerpt}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {message ? (
        <section className="mt-3.5 border-t border-lineSoft pt-3">
          <div className="flex items-baseline gap-3">
            <SectionLabel>{t('operator.card.response')}</SectionLabel>
            <span className="font-mono text-mini text-muted2">
              {t('operator.card.confidence')}: {t(CONFIDENCE_KEY[message.confidence_level])}
            </span>
          </div>
          <p className="mt-1.5 text-base font-medium text-ink">{message.summary}</p>
          <p className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap text-sm text-body">
            {message.explanation}
          </p>
        </section>
      ) : null}

      <div className="mt-3.5 grid gap-3.5 border-t border-lineSoft pt-3 shell:grid-cols-2">
        <fieldset className="min-w-0">
          <legend className="mb-1.5 font-mono text-micro uppercase tracking-label text-faint">
            {t('operator.cause.label')}
          </legend>
          <div className="flex flex-col gap-1">
            {CAUSES.map((value) => (
              <Choice
                key={value}
                name={`cause-${entry.id}`}
                label={t(`operator.cause.${value}` as TranslationKey)}
                checked={cause === value}
                disabled={done}
                onChange={() => setCause(value)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-1.5 font-mono text-micro uppercase tracking-label text-faint">
            {t('operator.destination.label')}
          </legend>
          <div className="flex flex-col gap-1">
            {DESTINATIONS.map((value) => (
              <Choice
                key={value}
                name={`destination-${entry.id}`}
                label={t(`operator.destination.${value}` as TranslationKey)}
                checked={destination === value}
                disabled={done}
                onChange={() => setDestination(value)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={record}
          disabled={!cause || !destination || pending || done}
          className="border border-ink px-2.5 py-[5px] text-sm font-medium text-ink transition-colors hover:bg-hover disabled:border-lineGhost disabled:text-faint2"
        >
          {pending ? t('operator.card.submitting') : t('operator.card.submit')}
        </button>

        {done ? (
          <span className="text-mini text-muted2" role="status">
            {t('operator.card.submitted')}
          </span>
        ) : null}

        {submitFailed ? (
          <span className="text-mini text-ink" role="alert">
            {t('operator.card.submitError')}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const CONFIDENCE_KEY = {
  high: 'response.confidence.high',
  medium: 'response.confidence.medium',
  low: 'response.confidence.low',
} as const satisfies Record<string, TranslationKey>;

export function reasonKey(entry: { reason_category: string | null }): TranslationKey {
  return (
    entry.reason_category ? `operator.reason.${entry.reason_category}` : 'operator.reason.none'
  ) as TranslationKey;
}

function Choice({
  name,
  label,
  checked,
  disabled,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-body">
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-[3px] shrink-0 accent-[#16181A]"
      />
      <span>{label}</span>
    </label>
  );
}
