'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import type { Citation, ConfidenceLevel, Message } from '@/lib/db/types';
import type { TranslationKey } from '@/types/ui';

/**
 * The structured answer, with one slot per field of the response contract:
 * summary, explanation, citations, confidence level and the insufficient
 * information flag (spec section 9). It renders a Message it is given and
 * fetches nothing.
 *
 * The insufficient case is not an error state and not a variant of the normal
 * one: it is a framed block with its own header, because the answer that is
 * missing is the point of the message (design 7.10).
 */

const CONFIDENCE_KEY: Record<ConfidenceLevel, TranslationKey> = {
  high: 'response.confidence.high',
  medium: 'response.confidence.medium',
  low: 'response.confidence.low',
};

const FILLED_BARS: Record<ConfidenceLevel, number> = { high: 3, medium: 2, low: 1 };

export function ResponseAnatomy({ message }: { message: Message }) {
  const { t } = useLanguage();

  if (message.insufficient_info) {
    return (
      <section
        aria-label={t('response.insufficient')}
        data-insufficient="true"
        className="border border-lineFirm bg-surface"
      >
        <header className="flex items-center gap-2.5 border-b border-line bg-hoverAlt px-4 py-[11px]">
          <span className="h-[7px] w-[7px] shrink-0 border-[1.5px] border-ink" aria-hidden="true" />
          <span className="font-mono text-micro font-medium uppercase tracking-label text-ink">
            {t('response.insufficient')}
          </span>
        </header>

        <div className="p-4">
          <p className="text-lg text-ink">{message.summary}</p>
          <p className="mt-2.5 text-base text-muted2">{message.explanation}</p>
        </div>
      </section>
    );
  }

  return (
    <article data-insufficient="false">
      <SectionLabel marker="green" className="mb-3">
        {t('response.summary')}
      </SectionLabel>
      <p className="border-l-2 border-ink pl-3.5 text-xl font-medium tracking-[-0.008em] text-ink">
        {message.summary}
      </p>

      <section className="mt-[26px]">
        <SectionLabel className="mb-2.5 pl-[15px]">{t('response.explanation')}</SectionLabel>
        <div className="flex flex-col gap-3 pl-[15px]">
          {message.explanation
            .split('\n')
            .filter((paragraph) => paragraph.trim() !== '')
            .map((paragraph) => (
              <p key={paragraph} className="text-md leading-[1.62] text-body">
                {paragraph}
              </p>
            ))}
        </div>
      </section>

      <section className="mt-7 pl-[15px]">
        <div className="mb-2.5 flex items-baseline justify-between">
          <SectionLabel>{t('response.citations')}</SectionLabel>
          <span className="font-mono text-mini text-faint2">
            {message.citations.length}{' '}
            {t(message.citations.length === 1 ? 'response.citation' : 'response.citationsCount')}
          </span>
        </div>

        <ul className="border border-line bg-surface">
          {message.citations.map((citation, index) => (
            <CitationRow
              key={`${citation.chapter}-${citation.article}-${citation.page}`}
              citation={citation}
              index={index}
              isLast={index === message.citations.length - 1}
            />
          ))}
        </ul>

        <ConfidenceMeter level={message.confidence_level} />
      </section>
    </article>
  );
}

/**
 * Each citation opens in place. Keeping the open flag inside the row means the
 * component has no list-wide state to reconcile and several citations can stay
 * open at once, which is what a reader comparing two articles wants.
 */
function CitationRow({
  citation,
  index,
  isLast,
}: {
  citation: Citation;
  index: number;
  isLast: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const mark = String(index + 1).padStart(2, '0');

  return (
    <li className={isLast ? '' : 'border-b border-lineSoft'}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-baseline gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted"
      >
        <span className="shrink-0 pt-px font-mono text-mini text-violet" aria-hidden="true">
          {mark}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-sm tracking-ref text-ink">
            {citation.chapter} · {citation.article}
          </span>
        </span>
        <span className="shrink-0 font-mono text-mini text-faint">
          {open ? t('response.hideText') : t('response.seeText')}
        </span>
      </button>

      {open ? (
        <div className="pb-3.5 pl-10 pr-3.5">
          {/* Citation content is the text of the standard: never translated. */}
          <blockquote className="border-l-2 border-violet bg-muted px-3 py-[11px] text-base leading-[1.6] text-body">
            {citation.excerpt}
          </blockquote>
          <p className="mt-[7px] font-mono text-mini text-faint">{citation.page}</p>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Three bars plus the written level. The bars alone would make the reading
 * depend on shape and contrast only; the label is what carries the meaning, so
 * the signal survives for a user who cannot resolve the bars (spec section 7).
 */
function ConfidenceMeter({ level }: { level: ConfidenceLevel }) {
  const { t } = useLanguage();
  const filled = FILLED_BARS[level];
  const label = t(CONFIDENCE_KEY[level]);

  return (
    <div className="mt-3.5 flex items-center gap-3 border-t border-line pt-3">
      <SectionLabel>{t('response.confidence')}</SectionLabel>
      <div className="flex items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((slot) => (
          <span
            key={slot}
            className={`h-[7px] w-[14px] border ${
              slot < filled ? 'border-ink bg-ink' : 'border-barEmpty bg-transparent'
            }`}
          />
        ))}
      </div>
      <span className="text-[13px] font-semibold tracking-ref text-ink">{label}</span>
    </div>
  );
}
