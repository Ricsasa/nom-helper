'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/shared/language-provider';
import type { QuotaStatus } from '@/lib/db/types';

/**
 * Read-only, no controls (addendum). It repeats the sidebar indicator on
 * purpose, with the reset time the indicator has no room for: this is where a
 * user comes to understand the limit once it catches their attention.
 *
 * The read runs when the modal opens rather than on page load, so the number is
 * current at the moment it is looked at.
 */
export function UsageBlock({ read }: { read: () => Promise<QuotaStatus> }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<QuotaStatus | null>(null);

  useEffect(() => {
    let live = true;
    read().then((value) => {
      if (live) setStatus(value);
    });
    return () => {
      live = false;
    };
  }, [read]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium tracking-[0.01em] text-muted2">
          {t('settings.usage.today')}
        </span>
        <span className="font-mono text-base text-ink">
          {status
            ? t('settings.usage.count')
                .replace('{used}', String(status.used))
                .replace('{limit}', String(status.limit))
            : t('settings.usage.loading')}
        </span>
      </div>
      <p className="text-sm text-muted2">{t('settings.usage.reset')}</p>
    </div>
  );
}
