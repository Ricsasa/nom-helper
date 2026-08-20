import { afterEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'crypto';

/**
 * The cookie store of Next.js is the only piece replaced here. Supabase Auth
 * and PostgreSQL are the real local instances, so the assertions cover what
 * @supabase/ssr actually writes.
 */
const cookieJar = new Map<string, { name: string; value: string }>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    getAll: () => [...cookieJar.values()],
    set: (name: string, value: string) => cookieJar.set(name, { name, value }),
  }),
}));

const { signInWithPassword, signUpWithPassword } = await import('../index');
const { getClient } = await import('../../db/client');
const { getProfileById } = await import('../../db/auth');

const PASSWORD = 'Contrasena-segura-123';

function newEmail(): string {
  return `signup-${randomUUID()}@example.test`;
}

async function deleteAuthUserByEmail(email: string): Promise<void> {
  const { data } = await getClient().auth.admin.listUsers({ perPage: 1000 });
  const user = data.users.find((candidate) => candidate.email === email);
  if (user) await getClient().auth.admin.deleteUser(user.id);
}

describe('auth session functions', () => {
  const emails: string[] = [];

  afterEach(async () => {
    while (emails.length) await deleteAuthUserByEmail(emails.pop() as string);
    cookieJar.clear();
  });

  it('signs a user up, creates the profile and writes the session cookie', async () => {
    const email = newEmail();
    emails.push(email);

    const result = await signUpWithPassword(email, PASSWORD, 'Ricardo');

    expect(result).toHaveProperty('profileId');
    const { profileId } = result as { profileId: string };
    expect(await getProfileById(profileId)).toMatchObject({ name: 'Ricardo' });
    expect([...cookieJar.keys()].some((name) => name.includes('auth-token'))).toBe(true);
  });

  it('rejects a weak password', async () => {
    expect(await signUpWithPassword(newEmail(), 'abc', 'Ricardo')).toEqual({
      error: 'weakPassword',
    });
  });

  it('rejects an email that is already registered', async () => {
    const email = newEmail();
    emails.push(email);

    await signUpWithPassword(email, PASSWORD, 'Ricardo');
    expect(await signUpWithPassword(email, PASSWORD, 'Otro')).toEqual({ error: 'emailTaken' });
  });

  it('signs in and resolves the same profile id', async () => {
    const email = newEmail();
    emails.push(email);

    const created = (await signUpWithPassword(email, PASSWORD, 'Ricardo')) as {
      profileId: string;
    };
    cookieJar.clear();

    const result = await signInWithPassword(email, PASSWORD);

    expect(result).toEqual({ profileId: created.profileId });
    expect([...cookieJar.keys()].some((name) => name.includes('auth-token'))).toBe(true);
  });

  it('returns invalidCredentials for a wrong password and an unknown email', async () => {
    const email = newEmail();
    emails.push(email);
    await signUpWithPassword(email, PASSWORD, 'Ricardo');

    expect(await signInWithPassword(email, 'wrong-password')).toEqual({
      error: 'invalidCredentials',
    });
    expect(await signInWithPassword(newEmail(), PASSWORD)).toEqual({
      error: 'invalidCredentials',
    });
  });
});
