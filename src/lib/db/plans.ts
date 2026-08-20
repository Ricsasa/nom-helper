import { getClient, unwrapMaybe } from './client';
import { Plan, Subscription } from './types';

/**
 * Stubs. Billing is not active: every profile is on the free plan and no
 * subscription row is read. The signatures are the contract the frontend agent
 * codes against, so activating billing changes these bodies only.
 */

export const FREE_PLAN_NAME = 'free';

export async function getActivePlanByProfile(_profileId: string): Promise<Plan | null> {
  return unwrapMaybe<Plan>(
    await getClient().from('plans').select('*').eq('name', FREE_PLAN_NAME).maybeSingle()
  );
}

/** Returns null while billing is inactive: no real subscription row exists. */
export async function getSubscriptionByProfile(_profileId: string): Promise<Subscription | null> {
  return null;
}
