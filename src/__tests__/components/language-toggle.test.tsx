import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '@/components/shared/language-provider';
import { LanguageToggle } from '@/components/shared/language-toggle';

function Probe() {
  const { t, language } = useLanguage();
  return (
    <>
      <span data-testid="language">{language}</span>
      <span data-testid="title">{t('auth.login.title')}</span>
    </>
  );
}

function setup() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      <Probe />
    </LanguageProvider>
  );
}

describe('LanguageToggle', () => {
  it('starts in Spanish, the default of the product', () => {
    setup();
    expect(screen.getByTestId('language')).toHaveTextContent('es-MX');
    expect(screen.getByTestId('title')).toHaveTextContent('Iniciar sesión');
  });

  it('applies the new language immediately, without a reload', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByTestId('language')).toHaveTextContent('en-US');
    expect(screen.getByTestId('title')).toHaveTextContent('Sign in');
  });

  it('marks the active option for assistive technology, not by colour alone', async () => {
    setup();
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('names each language in its own language', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Español' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });
});
