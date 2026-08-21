/**
 * A stable identifier for a profile, shown wherever the operator does not need
 * to know who the person is (addendum, "Privacy"). Same profile_id always
 * yields the same label, so the operator can still recognise a repeat offender
 * across rows and sessions without a name being on the screen.
 *
 * FNV-1a over the id. It is not a security boundary — the real identity is one
 * deliberate click away — it only keeps names out of the default view.
 */
export function pseudonymFor(profileId: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < profileId.length; index += 1) {
    hash ^= profileId.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `USR-${hash.toString(16).toUpperCase().padStart(8, '0').slice(0, 4)}`;
}
