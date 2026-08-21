import { AppShell } from '@/components/layout/app-shell';
import { getCurrentSession } from '@/lib/auth';

/**
 * A server component reads the session and hands the shell plain props. The
 * layout above has already redirected an anonymous visitor, so the session is
 * present here; the non-null assertion states that instead of inventing a
 * fallback identity.
 */
export default async function ChatPage() {
  const session = (await getCurrentSession())!;

  return <AppShell profileName={session.profile.name} profileEmail={session.email} />;
}
