'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { FormErrorBand } from './form-error-band';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/components/shared/language-provider';
import { authErrorKeys, validateRegister, type AuthErrorCode } from '@/lib/utils/auth-validation';
import { signUp } from '@/app/(auth)/actions';

export function RegisterForm() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clientError = validateRegister({ name, email, password });
    if (clientError) {
      setErrorCode(clientError);
      return;
    }

    setErrorCode(null);
    setPending(true);
    try {
      const result = await signUp(name, email, password);
      if (!result.ok) setErrorCode(result.code);
    } catch {
      // The seam is not wired yet; see src/app/(auth)/actions.ts.
      setErrorCode('emailTaken');
    } finally {
      setPending(false);
    }
  }

  const keys = errorCode ? authErrorKeys(errorCode) : null;

  return (
    <div className="w-full max-w-auth border border-line bg-surface p-8">
      <h2 className="text-[16px] font-semibold">{t('auth.register.title')}</h2>
      <p className="mb-6 text-base text-muted2">{t('auth.register.subtitle')}</p>

      {keys ? <FormErrorBand error={{ title: t(keys.titleKey), help: t(keys.helpKey) }} /> : null}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="name"
          type="text"
          autoComplete="name"
          label={t('auth.field.name')}
          placeholder={t('auth.field.namePlaceholder')}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          autoComplete="new-password"
          label={t('auth.field.password')}
          placeholder={t('auth.field.passwordPlaceholder')}
          hint={t('auth.field.passwordHint')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <PrimaryButton type="submit" fullWidth disabled={pending}>
          {t('auth.register.submit')}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-base text-muted2">
        {t('auth.register.switchPrompt')}{' '}
        <Link href="/login">{t('auth.register.switchAction')}</Link>
      </p>
    </div>
  );
}
