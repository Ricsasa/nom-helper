import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createProfile, getProfileByAuthUserId } from '../db/auth';

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
