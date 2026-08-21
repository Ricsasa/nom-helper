import type { Language, TranslationKey } from '@/types/ui';

/**
 * The catalogue of normative documents loaded into the system. The About screen
 * renders it as data, so adding a version is an entry here and nothing else:
 * no component changes, no new copy in the interface (addendum, section 2).
 *
 * It lives in the frontend as a constant because the document metadata sits in
 * the `rag` schema, which belongs to the developer, and `src/lib/db/` exposes
 * no function for it. When that function exists, this module is replaced by the
 * call and the component contract stays the same.
 */
export type StandardStatus = 'current' | 'inTransition' | 'superseded';

export type LoadedStandard = {
  /** Never translated and never abbreviated (spec section 7). */
  code: string;
  /** The official title of the document. Not product copy: never translated. */
  name: string;
  version: string;
  /** ISO date of the official publication. */
  publishedOn: string;
  /** The official outlet that published it, e.g. DOF. */
  publisher: string;
  status: StandardStatus;
  /** ISO date the document was incorporated into the system. */
  loadedOn: string;
  /** Row note, when a document needs one. Product copy, so a key. */
  noteKey?: TranslationKey;
};

export const STATUS_KEY: Record<StandardStatus, TranslationKey> = {
  current: 'about.standards.status.current',
  inTransition: 'about.standards.status.inTransition',
  superseded: 'about.standards.status.superseded',
};

/**
 * Two versions of the same standard coexist: the one in effect and the previous
 * edition, kept as a historical reference. Only one row is ever `current`.
 */
export const LOADED_STANDARDS: LoadedStandard[] = [
  {
    code: 'NOM-001-SEDE-2018',
    name: 'Instalaciones eléctricas (utilización)',
    version: '2018',
    publishedOn: '2018-11-29',
    publisher: 'DOF',
    status: 'current',
    loadedOn: '2026-03-12',
  },
  {
    code: 'NOM-001-SEDE-2012',
    name: 'Instalaciones eléctricas (utilización)',
    version: '2012',
    publishedOn: '2012-11-27',
    publisher: 'DOF',
    status: 'superseded',
    loadedOn: '2026-03-12',
    noteKey: 'about.standards.note.historical',
  },
];

/** The last time the index behind the loaded documents was rebuilt. */
export const INDEX_UPDATED_ON = '2026-03-12';

/**
 * Dates are stored as ISO and formatted at render time, so the same row reads
 * correctly in both languages. UTC keeps the day from shifting by timezone.
 */
export function formatStandardDate(isoDate: string, language: Language): string {
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
