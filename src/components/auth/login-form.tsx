'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { FormErrorBand } from './form-error-band';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/components/shared/language-provider';
import { authErrorKeys, validateLogin, type AuthErrorCode } from '@/lib/utils/auth-validation';
import { signIn } from '@/app/(auth)/actions';

export function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null);
  const [pending, setPending] = useState(false);

  /** Enter inside either field submits, because the form owns the handler. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clientError = validateLogin({ email, password });
    if (clientError) {
      setErrorCode(clientError);
      return;
    }

    setErrorCode(null);
    setPending(true);
    try {
      const result = await signIn(email, password);
      if (!result.ok) setErrorCode(result.code);
    } catch {
      // The seam is not wired yet. Report the credential error rather than a
      // blank screen; see src/app/(auth)/actions.ts.
      setErrorCode('invalidCredentials');
    } finally {
      setPending(false);
    }
  }

  const keys = errorCode ? authErrorKeys(errorCode) : null;

  return (
    <div className="w-full max-w-auth border border-line bg-surface p-8">
      <h2 className="text-[16px] font-semibold">{t('auth.login.title')}</h2>
      <p className="mb-6 text-base text-muted2">{t('auth.login.subtitle')}</p>

      {keys ? <FormErrorBand error={{ title: t(keys.titleKey), help: t(keys.helpKey) }} /> : null}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="email"
          type="email"
          autoComplete="email"
          label={t('auth.field.email')}
          placeholder={t('auth.field.emailPlaceholder')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          id="password"
          type="password"
          autoComplete="current-password"
          label={t('auth.field.password')}
          placeholder={t('auth.field.passwordPlaceholder')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          trailing={
            <Link
              href="/login"
              className="text-sm font-normal text-muted2 underline underline-offset-2"
            >
              {t('auth.field.recover')}
            </Link>
          }
        />

        <PrimaryButton type="submit" fullWidth disabled={pending}>
          {t('auth.login.submit')}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-base text-muted2">
        {t('auth.login.switchPrompt')}{' '}
        <Link href="/register">{t('auth.login.switchAction')}</Link>
      </p>
    </div>
  );
}
