'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, DICTIONARIES } from '@/i18n/dictionaries';
import type { Language, TranslationKey } from '@/types/ui';

/**
 * Holds the active language for the whole tree. Spec section 2.7 forbids
 * browser storage, so nothing is persisted here: on the auth screens the choice
 * lives for the session only, and inside the application the initial value
 * comes from profiles.language through `initialLanguage`.
 *
 * Persisting a change is the caller's job — the settings modal calls
 * updateProfileLanguage and then setLanguage, so the interface updates without
 * a reload.
 */
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const t = useCallback((key: TranslationKey) => DICTIONARIES[language][key], [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
