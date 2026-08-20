'use server';

import type { AuthErrorCode } from '@/lib/utils/auth-validation';

/**
 * The seam between the access screens and Supabase Auth.
 *
 * BLOCKED: `src/lib/auth/` does not exist yet. It is a DB agent deliverable
 * (ORCHESTRATOR, "Shared directories"), and spec sections 2.1 and 2.4 forbid
 * the frontend agent from writing the session logic or a Supabase call itself.
 *
 * When that module lands, delete the throw in each function below and restore
 * the call. Nothing else in the interface has to change — the screens already
 * render every state these results can produce.
 *
 *   import { signInWithPassword, signUpWithPassword } from '@/lib/auth/session';
 *
 * Required contract:
 *   signInWithPassword(email, password)
 *     -> { profileId: string } | { error: 'invalidCredentials' }
 *   signUpWithPassword(email, password, name)
 *     -> { profileId: string } | { error: 'emailTaken' | 'weakPassword' }
 *
 * Both must set the session cookie server-side and resolve the row to a
 * profile_id. The frontend never sees auth_user_id (spec section 2.2).
 */
export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode };

const NOT_WIRED = 'src/lib/auth/ is not available yet — pending the DB agent.';

export async function signIn(_email: string, _password: string): Promise<AuthResult> {
  throw new Error(NOT_WIRED);
}

export async function signUp(
  _name: string,
  _email: string,
  _password: string
): Promise<AuthResult> {
  throw new Error(NOT_WIRED);
}
