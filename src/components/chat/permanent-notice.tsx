'use client';

import { useLanguage } from '@/components/shared/language-provider';

/**
 * Layer one of the three-layer amber notice: always visible under the composer,
 * never dismissible (design 7.8). The other two layers are the collapsible
 * thread-start notice and the full block on the About page.
 */
export function PermanentNotice() {
  const { t } = useLanguage();

  return (
    <p className="mt-2.5 border border-l-[3px] border-noticeBorder border-l-noticeRule bg-noticeBg px-[11px] py-2 text-sm text-noticeText">
      {t('notice.permanent.text')}{' '}
      <a
        href="/about"
        className="font-medium text-noticeLink underline underline-offset-[3px]"
      >
        {t('notice.permanent.link')}
      </a>
    </p>
  );
}
