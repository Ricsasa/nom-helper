import type { Language, TranslationKey } from '@/types/ui';
import esMX from './es-MX';
import enUS from './en-US';

export const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = {
  'es-MX': esMX,
  'en-US': enUS,
};

export const DEFAULT_LANGUAGE: Language = 'es-MX';
