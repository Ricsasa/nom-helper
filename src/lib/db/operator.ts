import { getClient, unwrap, unwrapMaybe } from './client';
import { OperatorReview, OperatorReviewPayload, ReviewQueueEntry } from './types';

/**
 * The review row and the new review_status of the rating must land together.
 * A database function keeps both in one transaction; doing it with two calls
 * from Node leaves a window where the queue shows a rating already reviewed.
 */
export async function createOperatorReview(
  ratingId: string,
  payload: OperatorReviewPayload
): Promise<OperatorReview> {
  return unwrap<OperatorReview>(
    await getClient().rpc('create_operator_review', {
      p_rating_id: ratingId,
      p_technical_cause: payload.technical_cause,
      p_destination: payload.destination,
    })
  );
}

export async function getOperatorReviewByRating(ratingId: string): Promise<OperatorReview | null> {
  return unwrapMaybe<OperatorReview>(
    await getClient().from('operator_reviews').select('*').eq('rating_id', ratingId).maybeSingle()
  );
}

/** Pending negative ratings with the message that produced them. Operator only. */
export async function getReviewQueue(): Promise<ReviewQueueEntry[]> {
  return unwrap<ReviewQueueEntry[]>(
    await getClient()
      .from('response_ratings')
      .select('*, message:messages(id, query, summary, confidence_level)')
      .eq('is_positive', false)
      .eq('review_status', 'pending')
      .order('created_at', { ascending: true })
  );
}
