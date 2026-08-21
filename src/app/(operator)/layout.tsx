import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { LanguageProvider } from '@/components/shared/language-provider';

/**
 * Two gates, and the order matters. An anonymous visitor goes to the access
 * screen; a signed-in user without the operator role goes to the application,
 * not back to login, because sending them to a screen they already passed
 * reads as a broken session rather than a denied permission.
 */
export default async function OperatorLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (session.profile.role !== 'operator') redirect('/chat');

  return <LanguageProvider initialLanguage={session.profile.language}>{children}</LanguageProvider>;
}
