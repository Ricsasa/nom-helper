/**
 * Input primitives shared by every route handler. Each one returns an error
 * message or null, so a handler can chain them with `??` and return the first
 * failure. Nothing here knows about the domain.
 */

export const MAX_TEXT_LENGTH = 5000;
export const MAX_SEARCH_LENGTH = 100;
export const MAX_FILTER_IDS = 100;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function validateName(name: unknown, maxLength: number, field: string): string | null {
  if (typeof name !== 'string') return `${field} is required`;
  const trimmed = name.trim();
  if (trimmed.length < 1) return `${field} cannot be empty`;
  if (trimmed.length > maxLength) return `${field} cannot exceed ${maxLength} characters`;
  return null;
}

export function validateOptionalText(
  value: unknown,
  field: string,
  maxLength = MAX_TEXT_LENGTH
): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return `${field} must be a string`;
  if (value.length > maxLength) return `${field} cannot exceed ${maxLength} characters`;
  return null;
}

export function validateInteger(
  value: unknown,
  field: string,
  min: number,
  max: number
): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value)) return `${field} must be an integer`;
  if (value < min || value > max) return `${field} must be between ${min} and ${max}`;
  return null;
}

export function validateIsoDate(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return `${field} must be YYYY-MM-DD`;
  return null;
}

export function validateUuid(value: unknown, field: string): string | null {
  if (typeof value !== 'string' || !UUID.test(value)) return `${field} must be a uuid`;
  return null;
}

/**
 * Anything that is not a uuid cannot match a row, and letting it through only
 * hands unfiltered text to the query builder.
 */
export function validateUuidList(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (!Array.isArray(value)) return `${field} must be an array`;
  if (value.length > MAX_FILTER_IDS) return `${field} cannot exceed ${MAX_FILTER_IDS} entries`;
  if (!value.every((id) => typeof id === 'string' && UUID.test(id))) {
    return `${field} must contain only uuids`;
  }
  return null;
}

export function validateDateRange(start: unknown, end: unknown): string | null {
  const shapeError = validateIsoDate(start, 'startDate') ?? validateIsoDate(end, 'endDate');
  if (shapeError) return shapeError;
  if (typeof start === 'string' && typeof end === 'string' && end < start) {
    return 'endDate must be on or after startDate';
  }
  return null;
}

/**
 * `%` and `_` are wildcards to `like`/`ilike`, so an unescaped user string turns
 * a prefix lookup into a full-table scan (or matches rows it should not).
 */
export function escapeLikePattern(input: string): string {
  return input.replace(/[\\%_]/g, (char) => `\\${char}`);
}
