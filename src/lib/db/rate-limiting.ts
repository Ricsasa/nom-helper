import { getClient, unwrap, unwrapMaybe } from './client';
import { DailyQuota, QuotaResult, QuotaStatus } from './types';

/**
 * The daily limit is hardcoded while billing is inactive. When billing is
 * scoped, this constant is replaced by plans.daily_quota_limit read through the
 * active subscription, and nothing else in this file changes.
 */
export const DAILY_QUOTA_LIMIT = 10;

/**
 * The only function that writes to daily_quotas. The row for the day is created
 * lazily inside the same statement that increments it, so two concurrent
 * queries cannot both see "0 used" and both pass.
 */
export async function checkAndIncrementQuota(profileId: string): Promise<QuotaResult> {
  const rows = unwrap<QuotaResult[]>(
    await getClient().rpc('check_and_increment_quota', {
      p_profile_id: profileId,
      p_limit: DAILY_QUOTA_LIMIT,
    })
  );
  return rows[0];
}

/** Read-only. Reports the quota of today without creating or touching a row. */
export async function getQuotaStatus(profileId: string): Promise<QuotaStatus> {
  const today = new Date().toISOString().slice(0, 10);
  const row = unwrapMaybe<DailyQuota>(
    await getClient()
      .from('daily_quotas')
      .select('*')
      .eq('profile_id', profileId)
      .eq('quota_date', today)
      .maybeSingle()
  );

  const used = row?.queries_used ?? 0;
  return {
    used,
    remaining: Math.max(DAILY_QUOTA_LIMIT - used, 0),
    limit: DAILY_QUOTA_LIMIT,
  };
}
