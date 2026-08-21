import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponseAnatomy } from '@/components/chat/response-anatomy';
import { LanguageProvider } from '@/components/shared/language-provider';
import type { ConfidenceLevel, Message } from '@/lib/db/types';

/**
 * The component reads a Message and nothing else, so the fixture is the whole
 * input. Citation content stays in Spanish: it is the text of the standard.
 */
function buildMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'message-1',
    conversation_id: 'conversation-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    query: '¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?',
    summary: 'Para un circuito derivado de 30 A el conductor mínimo es calibre 10 AWG de cobre.',
    explanation:
      'La tabla de ampacidad fija 30 A para el 10 AWG de cobre a 60 °C.\nLa protección del circuito derivado no debe exceder la ampacidad del conductor.',
    citations: [
      {
        chapter: 'Capítulo 3',
        article: 'Artículo 310-15',
        page: 'p. 214',
        excerpt: 'La ampacidad de los conductores se determina según la tabla 310-15(b)(16).',
      },
      {
        chapter: 'Capítulo 2',
        article: 'Artículo 240-4',
        page: 'p. 118',
        excerpt: 'Los conductores se deben proteger contra sobrecorriente según su ampacidad.',
      },
    ],
    confidence_level: 'high',
    insufficient_info: false,
    norm_version: 'NOM-001-SEDE-2018',
    ...overrides,
  };
}

function renderMessage(overrides: Partial<Message> = {}) {
  return render(
    <LanguageProvider>
      <ResponseAnatomy message={buildMessage(overrides)} />
    </LanguageProvider>
  );
}

describe('ResponseAnatomy', () => {
  it('renders the four fields of the response contract', async () => {
    const message = buildMessage();
    renderMessage();

    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText(message.summary)).toBeInTheDocument();

    expect(screen.getByText('Explicación')).toBeInTheDocument();
    for (const paragraph of message.explanation.split('\n')) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }

    expect(screen.getByText('Citas de la norma')).toBeInTheDocument();
    expect(screen.getByText('Capítulo 3 · Artículo 310-15')).toBeInTheDocument();
    expect(screen.getByText('Capítulo 2 · Artículo 240-4')).toBeInTheDocument();

    expect(screen.getByText('Confianza')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('opens the text of a citation in place, without leaving the conversation', async () => {
    const message = buildMessage();
    renderMessage();

    expect(screen.queryByText(message.citations[0].excerpt)).not.toBeInTheDocument();

    const toggles = screen.getAllByRole('button', { name: /Ver texto/ });
    await userEvent.click(toggles[0]);

    expect(screen.getByText(message.citations[0].excerpt)).toBeInTheDocument();
    expect(screen.getByText(message.citations[0].page)).toBeInTheDocument();
    // The second citation is unaffected: each row owns its own open flag.
    expect(screen.queryByText(message.citations[1].excerpt)).not.toBeInTheDocument();
  });

  it('counts the citations in the singular when there is one', () => {
    const message = buildMessage();
    renderMessage({ citations: [message.citations[0]] });

    expect(screen.getByText('1 cita')).toBeInTheDocument();
  });

  it.each<[ConfidenceLevel, string]>([
    ['high', 'Alta'],
    ['medium', 'Media'],
    ['low', 'Baja'],
  ])('names the %s confidence level in words, not by colour alone', (level, label) => {
    renderMessage({ confidence_level: level });

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('changes the visual state when the insufficient information flag is set', () => {
    const { container } = renderMessage({
      insufficient_info: true,
      summary: 'La norma no define un valor para ese caso.',
      explanation: 'El texto cargado no cubre instalaciones temporales de obra.',
    });

    expect(screen.getByText('Información insuficiente')).toBeInTheDocument();
    expect(container.querySelector('[data-insufficient="true"]')).toBeInTheDocument();

    // The normal anatomy is replaced, not decorated: no summary label, no
    // citation block and no confidence meter.
    expect(screen.queryByText('Resumen')).not.toBeInTheDocument();
    expect(screen.queryByText('Citas de la norma')).not.toBeInTheDocument();
    expect(screen.queryByText('Confianza')).not.toBeInTheDocument();
  });

  it('keeps citation content untranslated when the language changes', () => {
    const message = buildMessage();
    render(
      <LanguageProvider initialLanguage="en-US">
        <ResponseAnatomy message={message} />
      </LanguageProvider>
    );

    expect(screen.getByText('Citations from the standard')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Capítulo 3 · Artículo 310-15')).toBeInTheDocument();
  });
});
