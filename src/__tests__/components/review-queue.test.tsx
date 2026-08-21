import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewQueue } from '@/components/operator/review-queue';
import { LanguageProvider } from '@/components/shared/language-provider';
import type { Message, ReasonCategory, ReviewQueueEntry, ReviewStatus } from '@/lib/db/types';

vi.mock('@/app/(operator)/dashboard/actions', () => ({
  readMessage: vi.fn(),
  submitReview: vi.fn(),
  revealIdentity: vi.fn(),
}));

import { readMessage, submitReview } from '@/app/(operator)/dashboard/actions';

const readMessageMock = vi.mocked(readMessage);
const submitReviewMock = vi.mocked(submitReview);

function buildMessage(id: string, query: string): Message {
  return {
    id,
    conversation_id: 'conversation-1',
    query,
    summary: 'La sección mínima es 3.31 mm² para ese circuito.',
    explanation: 'El valor depende de la caída de tensión permitida en el circuito derivado.',
    citations: [
      {
        chapter: 'Capítulo 3',
        article: '310-15',
        page: 'p. 214',
        excerpt: 'La ampacidad se determina conforme a la tabla 310-15(b)(16).',
      },
    ],
    confidence_level: 'medium',
    insufficient_info: false,
    norm_version: 'NOM-001-SEDE-2018',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
  };
}

function buildEntry(
  id: string,
  createdAt: string,
  category: ReasonCategory,
  status: ReviewStatus = 'pending',
  query = `Consulta ${id}`
): ReviewQueueEntry {
  return {
    id,
    message_id: `message-${id}`,
    is_positive: false,
    reason_category: category,
    reason_text: null,
    review_status: status,
    created_at: createdAt,
    updated_at: createdAt,
    message: {
      id: `message-${id}`,
      query,
      summary: 'Resumen',
      confidence_level: 'medium',
    },
  };
}

function renderQueue(entries: ReviewQueueEntry[]) {
  return render(
    <LanguageProvider>
      <ReviewQueue entries={entries} />
    </LanguageProvider>
  );
}

/** The citations inside an open card are list items too, so rows are read
 * through the queue list itself rather than by role alone. */
function queueRows(): HTMLElement[] {
  return within(screen.getByRole('list', { name: 'Cola de revisión' })).getAllByRole('listitem');
}

function queryTexts(): string[] {
  return queueRows().map((item) => (item.textContent ?? '').slice(0, 30));
}

beforeEach(() => {
  readMessageMock.mockReset();
  submitReviewMock.mockReset();
  readMessageMock.mockImplementation(async (messageId: string) =>
    buildMessage(messageId, 'Consulta completa sobre la ampacidad del conductor.')
  );
  submitReviewMock.mockResolvedValue({ ok: true });
});

describe('review queue list', () => {
  it('puts unreviewed items first and orders the rest by age', () => {
    renderQueue([
      buildEntry('c', '2025-03-03T00:00:00Z', 'off_topic', 'reviewed'),
      buildEntry('b', '2025-03-02T00:00:00Z', 'missing_info'),
      buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch'),
    ]);

    const order = queryTexts();
    expect(order[0]).toContain('Consulta a');
    expect(order[1]).toContain('Consulta b');
    expect(order[2]).toContain('Consulta c');
  });

  it('filters by reason category', async () => {
    renderQueue([
      buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch'),
      buildEntry('b', '2025-03-02T00:00:00Z', 'missing_info'),
    ]);

    await userEvent.selectOptions(screen.getByLabelText('Motivo'), 'missing_info');

    const rows = queueRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('Consulta b');
  });

  it('filters by review status', async () => {
    renderQueue([
      buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch'),
      buildEntry('b', '2025-03-02T00:00:00Z', 'missing_info', 'reviewed'),
    ]);

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'reviewed');

    const rows = queueRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('Consulta b');
  });

  it('states the empty queue as a fact, without congratulating', () => {
    renderQueue([]);

    expect(screen.getByText('No hay respuestas pendientes de revisión.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Cola de revisión' })).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/!/);
  });

  it('separates an empty filter result from an empty queue', async () => {
    renderQueue([buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch')]);

    await userEvent.selectOptions(screen.getByLabelText('Motivo'), 'off_topic');

    expect(screen.getByText('Ningún registro coincide con el filtro.')).toBeInTheDocument();
  });
});

describe('review card submission', () => {
  it('sends the typed cause and destination and moves the row out of pending', async () => {
    renderQueue([buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch')]);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));

    const submit = await screen.findByRole('button', { name: 'Registrar revisión' });
    expect(submit).toBeDisabled();

    await userEvent.click(
      screen.getByLabelText('El texto recuperado no era relevante para la consulta')
    );
    expect(submit).toBeDisabled();

    await userEvent.click(screen.getByLabelText('Agregar al set de evaluación'));
    expect(submit).toBeEnabled();

    await userEvent.click(submit);

    expect(submitReviewMock).toHaveBeenCalledWith('a', {
      technical_cause: 'wrong_chunk_retrieved',
      destination: 'add_to_eval_set',
    });
    expect(await screen.findByText('Revisión registrada.')).toBeInTheDocument();

    // The item does not disappear: it changes status and stays queryable.
    expect(within(queueRows()[0]).getByText('Revisado')).toBeInTheDocument();
  });

  it('shows the query and the citations together in the open card', async () => {
    renderQueue([buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch')]);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));

    // The full query and the retrieved citations are in the same open card.
    const card = queueRows()[0];
    expect((await within(card).findAllByText(/310-15/)).length).toBeGreaterThan(0);
    expect(within(card).getByText('Consulta completa')).toBeInTheDocument();
    expect(within(card).getAllByText('Consulta a').length).toBeGreaterThan(0);
  });

  it('reports a failed submission and keeps the row pending', async () => {
    submitReviewMock.mockResolvedValue({ ok: false });
    renderQueue([buildEntry('a', '2025-03-01T00:00:00Z', 'citation_mismatch')]);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    await userEvent.click(await screen.findByLabelText('La información no está en el corpus cargado'));
    await userEvent.click(screen.getByLabelText('Descartar'));
    await userEvent.click(screen.getByRole('button', { name: 'Registrar revisión' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se registró la revisión.');
    expect(within(queueRows()[0]).getByText('Sin revisar')).toBeInTheDocument();
  });
});
