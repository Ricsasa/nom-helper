'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/useLanguage';

export interface AuthFormProps {
  mode: 'login' | 'signup';
}

async function signIn(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

async function signUp(email: string, password: string): Promise<string | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return error.message;
  // No session means the project requires email confirmation.
  if (!data.session || !data.user) return 'auth.confirmEmail';
  return null;
}

// Markup and ARIA only. Add the styling this project needs.
export default function AuthForm({ mode }: AuthFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const failure =
        mode === 'login' ? await signIn(email, password) : await signUp(email, password);
      if (failure) setError(failure.startsWith('auth.') ? t(failure) : failure);
      else router.replace('/');
    } catch {
      setError(t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isLogin ? t('auth.signIn') : t('auth.signUp')}</h1>

      <label htmlFor="email">{t('auth.email')}</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="password">{t('auth.password')}</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete={isLogin ? 'current-password' : 'new-password'}
        required
      />

      {error ? <p role="alert">{error}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('common.loading') : isLogin ? t('auth.signIn') : t('auth.signUp')}
      </button>

      <p>
        {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
        <Link href={isLogin ? '/auth/signup' : '/auth/login'}>
          {isLogin ? t('auth.signUp') : t('auth.signIn')}
        </Link>
      </p>
    </form>
  );
}
