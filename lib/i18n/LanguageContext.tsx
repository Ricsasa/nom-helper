'use client';

import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { Language } from '@/lib/types';
import en from '@/lib/translations/en.json';
import es from '@/lib/translations/es.json';

type Dictionary = Record<string, unknown>;
type Vars = Record<string, string | number>;

const DICTIONARIES: Record<Language, Dictionary> = { en, es };
const STORAGE_KEY = 'language';
const FALLBACK: Language = 'en';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Vars) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolvePath(dictionary: Dictionary, key: string): string | null {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object') return (node as Dictionary)[part];
    return undefined;
  }, dictionary);
  return typeof value === 'string' ? value : null;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.split(`{{${name}}}`).join(String(value)),
    template
  );
}

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'es';
}

function detectLanguage(): Language {
  if (typeof window === 'undefined') return FALLBACK;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLanguage(stored)) return stored;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : FALLBACK;
}

/**
 * The language lives in localStorage, so the provider stays independent of any
 * backend. To persist it per account instead, read the stored value in the
 * effect below from the backend and write it in `setLanguage`.
 *
 * The first render is always FALLBACK: reading localStorage during render would
 * make the server and client markup disagree.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(FALLBACK);

  useEffect(() => {
    setLanguageState(detectLanguage());
  }, []);

  const setLanguage = useCallback((next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const template = resolvePath(DICTIONARIES[language], key);
      return template === null ? key : interpolate(template, vars);
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
