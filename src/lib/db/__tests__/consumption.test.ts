import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getConsumptionByProfile,
  getTotalConsumptionSummary,
  listAllProfileConsumption,
  logConsumption,
} from '../consumption';
import { DateRange, Message, Profile } from '../types';
import { createTestMessage, createTestProfile, deleteTestProfile, MISSING_UUID } from './helpers';

/** A range wide enough to hold everything a single test run creates. */
function today(): DateRange {
  const now = new Date();
  const from = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const to = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  return { from, to };
}

describe('consumption domain', () => {
  let profile: Profile;
  let stranger: Profile;
  let message: Message;

  beforeEach(async () => {
    profile = await createTestProfile('Owner');
    stranger = await createTestProfile('Stranger');
    message = await createTestMessage(profile);
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
    await deleteTestProfile(stranger);
  });

  it('writes one log row per processed query', async () => {
    const log = await logConsumption(profile.id, message.id, 1234, 0.000567);

    expect(log).toMatchObject({
      profile_id: profile.id,
      message_id: message.id,
      tokens_used: 1234,
    });
    expect(Number(log.estimated_cost)).toBeCloseTo(0.000567, 6);
  });

  it('rejects a log for a message that does not exist', async () => {
    await expect(logConsumption(profile.id, MISSING_UUID, 10, 0)).rejects.toThrow();
  });

  it('rejects a negative token count', async () => {
    await expect(logConsumption(profile.id, message.id, -1, 0)).rejects.toThrow();
  });

  it('returns only the rows of the profile inside the range', async () => {
    await logConsumption(profile.id, message.id, 100, 0.0001);
    const strangerMessage = await createTestMessage(stranger);
    await logConsumption(stranger.id, strangerMessage.id, 999, 0.5);

    const rows = await getConsumptionByProfile(profile.id, today());
    expect(rows).toHaveLength(1);
    expect(rows[0].tokens_used).toBe(100);

    const past: DateRange = { from: '2000-01-01T00:00:00Z', to: '2000-01-02T00:00:00Z' };
    expect(await getConsumptionByProfile(profile.id, past)).toEqual([]);
  });

  it('aggregates the summary in the database', async () => {
    const before = await getTotalConsumptionSummary(today());
    await logConsumption(profile.id, message.id, 200, 0.002);

    const after = await getTotalConsumptionSummary(today());
    expect(Number(after.total_queries)).toBe(Number(before.total_queries) + 1);
    expect(Number(after.total_tokens)).toBe(Number(before.total_tokens) + 200);
    expect(Number(after.total_cost)).toBeCloseTo(Number(before.total_cost) + 0.002, 6);
  });

  it('returns zeroes for a range with no rows', async () => {
    const summary = await getTotalConsumptionSummary({
      from: '2000-01-01T00:00:00Z',
      to: '2000-01-02T00:00:00Z',
    });

    expect(Number(summary.total_queries)).toBe(0);
    expect(Number(summary.total_cost)).toBe(0);
  });

  it('aggregates one row per profile, heaviest first', async () => {
    const strangerMessage = await createTestMessage(stranger);
    await logConsumption(profile.id, message.id, 100, 0.001);
    await logConsumption(profile.id, message.id, 100, 0.001);
    await logConsumption(stranger.id, strangerMessage.id, 500, 0.005);

    const rows = await listAllProfileConsumption();
    const mine = rows.find((row) => row.profile_id === profile.id);
    const theirs = rows.find((row) => row.profile_id === stranger.id);

    expect(mine).toMatchObject({ profile_name: 'Owner' });
    expect(Number(mine!.total_queries)).toBe(2);
    expect(Number(mine!.total_tokens)).toBe(200);
    expect(Number(mine!.total_cost)).toBeCloseTo(0.002, 6);
    expect(rows.indexOf(theirs!)).toBeLessThan(rows.indexOf(mine!));
  });

  it('leaves out a profile that consumed nothing', async () => {
    await logConsumption(profile.id, message.id, 10, 0.0001);

    const rows = await listAllProfileConsumption();
    expect(rows.some((row) => row.profile_id === stranger.id)).toBe(false);
  });

  it('orders every row by total tokens descending', async () => {
    await logConsumption(profile.id, message.id, 42, 0.0001);

    const totals = (await listAllProfileConsumption()).map((row) => Number(row.total_tokens));
    expect(totals).toEqual([...totals].sort((a, b) => b - a));
  });
});
