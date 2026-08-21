import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '@/components/layout/sidebar';
import { LanguageProvider } from '@/components/shared/language-provider';

/**
 * The action ends the session on the server, so the test asserts the button
 * calls it. Whether the redirect lands is Next's contract, not the sidebar's.
 */
const signOutAction = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('@/app/(app)/settings/actions', () => ({ signOutAction }));

function setup(overrides: Partial<Parameters<typeof Sidebar>[0]> = {}) {
  const props = {
    open: true,
    onClose: vi.fn(),
    history: [],
    activeHistory: -1,
    onSelectHistory: vi.fn(),
    onNewQuery: vi.fn(),
    profileName: 'Ing. R. Martínez',
    profileEmail: 'rmartinez@iepsa.mx',
    onOpenSettings: vi.fn(),
    ...overrides,
  };

  render(
    <LanguageProvider>
      <Sidebar {...props} />
    </LanguageProvider>
  );

  return props;
}

describe('Sidebar', () => {
  beforeEach(() => {
    signOutAction.mockClear();
  });

  it('ends the session when the footer button is used', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));

    expect(signOutAction).toHaveBeenCalledTimes(1);
  });

  it('does not end the session on any other footer action', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Configuración' }));

    expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
    expect(signOutAction).not.toHaveBeenCalled();
  });

  it('reaches the About screen from the tools zone', () => {
    setup();

    expect(screen.getByRole('link', { name: /Acerca y fuentes/ })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});
