import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsumptionBlock } from '@/components/operator/consumption-block';
import { LanguageProvider } from '@/components/shared/language-provider';
import { pseudonymFor } from '@/lib/utils/pseudonym';
import type { ProfileConsumption } from '@/lib/utils/consumption';
import type { ConsumptionSummary } from '@/lib/db/types';

vi.mock('@/app/(operator)/dashboard/actions', () => ({
  readMessage: vi.fn(),
  submitReview: vi.fn(),
  revealIdentity: vi.fn(),
}));

import { revealIdentity } from '@/app/(operator)/dashboard/actions';

const revealIdentityMock = vi.mocked(revealIdentity);

const SUMMARY: ConsumptionSummary = {
  total_queries: 34,
  total_tokens: 128_400,
  total_cost: 2.75,
};

const ROWS: ProfileConsumption[] = [
  { profile_id: 'profile-low', queries: 4, tokens: 8_000, cost: 0.2 },
  { profile_id: 'profile-high', queries: 22, tokens: 96_000, cost: 2.4 },
  { profile_id: 'profile-mid', queries: 8, tokens: 24_400, cost: 0.9 },
];

function renderBlock(rows: ProfileConsumption[] = ROWS) {
  return render(
    <LanguageProvider>
      <ConsumptionBlock summary={SUMMARY} rows={rows} />
    </LanguageProvider>
  );
}

function bodyRows(): HTMLElement[] {
  return screen.getAllByRole('row').slice(1);
}

beforeEach(() => {
  revealIdentityMock.mockReset();
  revealIdentityMock.mockResolvedValue({ name: 'Ing. Ramiro Martínez' });
});

describe('consumption table', () => {
  it('orders users from highest to lowest cost', () => {
    renderBlock();

    const order = bodyRows().map((row) => row.textContent ?? '');
    expect(order[0]).toContain(pseudonymFor('profile-high'));
    expect(order[1]).toContain(pseudonymFor('profile-mid'));
    expect(order[2]).toContain(pseudonymFor('profile-low'));
  });

  it('states the normal threshold and marks who is outside it', () => {
    renderBlock();

    expect(screen.getByText(/Normal: hasta USD 1\.00 por usuario/)).toBeInTheDocument();
    expect(bodyRows()[0]).toHaveTextContent('Fuera de rango');
    expect(bodyRows()[2]).toHaveTextContent('Dentro de rango');
  });

  it('shows every figure in USD', () => {
    renderBlock();

    expect(screen.getByText('USD 2.75')).toBeInTheDocument();
    expect(screen.getByText('USD 2.40')).toBeInTheDocument();
  });

  it('reports an empty period as a fact', () => {
    renderBlock([]);

    expect(screen.getByText('No hay consumo registrado en el periodo.')).toBeInTheDocument();
  });
});

describe('pseudonymization', () => {
  it('shows a stable identifier by default and no name or email', () => {
    renderBlock();

    expect(screen.getByText(pseudonymFor('profile-high'))).toBeInTheDocument();
    expect(screen.queryByText('Ing. Ramiro Martínez')).not.toBeInTheDocument();
    expect(document.body.textContent).not.toContain('profile-high');
    expect(revealIdentityMock).not.toHaveBeenCalled();
  });

  it('is stable for the same profile across renders', () => {
    expect(pseudonymFor('profile-high')).toBe(pseudonymFor('profile-high'));
    expect(pseudonymFor('profile-high')).not.toBe(pseudonymFor('profile-low'));
  });

  it('reveals the real identity only on the explicit action, one row at a time', async () => {
    renderBlock();

    await userEvent.click(screen.getAllByRole('button', { name: 'Ver identidad' })[0]);

    expect(revealIdentityMock).toHaveBeenCalledExactlyOnceWith('profile-high');
    expect(await screen.findByText('Ing. Ramiro Martínez')).toBeInTheDocument();
    // The other rows stay pseudonymized.
    expect(screen.getAllByRole('button', { name: 'Ver identidad' })).toHaveLength(2);
  });

  it('reports a failed reveal without dropping the pseudonym', async () => {
    revealIdentityMock.mockResolvedValue(null);
    renderBlock();

    await userEvent.click(screen.getAllByRole('button', { name: 'Ver identidad' })[0]);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo leer el perfil.');
    expect(screen.getByText(pseudonymFor('profile-high'))).toBeInTheDocument();
  });
});
