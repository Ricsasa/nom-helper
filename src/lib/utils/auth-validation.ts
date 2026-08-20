import type { TranslationKey } from '@/types/ui';

/**
 * Client-side validation for the access screens. The five conditions and their
 * exact copy come from the design handoff, section 7.1. Every message is
 * actionable: it says what is wrong and what to do next.
 *
 * Two of the five conditions can only be decided by the server — a wrong
 * password and an already registered email — so they are represented here as
 * codes and mapped to the same message shape once the call returns.
 */
export type AuthErrorCode =
  | 'missingCredentials'
  | 'invalidCredentials'
  | 'emailTaken'
  | 'weakPassword'
  | 'missingFields';

export type AuthErrorKeys = {
  titleKey: TranslationKey;
  helpKey: TranslationKey;
};

export function authErrorKeys(code: AuthErrorCode): AuthErrorKeys {
  return {
    titleKey: `auth.error.${code}.title` as TranslationKey,
    helpKey: `auth.error.${code}.help` as TranslationKey,
  };
}

/** The rule is fixed by the design: 8 characters or more, and at least one digit. */
export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[0-9]/.test(password);
}

export function validateLogin(fields: { email: string; password: string }): AuthErrorCode | null {
  if (!fields.email.trim() || !fields.password) return 'missingCredentials';
  return null;
}

/**
 * Empty fields are reported before a weak password: a user who has not finished
 * filling the form should not be told their password is wrong.
 */
export function validateRegister(fields: {
  name: string;
  email: string;
  password: string;
}): AuthErrorCode | null {
  if (!fields.name.trim() || !fields.email.trim()) return 'missingFields';
  if (!isStrongPassword(fields.password)) return 'weakPassword';
  return null;
}
