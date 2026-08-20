'use client';

import type { FormEvent } from 'react';
import { PermanentNotice } from './permanent-notice';
import { useLanguage } from '@/components/shared/language-provider';

/**
 * Enter submits, and the button is visibly disabled while the input is empty
 * (design 7.5). The disabled treatment is a fill change, not a colour-coded
 * state: the label loses contrast and the cursor stops being a pointer.
 */
export function Composer({
  draft,
  onDraftChange,
  onSubmit,
}: {
  draft: string;
  onDraftChange: (draft: string) => void;
  onSubmit: (query: string) => void;
}) {
  const { t } = useLanguage();
  const empty = draft.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (empty) return;
    onSubmit(draft.trim());
  }

  return (
    <div className="shrink-0 border-t border-line px-5 pb-4 pt-3.5">
      <div className="mx-auto max-w-thread">
        <form onSubmit={handleSubmit} className="flex items-stretch border border-lineInput bg-surface">
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={t('composer.placeholder')}
            aria-label={t('composer.placeholder')}
            className="min-w-0 flex-1 border-none px-3.5 py-3 text-md outline-none"
          />
          <button
            type="submit"
            disabled={empty}
            className={[
              'px-[18px] text-[14px] font-medium transition-colors',
              empty ? 'cursor-default bg-line text-faint2' : 'cursor-pointer bg-ink text-white hover:bg-green',
            ].join(' ')}
          >
            {t('composer.submit')}
          </button>
        </form>

        <PermanentNotice />
      </div>
    </div>
  );
}
