import { getClient, unwrap } from './client';
import { ConsumptionLog, ConsumptionSummary, DateRange, ProfileConsumption } from './types';

/** Append-only. One row per processed query, never updated afterwards. */
export async function logConsumption(
  profileId: string,
  messageId: string,
  tokensUsed: number,
  estimatedCost: number
): Promise<ConsumptionLog> {
  return unwrap<ConsumptionLog>(
    await getClient()
      .from('consumption_logs')
      .insert({
        profile_id: profileId,
        message_id: messageId,
        tokens_used: tokensUsed,
        estimated_cost: estimatedCost,
      })
      .select('*')
      .single()
  );
}

/** Operator use. The range is inclusive at the start, exclusive at the end. */
export async function getConsumptionByProfile(
  profileId: string,
  dateRange: DateRange
): Promise<ConsumptionLog[]> {
  return unwrap<ConsumptionLog[]>(
    await getClient()
      .from('consumption_logs')
      .select('*')
      .eq('profile_id', profileId)
      .gte('created_at', dateRange.from)
      .lt('created_at', dateRange.to)
      .order('created_at', { ascending: false })
  );
}

/** Operator only. The sum happens in the database, not in Node. */
export async function getTotalConsumptionSummary(
  dateRange: DateRange
): Promise<ConsumptionSummary> {
  const rows = unwrap<ConsumptionSummary[]>(
    await getClient().rpc('total_consumption_summary', {
      p_from: dateRange.from,
      p_to: dateRange.to,
    })
  );
  return rows[0];
}

/** Operator only. Every profile that consumed at least once, heaviest first. */
export async function listAllProfileConsumption(): Promise<ProfileConsumption[]> {
  return unwrap<ProfileConsumption[]>(await getClient().rpc('all_profile_consumption'));
}
