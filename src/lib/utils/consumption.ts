import type { ConsumptionLog } from '@/lib/db/types';

/**
 * Per-user consumption for the operator table. The database returns raw logs
 * per profile; the aggregation and the ordering happen here so the table stays
 * presentational and the ordering rule can be tested on its own.
 */

export type ProfileConsumption = {
  profile_id: string;
  queries: number;
  tokens: number;
  cost: number;
};

/**
 * The reference point the addendum asks for: a number with no threshold next to
 * it does not support a decision. USD, per period shown in the table.
 *
 * ponytail: a constant, not a setting. Move it to a configuration row when the
 * operator needs to change it without a deploy.
 */
export const NORMAL_COST_THRESHOLD_USD = 1;

export function summarizeProfile(profileId: string, logs: ConsumptionLog[]): ProfileConsumption {
  return {
    profile_id: profileId,
    queries: logs.length,
    tokens: logs.reduce((total, log) => total + log.tokens_used, 0),
    cost: logs.reduce((total, log) => total + log.estimated_cost, 0),
  };
}

/** Highest cost first. Ties fall back to the id so the order never flickers. */
export function orderByCost(rows: ProfileConsumption[]): ProfileConsumption[] {
  return [...rows].sort(
    (a, b) => b.cost - a.cost || a.profile_id.localeCompare(b.profile_id)
  );
}

export function isAboveThreshold(row: ProfileConsumption): boolean {
  return row.cost > NORMAL_COST_THRESHOLD_USD;
}

export function formatUsd(amount: number): string {
  return `USD ${amount.toFixed(2)}`;
}

/** Last 30 days, inclusive start and exclusive end, as DateRange expects. */
export function lastThirtyDays(now: Date = new Date()): { from: string; to: string } {
  const to = new Date(now);
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - 30);
  return { from: from.toISOString(), to: to.toISOString() };
}
