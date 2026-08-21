'use server';

import { redirect } from 'next/navigation';
import {
  getCurrentSession,
  signOut,
  updateEmail,
  updatePassword,
} from '@/lib/auth';
import { updateProfileLanguage, updateProfileName, deleteProfile } from '@/lib/db/auth';
import { deleteAllConversationsByProfile } from '@/lib/db/conversations';
import { getQuotaStatus } from '@/lib/db/rate-limiting';
import type { Language } from '@/types/ui';
import type { QuotaStatus } from '@/lib/db/types';

/**
 * The seam between the settings modal and the data layer. The modal is a client
 * component, so it never imports @/lib/db or @/lib/auth: it calls these
 * actions, which resolve the session on the server and pass profile_id down.
 *
 * Every action resolves the profile itself instead of trusting an id sent by
 * the browser. An id in a request body is user input; the session cookie is not.
 */
export type SettingsErrorCode =
  | 'saveFailed'
  | 'emailTaken'
  | 'invalidCredentials'
  | 'weakPassword'
  | 'missingFields'
  | 'passwordMismatch';

export type SettingsResult = { ok: true } | { ok: false; code: SettingsErrorCode };

async function requireProfileId(): Promise<string> {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  return session.profile.id;
}

export async function saveDisplayName(name: string): Promise<SettingsResult> {
  if (!name.trim()) return { ok: false, code: 'missingFields' };
  const profile = await updateProfileName(await requireProfileId(), name.trim());
  return profile ? { ok: true } : { ok: false, code: 'saveFailed' };
}

export async function saveLanguage(language: Language): Promise<SettingsResult> {
  const profile = await updateProfileLanguage(await requireProfileId(), language);
  return profile ? { ok: true } : { ok: false, code: 'saveFailed' };
}

export async function saveEmail(email: string): Promise<SettingsResult> {
  if (!email.trim()) return { ok: false, code: 'missingFields' };
  await requireProfileId();
  const result = await updateEmail(email.trim());
  return 'ok' in result ? { ok: true } : { ok: false, code: result.error };
}

export async function savePassword(
  currentPassword: string,
  newPassword: string,
  confirmation: string
): Promise<SettingsResult> {
  if (!currentPassword || !newPassword) return { ok: false, code: 'missingFields' };
  if (newPassword !== confirmation) return { ok: false, code: 'passwordMismatch' };
  await requireProfileId();
  const result = await updatePassword(currentPassword, newPassword);
  return 'ok' in result ? { ok: true } : { ok: false, code: result.error };
}

export async function readQuotaStatus(): Promise<QuotaStatus> {
  return getQuotaStatus(await requireProfileId());
}

export async function deleteConversationHistory(): Promise<SettingsResult> {
  await deleteAllConversationsByProfile(await requireProfileId());
  return { ok: true };
}

/**
 * Deleting the profile row is the point of no return. The session is dropped
 * immediately afterwards, so the (app) layout sends the next navigation to the
 * access screen instead of leaving a signed-in shell pointing at a profile that
 * no longer exists.
 */
export async function deleteAccount(): Promise<SettingsResult> {
  const deleted = await deleteProfile(await requireProfileId());
  if (!deleted) return { ok: false, code: 'saveFailed' };
  await signOut();
  redirect('/login');
}

/**
 * Ends the session from the sidebar. The redirect is what makes the button
 * final: without it the client would keep rendering a shell whose session
 * cookie is already gone.
 */
export async function signOutAction(): Promise<void> {
  await signOut();
  redirect('/login');
}
