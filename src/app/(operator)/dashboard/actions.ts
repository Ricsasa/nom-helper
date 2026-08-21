'use server';

import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getProfileById } from '@/lib/db/auth';
import { getMessageById } from '@/lib/db/messages';
import { createOperatorReview } from '@/lib/db/operator';
import type { Message, OperatorReviewPayload } from '@/lib/db/types';

/**
 * The seam between the operator client components and the data layer, mirroring
 * (app)/settings/actions.ts. The dashboard blocks are interactive, so they never
 * import @/lib/db themselves.
 *
 * Every action re-checks the role on the server. The (operator) layout already
 * gates the page, but a server action is its own entry point: a request that
 * skips the page still reaches the action, so the guard has to live here too.
 */
async function requireOperator(): Promise<void> {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (session.profile.role !== 'operator') redirect('/chat');
}

/** The full message behind a queue entry: explanation, citations, confidence. */
export async function readMessage(messageId: string): Promise<Message | null> {
  await requireOperator();
  return getMessageById(messageId);
}

export type SubmitReviewResult = { ok: true } | { ok: false };

/**
 * createOperatorReview writes the review row and moves
 * response_ratings.review_status in one database transaction, so there is no
 * second call here and no window where the queue shows a rating as pending
 * that already has a review.
 */
export async function submitReview(
  ratingId: string,
  payload: OperatorReviewPayload
): Promise<SubmitReviewResult> {
  await requireOperator();
  try {
    await createOperatorReview(ratingId, payload);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/**
 * The deliberate action behind the pseudonym (addendum, "Privacy"). It exists
 * as a separate call precisely so that the default render of the table never
 * carries a real name in its payload.
 */
export async function revealIdentity(profileId: string): Promise<{ name: string } | null> {
  await requireOperator();
  const profile = await getProfileById(profileId);
  return profile ? { name: profile.name } : null;
}
