import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import type { Profile, ProfileRole } from '@/lib/db/types';

/**
 * The layouts are async server components, so the test calls them as functions
 * instead of rendering them. What matters is the control flow: who is sent
 * away, and where.
 *
 * The real redirect throws to stop the render. The mock keeps that behaviour,
 * because a layout that kept going after a redirect would be a defect the test
 * has to be able to see.
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

vi.mock('next/navigation', () => ({ redirect: (to: string) => redirect(to) }));
vi.mock('@/lib/auth', () => ({ getCurrentSession: () => getCurrentSession() }));

const { default: AppLayout } = await import('@/app/(app)/layout');
const { default: OperatorLayout } = await import('@/app/(operator)/layout');

function buildSession(role: ProfileRole) {
  const profile: Profile = {
    id: 'profile-1',
    auth_user_id: 'auth-1',
    name: 'Ing. Ramiro Martínez',
    role,
    language: 'es-MX',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };
  return { profile, email: 'rmartinez@iepsa.mx' };
}

async function destinationOf(layout: (props: { children: ReactNode }) => Promise<unknown>) {
  try {
    await layout({ children: null });
  } catch (error) {
    if (error instanceof RedirectSignal) return error.destination;
    throw error;
  }
  return null;
}

beforeEach(() => {
  redirect.mockClear();
  getCurrentSession.mockReset();
});

describe('(app) route protection', () => {
  it('redirects an unauthenticated visitor to the access screen', async () => {
    getCurrentSession.mockResolvedValue(null);

    expect(await destinationOf(AppLayout)).toBe('/login');
  });

  it('lets an authenticated user through', async () => {
    getCurrentSession.mockResolvedValue(buildSession('user'));

    expect(await destinationOf(AppLayout)).toBeNull();
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe('(operator) route protection', () => {
  it('redirects an unauthenticated visitor to the access screen', async () => {
    getCurrentSession.mockResolvedValue(null);

    expect(await destinationOf(OperatorLayout)).toBe('/login');
  });

  it('sends a signed-in user without the operator role back to the application', async () => {
    getCurrentSession.mockResolvedValue(buildSession('user'));

    expect(await destinationOf(OperatorLayout)).toBe('/chat');
  });

  it('lets an operator through', async () => {
    getCurrentSession.mockResolvedValue(buildSession('operator'));

    expect(await destinationOf(OperatorLayout)).toBeNull();
    expect(redirect).not.toHaveBeenCalled();
  });
});
