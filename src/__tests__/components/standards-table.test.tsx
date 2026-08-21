import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardsTable } from '@/components/about/standards-table';
import { LanguageProvider } from '@/components/shared/language-provider';
import { LanguageToggle } from '@/components/shared/language-toggle';
import type { LoadedStandard } from '@/lib/utils/standards';

/**
 * The table is the part of the About screen that must survive a new version of
 * the standard without a redesign, so every assertion here works from a
 * catalogue the test owns, never from the one the product ships.
 */
const CURRENT: LoadedStandard = {
  code: 'NOM-001-SEDE-2018',
  name: 'Instalaciones eléctricas (utilización)',
  version: '2018',
  publishedOn: '2018-11-29',
  publisher: 'DOF',
  status: 'current',
  loadedOn: '2026-03-12',
};

const SUPERSEDED: LoadedStandard = {
  code: 'NOM-001-SEDE-2012',
  name: 'Instalaciones eléctricas (utilización)',
  version: '2012',
  publishedOn: '2012-11-27',
  publisher: 'DOF',
  status: 'superseded',
  loadedOn: '2026-03-12',
  noteKey: 'about.standards.note.historical',
};

function setup(standards: LoadedStandard[]) {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      <StandardsTable standards={standards} />
    </LanguageProvider>
  );
}

function row(code: string): HTMLElement {
  return screen.getByText(code).closest('[data-status]') as HTMLElement;
}

describe('StandardsTable', () => {
  it('renders every field of a loaded document from the data it is given', () => {
    setup([CURRENT]);
    const entry = within(row('NOM-001-SEDE-2018'));

    expect(entry.getByText('Instalaciones eléctricas (utilización)')).toBeInTheDocument();
    expect(entry.getByText('2018')).toBeInTheDocument();
    expect(entry.getByText(/29 nov 2018 · DOF/)).toBeInTheDocument();
    expect(entry.getByText(/12 mar 2026/)).toBeInTheDocument();
    expect(entry.getByText('Vigente')).toBeInTheDocument();
  });

  it('reflects a catalogue it has never seen, without a code change', () => {
    setup([
      {
        code: 'NOM-007-ENER-2014',
        name: 'Eficiencia energética para sistemas de alumbrado',
        version: '2014',
        publishedOn: '2014-04-11',
        publisher: 'DOF',
        status: 'inTransition',
        loadedOn: '2026-05-04',
      },
    ]);

    expect(screen.getByText('NOM-007-ENER-2014')).toBeInTheDocument();
    expect(screen.getByText('En transición')).toBeInTheDocument();
    expect(screen.getByText(/11 abr 2014 · DOF/)).toBeInTheDocument();
  });

  it('shows two versions of the same standard, one in effect and one superseded', () => {
    setup([CURRENT, SUPERSEDED]);

    expect(row('NOM-001-SEDE-2018')).toHaveAttribute('data-status', 'current');
    expect(row('NOM-001-SEDE-2012')).toHaveAttribute('data-status', 'superseded');

    expect(within(row('NOM-001-SEDE-2018')).getByText('Vigente')).toBeInTheDocument();
    expect(within(row('NOM-001-SEDE-2012')).getByText('Sustituida')).toBeInTheDocument();
  });

  it('keeps the superseded version as a labelled historical reference', () => {
    setup([CURRENT, SUPERSEDED]);

    expect(
      within(row('NOM-001-SEDE-2012')).getByText(/referencia histórica/)
    ).toBeInTheDocument();
    expect(within(row('NOM-001-SEDE-2018')).queryByText(/referencia histórica/)).toBeNull();
  });

  it('states the status in words, never by colour alone', () => {
    setup([CURRENT, SUPERSEDED]);

    for (const code of ['NOM-001-SEDE-2018', 'NOM-001-SEDE-2012']) {
      expect(within(row(code)).getByText(/Vigente|Sustituida|En transición/)).toBeInTheDocument();
    }
  });

  it('translates the labels and the status, never the code or the title', async () => {
    setup([CURRENT]);
    await userEvent.click(screen.getByRole('button', { name: 'English' }));
    const entry = within(row('NOM-001-SEDE-2018'));

    expect(entry.getByText('In effect')).toBeInTheDocument();
    expect(entry.getByText('Official publication')).toBeInTheDocument();
    expect(entry.getByText('Instalaciones eléctricas (utilización)')).toBeInTheDocument();
  });
});
