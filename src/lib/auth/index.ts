import { cache } from 'react';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createProfile, getProfileByAuthUserId } from '../db/auth';
import type { Profile } from '../db/types';

/**
 * Session entry point. Supabase Auth owns the credentials, this module owns
 * the translation of an auth user into a profile_id. Nothing outside this
 * directory ever sees auth_user_id.
 */

export type SignInError = 'invalidCredentials';
export type SignUpError = 'emailTaken' | 'weakPassword';

export type AuthResult<E extends string> = { profileId: string } | { error: E };

/**
 * Anon-key client bound to the request cookies. @supabase/ssr writes the
 * session cookie through setAll, which is why the session survives the
 * response without any client-side step.
 */
async function getAuthClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        // A Server Component cannot write cookies. Middleware or a Server
        // Action refreshes them instead, so the throw is not an error here.
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          /* read-only cookie store */
        }
      },
    },
  });
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult<SignInError>> {
  const { data, error } = await (await getAuthClient()).auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'invalidCredentials' };

  const profile = await getProfileByAuthUserId(data.user.id);
  // An auth user without a profile means the two stores drifted apart. That is
  // a defect, not a credential problem, so it must not look like one.
  if (!profile) throw new Error(`No profile for auth user ${data.user.id}`);
  return { profileId: profile.id };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  name: string
): Promise<AuthResult<SignUpError>> {
  const { data, error } = await (await getAuthClient()).auth.signUp({ email, password });

  if (error) {
    if (error.code === 'weak_password' || /password/i.test(error.message)) {
      return { error: 'weakPassword' };
    }
    if (error.code === 'user_already_exists') return { error: 'emailTaken' };
    throw new Error(error.message);
  }
  if (!data.user) throw new Error('Sign up returned no user');

  // Supabase returns an obfuscated user with no identities when the email is
  // already registered, instead of an error, to avoid leaking the account.
  if (data.user.identities?.length === 0) return { error: 'emailTaken' };

  const existing = await getProfileByAuthUserId(data.user.id);
  const profile = existing ?? (await createProfile(data.user.id, name));
  return { profileId: profile.id };
}

/**
 * The current session, resolved to a profile row. Returns null when nobody is
 * signed in, so a caller decides for itself whether that is a redirect or an
 * empty state.
 *
 * The email comes from the auth user, not from profiles: profiles does not
 * store it. auth_user_id stops here, exactly as it does in the two functions
 * above.
 *
 * Wrapped in React cache so the (app) layout and the page it renders share one
 * round trip per request.
 */
export const getCurrentSession = cache(
  async (): Promise<{ profile: Profile; email: string } | null> => {
    const { data, error } = await (await getAuthClient()).auth.getUser();
    if (error || !data.user) return null;

    const profile = await getProfileByAuthUserId(data.user.id);
    if (!profile) return null;
    return { profile, email: data.user.email ?? '' };
  }
);

export type UpdateEmailError = 'emailTaken' | 'saveFailed';
export type UpdatePasswordError = 'invalidCredentials' | 'weakPassword' | 'saveFailed';

/**
 * Changing the address of the current account. profiles does not store an
 * email, so this is an auth-only write and nothing in the public schema moves.
 *
 * Supabase may hold the new address as pending until it is confirmed. The
 * interface reports the change as saved either way, because from the user's
 * side the request did succeed.
 */
export async function updateEmail(email: string): Promise<{ ok: true } | { error: UpdateEmailError }> {
  const { error } = await (await getAuthClient()).auth.updateUser({ email });
  if (!error) return { ok: true };
  if (error.code === 'email_exists' || error.code === 'user_already_exists') {
    return { error: 'emailTaken' };
  }
  return { error: 'saveFailed' };
}

/**
 * updateUser does not ask for the current password, so it alone would let
 * anyone with an open session change the credentials. Re-authenticating first
 * is what makes the current-password field mean something.
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { error: UpdatePasswordError }> {
  const client = await getAuthClient();
  const { data } = await client.auth.getUser();
  if (!data.user?.email) return { error: 'saveFailed' };

  const reauth = await client.auth.signInWithPassword({
    email: data.user.email,
    password: currentPassword,
  });
  if (reauth.error) return { error: 'invalidCredentials' };

  const { error } = await client.auth.updateUser({ password: newPassword });
  if (!error) return { ok: true };
  if (error.code === 'weak_password' || /password/i.test(error.message)) {
    return { error: 'weakPassword' };
  }
  return { error: 'saveFailed' };
}

/** Ends the session. Used after the account row is deleted. */
export async function signOut(): Promise<void> {
  await (await getAuthClient()).auth.signOut();
}
