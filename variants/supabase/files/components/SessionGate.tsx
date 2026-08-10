'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/useLanguage';

export interface SessionGateProps {
  children: ReactNode;
}

/**
 * Wrap the authenticated part of the tree with this. It holds the children back
 * until the session is known, and it clears the React Query cache on sign-out:
 * without that, the next account would read the previous one's cached rows.
 */
export default function SessionGate({ children }: SessionGateProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setAuthenticated(true);
        return;
      }
      setAuthenticated(false);
      router.replace('/auth/login');
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_OUT' && session) return;
      queryClient.clear();
      setAuthenticated(false);
      router.replace('/auth/login');
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [queryClient, router]);

  if (isAuthenticated !== true) return <p role="status">{t('common.loading')}</p>;

  return <>{children}</>;
}
