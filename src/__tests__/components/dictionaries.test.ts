import { describe, expect, it } from 'vitest';
import { DICTIONARIES } from '@/i18n/dictionaries';

/**
 * The English file is typed against the Spanish one, so a missing key is a
 * compile error. This guards the other direction: an empty string would type
 * check but render blank.
 */
describe('dictionaries', () => {
  it('define the same keys in both languages', () => {
    expect(Object.keys(DICTIONARIES['en-US']).sort()).toEqual(
      Object.keys(DICTIONARIES['es-MX']).sort()
    );
  });

  it('have no empty strings', () => {
    for (const [language, dictionary] of Object.entries(DICTIONARIES)) {
      for (const [key, value] of Object.entries(dictionary)) {
        expect(value.trim(), `${language}/${key}`).not.toBe('');
      }
    }
  });

  it('never translate the name of the standard', () => {
    expect(DICTIONARIES['en-US']['brand.tagline']).toContain('NOM-001-SEDE');
    expect(DICTIONARIES['en-US']['notice.thread.p1']).toContain('NOM-001-SEDE-2018');
  });
});
