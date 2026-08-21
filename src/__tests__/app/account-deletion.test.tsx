import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

/**
 * Deleting the account is the one settings action that changes what the user is
 * allowed to reach. Two things have to hold: the action itself ends the session
 * and sends the browser to the access screen, and the authenticated layout
 * refuses the next navigation because the profile row is gone.
 *
 * Same technique as route-protection.test.tsx: the redirect mock throws, so a
 * layout or an action that kept running after redirecting would be visible.
 */
class RedirectSignal extends Error {
  constructor(readonly destination: string) {
    super(`redirect:${destination}`);
  }
}

const redirect = vi.fn((destination: string) => {
  throw new RedirectSignal(destination);
});
const getCurrentSession = vi.fn();
const signOut = vi.fn(async () => {});
const deleteProfile = vi.fn(async (_profileId: string) => true);

vi.mock('next/navigation', () => ({ redirect: (to: string) => redirect(to) }));
vi.mock('@/lib/auth', () => ({
  getCurrentSession: () => getCurrentSession(),
  signOut: () => signOut(),
  updateEmail: vi.fn(),
  updatePassword: vi.fn(),
}));
vi.mock('@/lib/db/auth', () => ({
  deleteProfile: (id: string) => deleteProfile(id),
  updateProfileName: vi.fn(),
  updateProfileLanguage: vi.fn(),
}));
vi.mock('@/lib/db/conversations', () => ({ deleteAllConversationsByProfile: vi.fn() }));
vi.mock('@/lib/db/rate-limiting', () => ({ getQuotaStatus: vi.fn() }));

const { deleteAccount } = await import('@/app/(app)/settings/actions');
const { default: AppLayout } = await import('@/app/(app)/layout');

const session = {
  profile: {
    id: 'profile-1',
    auth_user_id: 'auth-1',
    name: 'Ing. Ramiro Martínez',
    role: 'user' as const,
    language: 'es-MX' as const,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  email: 'rmartinez@iepsa.mx',
};

async function destinationOf(run: () => Promise<unknown>) {
  try {
    await run();
  } catch (error) {
    if (error instanceof RedirectSignal) return error.destination;
    throw error;
  }
  return null;
}

beforeEach(() => {
  vi.clearAllMocks();
  redirect.mockImplementation((destination: string) => {
    throw new RedirectSignal(destination);
  });
  deleteProfile.mockResolvedValue(true);
});

describe('account deletion', () => {
  it('deletes the profile of the session, never an id sent by the browser', async () => {
    getCurrentSession.mockResolvedValue(session);

    await destinationOf(() => deleteAccount());

    expect(deleteProfile).toHaveBeenCalledWith('profile-1');
  });

  it('ends the session and sends the browser to the access screen', async () => {
    getCurrentSession.mockResolvedValue(session);

    expect(await destinationOf(() => deleteAccount())).toBe('/login');
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('keeps the session when the row was not deleted', async () => {
    getCurrentSession.mockResolvedValue(session);
    deleteProfile.mockResolvedValue(false);

    const result = await deleteAccount();

    expect(result).toEqual({ ok: false, code: 'saveFailed' });
    expect(signOut).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('refuses the authenticated routes once the profile is gone', async () => {
    getCurrentSession.mockResolvedValue(null);

    expect(await destinationOf(() => AppLayout({ children: null as ReactNode }))).toBe('/login');
  });

  it('refuses a settings action once the profile is gone', async () => {
    getCurrentSession.mockResolvedValue(null);

    expect(await destinationOf(() => deleteAccount())).toBe('/login');
    expect(deleteProfile).not.toHaveBeenCalled();
  });
});
