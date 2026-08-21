import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/components/shared/language-provider';
import { AccountSettingsModal } from '@/components/settings/account-settings-modal';

/**
 * The modal reaches the database only through the server actions, so mocking
 * that module is enough: no component under test imports @/lib/db.
 */
vi.mock('@/app/(app)/settings/actions', () => ({
  saveDisplayName: vi.fn(async () => ({ ok: true })),
  saveEmail: vi.fn(async () => ({ ok: true })),
  savePassword: vi.fn(async () => ({ ok: true })),
  saveLanguage: vi.fn(async () => ({ ok: true })),
  readQuotaStatus: vi.fn(async () => ({ used: 3, remaining: 7, limit: 10 })),
  deleteConversationHistory: vi.fn(async () => ({ ok: true })),
  deleteAccount: vi.fn(async () => ({ ok: true })),
}));

import {
  deleteAccount,
  deleteConversationHistory,
  saveLanguage,
} from '@/app/(app)/settings/actions';

const saveLanguageMock = vi.mocked(saveLanguage);
const deleteAccountMock = vi.mocked(deleteAccount);
const deleteHistoryMock = vi.mocked(deleteConversationHistory);

function setup() {
  return render(
    <LanguageProvider>
      <AccountSettingsModal
        open
        onClose={() => {}}
        profileName="Ing. Ramiro Martínez"
        profileEmail="rmartinez@iepsa.mx"
      />
    </LanguageProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  saveLanguageMock.mockResolvedValue({ ok: true });
  deleteAccountMock.mockResolvedValue({ ok: true });
  deleteHistoryMock.mockResolvedValue({ ok: true });
});

describe('language selector in account settings', () => {
  it('offers two options only, each named in its own language, with no flag', () => {
    setup();
    const group = screen.getByRole('group', { name: 'Idioma' });
    const options = within(group).getAllByRole('button');

    expect(options.map((option) => option.textContent)).toEqual(['Español', 'English']);
  });

  it('persists the choice through updateProfileLanguage', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(saveLanguageMock).toHaveBeenCalledWith('en-US');
  });

  it('switches the modal itself immediately, without a reload', async () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'Configuración de la cuenta' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();
    expect(screen.getByText('Delete account')).toBeInTheDocument();
  });

  it('keeps the interface on the old language when the write fails', async () => {
    saveLanguageMock.mockResolvedValue({ ok: false, code: 'saveFailed' });
    setup();

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('dialog', { name: 'Configuración de la cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No se guardó el cambio');
  });
});

describe('typed confirmation gate on account deletion', () => {
  async function armAccountDeletion() {
    setup();
    const row = screen.getByText('Eliminar cuenta').closest('div')!.parentElement!;
    await userEvent.click(within(row).getByRole('button', { name: 'Eliminar' }));
    return row;
  }

  it('states what is lost before asking for the word', async () => {
    const row = await armAccountDeletion();

    expect(
      within(row).getByText(/Se elimina la cuenta, el historial de consultas y las preferencias/)
    ).toBeInTheDocument();
  });

  it('keeps the confirmation disabled until the exact word is typed', async () => {
    const row = await armAccountDeletion();
    const confirm = within(row).getByRole('button', {
      name: 'Eliminar cuenta de forma permanente',
    });

    expect(confirm).toBeDisabled();

    await userEvent.type(within(row).getByLabelText('Escribe ELIMINAR para confirmar.'), 'elimina');
    expect(confirm).toBeDisabled();

    await userEvent.click(confirm);
    expect(deleteAccountMock).not.toHaveBeenCalled();
  });

  it('deletes only once the typed word matches', async () => {
    const row = await armAccountDeletion();

    await userEvent.type(
      within(row).getByLabelText('Escribe ELIMINAR para confirmar.'),
      'ELIMINAR'
    );
    const confirm = within(row).getByRole('button', {
      name: 'Eliminar cuenta de forma permanente',
    });
    expect(confirm).toBeEnabled();

    await userEvent.click(confirm);
    expect(deleteAccountMock).toHaveBeenCalledTimes(1);
  });

  it('asks for no typed word to delete the history, only an explicit confirmation', async () => {
    setup();
    const row = screen.getByText('Eliminar historial de consultas').closest('div')!.parentElement!;

    await userEvent.click(within(row).getByRole('button', { name: 'Eliminar' }));
    expect(deleteHistoryMock).not.toHaveBeenCalled();

    await userEvent.click(within(row).getByRole('button', { name: 'Eliminar historial' }));
    expect(deleteHistoryMock).toHaveBeenCalledTimes(1);
  });
});
