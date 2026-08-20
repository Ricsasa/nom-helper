'use client';

import { useLanguage } from './language-provider';

/**
 * A layout row, not a floating element. It sits on every screen, pinned to the
 * bottom of the window and crossing both sidebar and content (design 7.6).
 *
 * The heart is the only emoji in the product. Do not introduce another.
 */
export function FooterStrip() {
  const { t } = useLanguage();

  return (
    <footer className="flex shrink-0 items-center justify-center gap-1.5 border-t border-line bg-muted px-5 py-[7px] text-xs tracking-[0.01em] text-faint">
      <span>{t('footer.madeWith')}</span>
      <span className="text-mini text-ink">🖤</span>
      <span>{t('footer.by')}</span>
      <a
        href="https://rs-studio.dev"
        className="font-medium text-muted2 no-underline hover:text-ink hover:underline"
      >
        rs-studio.dev
      </a>
    </footer>
  );
}
