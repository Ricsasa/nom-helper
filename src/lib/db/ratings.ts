import { getClient, unwrap, unwrapMaybe } from './client';
import { RatingPayload, ResponseRating } from './types';

/**
 * One rating per message. The unique constraint on message_id turns a second
 * rating into an update, so a user who changes their mind does not create a
 * second row.
 */
export async function createRating(
  messageId: string,
  payload: RatingPayload
): Promise<ResponseRating> {
  const row = {
    message_id: messageId,
    is_positive: payload.is_positive,
    // A positive rating carries no reason: the fields are cleared, not kept
    // from a previous negative rating.
    reason_category: payload.is_positive ? null : (payload.reason_category ?? null),
    reason_text: payload.is_positive ? null : (payload.reason_text ?? null),
    review_status: payload.is_positive ? 'not_applicable' : 'pending',
  };

  return unwrap<ResponseRating>(
    await getClient()
      .from('response_ratings')
      .upsert(row, { onConflict: 'message_id' })
      .select('*')
      .single()
  );
}

export async function getRatingByMessage(messageId: string): Promise<ResponseRating | null> {
  return unwrapMaybe<ResponseRating>(
    await getClient().from('response_ratings').select('*').eq('message_id', messageId).maybeSingle()
  );
}

/** Operator use only. Negative ratings that nobody has processed yet. */
export async function getPendingRatings(): Promise<ResponseRating[]> {
  return unwrap<ResponseRating[]>(
    await getClient()
      .from('response_ratings')
      .select('*')
      .eq('is_positive', false)
      .eq('review_status', 'pending')
      .order('created_at', { ascending: true })
  );
}
