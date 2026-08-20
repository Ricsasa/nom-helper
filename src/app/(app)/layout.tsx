import type { ReactNode } from 'react';

/**
 * Layout isolation for the authenticated surface. Route protection belongs here
 * — an unauthenticated visitor must be redirected — but it needs the session
 * helper from src/lib/auth/, which the DB agent has not delivered yet. See
 * src/app/(auth)/actions.ts for the contract this layout will consume.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
