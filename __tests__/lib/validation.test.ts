import {
  escapeLikePattern,
  validateDateRange,
  validateInteger,
  validateIsoDate,
  validateName,
  validateOptionalText,
  validateUuid,
  validateUuidList,
} from '@/lib/validation';

const UUID = '11111111-2222-3333-4444-555555555555';

describe('validateName', () => {
  it('accepts a trimmed name inside the limit', () => {
    expect(validateName('  Work  ', 10, 'name')).toBeNull();
  });

  it('rejects a blank name', () => {
    expect(validateName('   ', 10, 'name')).toBe('name cannot be empty');
  });

  it('rejects a name over the limit', () => {
    expect(validateName('a'.repeat(11), 10, 'name')).toBe('name cannot exceed 10 characters');
  });

  it('rejects a non-string', () => {
    expect(validateName(42, 10, 'name')).toBe('name is required');
  });
});

describe('validateOptionalText', () => {
  it('treats null and undefined as absent', () => {
    expect(validateOptionalText(undefined, 'notes')).toBeNull();
    expect(validateOptionalText(null, 'notes')).toBeNull();
  });

  it('enforces the length limit', () => {
    expect(validateOptionalText('ab', 'notes', 1)).toBe('notes cannot exceed 1 characters');
  });
});

describe('validateInteger', () => {
  it('rejects a float', () => {
    expect(validateInteger(1.5, 'rating', 0, 5)).toBe('rating must be an integer');
  });

  it('rejects a value out of range', () => {
    expect(validateInteger(6, 'rating', 0, 5)).toBe('rating must be between 0 and 5');
  });

  it('accepts a bound', () => {
    expect(validateInteger(5, 'rating', 0, 5)).toBeNull();
  });
});

describe('validateIsoDate', () => {
  it('accepts YYYY-MM-DD', () => {
    expect(validateIsoDate('2026-08-09', 'date')).toBeNull();
  });

  it('rejects any other shape', () => {
    expect(validateIsoDate('09/08/2026', 'date')).toBe('date must be YYYY-MM-DD');
  });
});

describe('validateUuid', () => {
  it('accepts a uuid', () => {
    expect(validateUuid(UUID, 'id')).toBeNull();
  });

  it('rejects anything else', () => {
    expect(validateUuid('abc', 'id')).toBe('id must be a uuid');
  });
});

describe('validateUuidList', () => {
  it('accepts a list of uuids', () => {
    expect(validateUuidList([UUID], 'ids')).toBeNull();
  });

  it('rejects a list holding a non-uuid', () => {
    expect(validateUuidList([UUID, 'abc'], 'ids')).toBe('ids must contain only uuids');
  });

  it('rejects a list over the entry limit', () => {
    expect(validateUuidList(Array(101).fill(UUID), 'ids')).toBe('ids cannot exceed 100 entries');
  });
});

describe('validateDateRange', () => {
  it('rejects an end before the start', () => {
    expect(validateDateRange('2026-08-09', '2026-08-01')).toBe(
      'endDate must be on or after startDate'
    );
  });

  it('accepts an open range', () => {
    expect(validateDateRange(undefined, '2026-08-01')).toBeNull();
  });
});

describe('escapeLikePattern', () => {
  it('escapes the wildcards and the escape character itself', () => {
    expect(escapeLikePattern('100%_a\\b')).toBe('100\\%\\_a\\\\b');
  });
});
