'use client';

import { useState } from 'react';
import { createRating } from '@/lib/db/ratings';
import { useLanguage } from '@/components/shared/language-provider';
import type { ReasonCategory, ResponseRating } from '@/lib/db/types';

/**
 * The rating at the foot of an assistant response (addendum "Response
 * ratings"). It is the entry point of the evaluation set, not a satisfaction
 * meter, so the scale is binary and the diagnostic value comes from the reason
 * step that follows a negative rating.
 *
 * Rules encoded here:
 * - The rating is written on the first click. The reason step is a second,
 *   optional write; skipping it loses nothing.
 * - A positive rating never opens the reason step: friction on the positive
 *   path suppresses use of the whole component.
 * - Reversible. A user who changes their mind clicks the other thumb, and
 *   createRating upserts on message_id instead of adding a row.
 * - Nothing prompts. No modal, no delayed appearance, no reminder.
 */

/**
 * Written from the user's side: they recognise "la cita no corresponde", not
 * "retrieval failure". Never translated (spec section 5), so the labels live
 * here as data and not in the dictionaries.
 */
const REASONS: { category: ReasonCategory; label: string }[] = [
  { category: 'citation_mismatch', label: 'La cita no corresponde a lo que dice la respuesta' },
  { category: 'off_topic', label: 'La respuesta no contesta lo que pregunté' },
  { category: 'missing_info', label: 'Falta información relevante de la norma' },
  { category: 'wrong_interpretation', label: 'La interpretación es incorrecta' },
  { category: 'wrong_reference', label: 'La referencia (capítulo, artículo o página) está mal' },
  { category: 'other', label: 'Otro' },
];

export function RatingControl({
  messageId,
  initialRating = null,
}: {
  messageId: string;
  /** A conversation reopened from history arrives with its rating already set. */
  initialRating?: ResponseRating | null;
}) {
  const { t } = useLanguage();
  const [rating, setRating] = useState<ResponseRating | null>(initialRating);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [failed, setFailed] = useState(false);

  const isPositive = rating?.is_positive === true;
  const isNegative = rating?.is_positive === false;

  async function submit(payload: Parameters<typeof createRating>[1]) {
    setFailed(false);
    try {
      setRating(await createRating(messageId, payload));
      return true;
    } catch {
      setFailed(true);
      return false;
    }
  }

  async function rate(positive: boolean) {
    if (rating?.is_positive === positive) return;
    const ok = await submit({ is_positive: positive });
    // The step opens only on the negative path, and only once the rating is
    // stored: asking for a reason for something that failed to save is noise.
    setReasonOpen(ok && !positive);
  }

  async function chooseReason(category: ReasonCategory) {
    if (category === 'other') return;
    if (await submit({ is_positive: false, reason_category: category })) setReasonOpen(false);
  }

  async function submitOther() {
    const text = otherText.trim();
    if (text === '') return;
    if (await submit({ is_positive: false, reason_category: 'other', reason_text: text })) {
      setReasonOpen(false);
    }
  }

  return (
    <div className="mt-3.5 border-t border-line pt-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-mini text-faint2">{t('rating.label')}</span>

        <ThumbButton
          label={t('rating.up')}
          active={isPositive}
          onClick={() => rate(true)}
          glyph="M4 13h2V6H4v7Zm3 0 3 0c.5 0 .8-.3.9-.7l1-4c.1-.6-.3-1.1-.9-1.1H8.6l.3-1.7c.1-.5-.3-1-.8-1-.3 0-.6.2-.7.5L6.9 6.5A1 1 0 0 0 6.8 7v5.2c0 .1.1.2.2.2Z"
        />
        <ThumbButton
          label={t('rating.down')}
          active={isNegative}
          onClick={() => rate(false)}
          glyph="M4 3h2v7H4V3Zm3 0h3c.5 0 .8.3.9.7l1 4c.1.6-.3 1.1-.9 1.1H8.6l.3 1.7c.1.5-.3 1-.8 1-.3 0-.6-.2-.7-.5L6.9 9.5A1 1 0 0 1 6.8 9V3.2c0-.1.1-.2.2-.2Z"
        />

        {/* Confirmation is a state change and a plain word. No thank-you. */}
        {rating && !failed ? (
          <span className="text-mini text-muted2" role="status">
            {rating.reason_category ? t('rating.reasonSaved') : t('rating.saved')}
          </span>
        ) : null}

        {failed ? (
          <span className="text-mini text-ink" role="alert">
            {t('rating.error')}
          </span>
        ) : null}
      </div>

      {reasonOpen ? (
        <div className="mt-3 border border-line bg-surface p-3.5">
          <p className="font-mono text-micro font-medium uppercase tracking-label text-muted2">
            {t('rating.reasonTitle')}
          </p>

          <ul className="mt-2.5 flex flex-col gap-1.5">
            {REASONS.map((reason) => (
              <li key={reason.category}>
                <button
                  type="button"
                  onClick={() => chooseReason(reason.category)}
                  className="w-full border border-lineGhost px-2.5 py-[7px] text-left text-sm text-body transition-colors hover:border-[#B9BCB8] hover:text-ink"
                >
                  {reason.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-2.5 flex items-center gap-2">
            <input
              aria-label="Otro"
              value={otherText}
              onChange={(event) => setOtherText(event.target.value)}
              className="min-w-0 flex-1 border border-lineInput bg-surface px-[11px] py-[7px] text-[13px] text-ink outline-none transition-colors focus:border-green"
            />
            <button
              type="button"
              onClick={submitOther}
              disabled={otherText.trim() === ''}
              className="border border-lineGhost px-2.5 py-[7px] text-sm text-muted2 transition-colors hover:text-ink disabled:opacity-40"
            >
              {t('rating.send')}
            </button>
          </div>

          {/* The step is optional: leaving it costs the user nothing. */}
          <button
            type="button"
            onClick={() => setReasonOpen(false)}
            className="mt-2.5 font-mono text-mini text-faint underline-offset-2 hover:text-ink"
          >
            {t('rating.skip')}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ThumbButton({
  label,
  active,
  onClick,
  glyph,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  glyph: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`border p-[5px] transition-colors ${
        active ? 'border-ink text-ink' : 'border-lineGhost text-faint hover:border-[#B9BCB8] hover:text-ink'
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d={glyph} />
      </svg>
    </button>
  );
}
