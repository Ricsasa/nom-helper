import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getActivePlanByProfile, getSubscriptionByProfile } from '../plans';
import { Profile } from '../types';
import { createTestProfile, deleteTestProfile } from './helpers';

describe('plans and subscriptions stubs', () => {
  let profile: Profile;

  beforeEach(async () => {
    profile = await createTestProfile();
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
  });

  it('returns the seeded free plan for any profile', async () => {
    const plan = await getActivePlanByProfile(profile.id);

    expect(plan).toMatchObject({ name: 'free', daily_quota_limit: 10 });
    expect(Number(plan!.price)).toBe(0);
  });

  it('returns the same plan for a profile that does not exist, because billing is inactive', async () => {
    const plan = await getActivePlanByProfile('00000000-0000-0000-0000-000000000000');
    expect(plan?.name).toBe('free');
  });

  it('returns no subscription while billing is inactive', async () => {
    expect(await getSubscriptionByProfile(profile.id)).toBeNull();
  });
});
