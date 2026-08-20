import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getClient } from '../client';
import { checkAndIncrementQuota, DAILY_QUOTA_LIMIT, getQuotaStatus } from '../rate-limiting';
import { Profile } from '../types';
import { createTestProfile, deleteTestProfile } from './helpers';

describe('rate limiting domain', () => {
  let profile: Profile;

  beforeEach(async () => {
    profile = await createTestProfile();
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
  });

  it('creates the row of the day on the first query, with the counter at one', async () => {
    const result = await checkAndIncrementQuota(profile.id);
    expect(result).toEqual({ allowed: true, remaining: DAILY_QUOTA_LIMIT - 1 });

    const { data } = await getClient()
      .from('daily_quotas')
      .select('*')
      .eq('profile_id', profile.id);
    expect(data).toHaveLength(1);
    expect(data![0].queries_used).toBe(1);
  });

  it('increments the same row instead of creating a second one', async () => {
    await checkAndIncrementQuota(profile.id);
    const second = await checkAndIncrementQuota(profile.id);

    expect(second).toEqual({ allowed: true, remaining: DAILY_QUOTA_LIMIT - 2 });
    const { data } = await getClient()
      .from('daily_quotas')
      .select('id')
      .eq('profile_id', profile.id);
    expect(data).toHaveLength(1);
  });

  it('refuses the query once the limit is spent and stops counting', async () => {
    for (let i = 0; i < DAILY_QUOTA_LIMIT; i += 1) {
      expect((await checkAndIncrementQuota(profile.id)).allowed).toBe(true);
    }

    expect(await checkAndIncrementQuota(profile.id)).toEqual({ allowed: false, remaining: 0 });

    const { data } = await getClient()
      .from('daily_quotas')
      .select('queries_used')
      .eq('profile_id', profile.id)
      .single();
    expect(data!.queries_used).toBe(DAILY_QUOTA_LIMIT);
  });

  it('lets no more than the limit through when the calls run concurrently', async () => {
    const attempts = DAILY_QUOTA_LIMIT + 5;
    const results = await Promise.all(
      Array.from({ length: attempts }, () => checkAndIncrementQuota(profile.id))
    );

    expect(results.filter((row) => row.allowed)).toHaveLength(DAILY_QUOTA_LIMIT);
    expect(results.filter((row) => !row.allowed)).toHaveLength(5);
  });

  it('rejects a quota for a profile that does not exist', async () => {
    await expect(
      checkAndIncrementQuota('00000000-0000-0000-0000-000000000000')
    ).rejects.toThrow();
  });

  it('reports the status without creating a row', async () => {
    expect(await getQuotaStatus(profile.id)).toEqual({
      used: 0,
      remaining: DAILY_QUOTA_LIMIT,
      limit: DAILY_QUOTA_LIMIT,
    });

    const { data } = await getClient()
      .from('daily_quotas')
      .select('id')
      .eq('profile_id', profile.id);
    expect(data).toEqual([]);

    await checkAndIncrementQuota(profile.id);
    expect(await getQuotaStatus(profile.id)).toMatchObject({ used: 1 });
  });
});
