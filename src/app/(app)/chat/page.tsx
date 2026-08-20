import { AppShell } from '@/components/layout/app-shell';

/**
 * The profile is hardcoded until src/lib/auth/ can resolve a session to a
 * profile_id. At that point this page reads the profile server-side and passes
 * it down; the shell already takes it as props.
 */
export default function ChatPage() {
  return <AppShell profileName="Ing. Ramiro Martínez" profileEmail="rmartinez@iepsa.mx" />;
}
