import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingControl } from '@/components/chat/rating-control';
import { LanguageProvider } from '@/components/shared/language-provider';
import type { RatingPayload, ResponseRating } from '@/lib/db/types';

vi.mock('@/lib/db/ratings', () => ({ createRating: vi.fn() }));

import { createRating } from '@/lib/db/ratings';

const createRatingMock = vi.mocked(createRating);

function buildRating(payload: RatingPayload): ResponseRating {
  return {
    id: 'rating-1',
    message_id: 'message-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    is_positive: payload.is_positive,
    reason_category: payload.reason_category ?? null,
    reason_text: payload.reason_text ?? null,
    review_status: payload.is_positive ? 'not_applicable' : 'pending',
  };
}

function renderControl(initialRating: ResponseRating | null = null) {
  return render(
    <LanguageProvider>
      <RatingControl messageId="message-1" initialRating={initialRating} />
    </LanguageProvider>
  );
}

const REASON_TITLE = 'Qué falló (opcional)';
const CITATION_REASON = 'La cita no corresponde a lo que dice la respuesta';

beforeEach(() => {
  createRatingMock.mockReset();
  createRatingMock.mockImplementation(async (_messageId, payload) => buildRating(payload));
});

describe('RatingControl', () => {
  it('records a positive rating without opening the reason step', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta útil' }));

    expect(createRatingMock).toHaveBeenCalledWith('message-1', { is_positive: true });
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Respuesta útil' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('opens the reason step with the six categories on a negative rating', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta no útil' }));

    expect(createRatingMock).toHaveBeenCalledWith('message-1', { is_positive: false });
    expect(screen.getByText(REASON_TITLE)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByRole('button', { name: CITATION_REASON })).toBeInTheDocument();
  });

  it('sends the chosen category as a typed reason', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta no útil' }));
    await user.click(screen.getByRole('button', { name: CITATION_REASON }));

    expect(createRatingMock).toHaveBeenLastCalledWith('message-1', {
      is_positive: false,
      reason_category: 'citation_mismatch',
    });
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
  });

  it('sends free text for the other category', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta no útil' }));
    await user.type(screen.getByLabelText('Otro'), 'La tabla citada es de otra edición');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(createRatingMock).toHaveBeenLastCalledWith('message-1', {
      is_positive: false,
      reason_category: 'other',
      reason_text: 'La tabla citada es de otra edición',
    });
  });

  it('keeps the negative rating when the reason step is skipped', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta no útil' }));
    await user.click(screen.getByRole('button', { name: 'Omitir' }));

    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
    expect(createRatingMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Respuesta no útil' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('is reversible in both directions', async () => {
    const user = userEvent.setup();
    renderControl();
    const up = screen.getByRole('button', { name: 'Respuesta útil' });
    const down = screen.getByRole('button', { name: 'Respuesta no útil' });

    await user.click(up);
    await user.click(down);

    expect(down).toHaveAttribute('aria-pressed', 'true');
    expect(up).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(REASON_TITLE)).toBeInTheDocument();

    await user.click(up);

    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(down).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
    expect(createRatingMock).toHaveBeenCalledTimes(3);
  });

  it('does not write again when the active thumb is clicked twice', async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta útil' }));
    await user.click(screen.getByRole('button', { name: 'Respuesta útil' }));

    expect(createRatingMock).toHaveBeenCalledTimes(1);
  });

  it('restores an already submitted rating from history', () => {
    renderControl(buildRating({ is_positive: false, reason_category: 'missing_info' }));

    expect(screen.getByRole('button', { name: 'Respuesta no útil' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
  });

  it('reports a failed write and keeps the reason step closed', async () => {
    const user = userEvent.setup();
    createRatingMock.mockRejectedValueOnce(new Error('network'));
    renderControl();

    await user.click(screen.getByRole('button', { name: 'Respuesta no útil' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se registró la valoración. Vuelve a intentarlo.'
    );
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
  });

  it('prompts nothing on its own', () => {
    renderControl();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText(REASON_TITLE)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Respuesta útil' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
