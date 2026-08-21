'use server';

import { redirect } from 'next/navigation';
import { signInWithPassword, signUpWithPassword } from '@/lib/auth';
import type { AuthErrorCode } from '@/lib/utils/auth-validation';

/**
 * The seam between the access screens and Supabase Auth. The action layer
 * exists so the forms stay client components without ever importing the auth
 * module, and so the session cookie is written on the server.
 *
 * Only the failure path returns. A success redirects, which never resolves,
 * hence the AuthResult type describing failures alone plus the ok case the
 * caller never observes.
 */
export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode };

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const result = await signInWithPassword(email, password);
  if ('error' in result) return { ok: false, code: result.error };
  redirect('/chat');
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const result = await signUpWithPassword(email, password, name);
  if ('error' in result) return { ok: false, code: result.error };
  redirect('/chat');
}
