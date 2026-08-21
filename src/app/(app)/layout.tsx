import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { LanguageProvider } from '@/components/shared/language-provider';

/**
 * Route protection for the authenticated surface. The check runs in a layout,
 * not in middleware: middleware cannot read the profile row, and every page in
 * this group needs the session anyway. getCurrentSession is memoised per
 * request, so the page below pays nothing for asking again.
 *
 * The provider is nested inside the root one on purpose. The root value serves
 * the auth screens, where no profile exists yet; here profiles.language becomes
 * the initial value for the whole authenticated tree (spec section 5).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  return <LanguageProvider initialLanguage={session.profile.language}>{children}</LanguageProvider>;
}
