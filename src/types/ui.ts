import type esMX from '@/i18n/es-MX';

/** The language codes are the ones stored in profiles.language. */
export type Language = 'es-MX' | 'en-US';

export type TranslationKey = keyof typeof esMX;

/** A form error is always a title plus an actionable help line (design 7.7). */
export type FormError = {
  title: string;
  help: string;
};
