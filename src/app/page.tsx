import { redirect } from 'next/navigation';

/**
 * The chat is the product. Once route protection lands, an unauthenticated
 * visitor is sent to /login from the (app) layout instead.
 */
export default function RootPage() {
  redirect('/chat');
}
