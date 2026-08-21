import type { ReasonCategory, ReviewQueueEntry, ReviewStatus } from '@/lib/db/types';

/**
 * Ordering and filtering of the operator review queue. Pure functions, kept out
 * of the components so the rules can be asserted without rendering anything.
 *
 * The source function getReviewQueue already returns pending negative ratings
 * ordered by created_at. The sort is repeated here because the list is also the
 * place where a reviewed item stays visible after it changes status (addendum,
 * "a reviewed item does not disappear"), and a mixed list needs the unreviewed
 * ones on top regardless of the order the rows arrived in.
 */

export type QueueFilters = {
  category: ReasonCategory | 'all';
  status: ReviewStatus | 'all';
};

export const ALL_FILTERS: QueueFilters = { category: 'all', status: 'all' };

/** Pending first, then by age, oldest first. */
export function sortQueue(entries: ReviewQueueEntry[]): ReviewQueueEntry[] {
  return [...entries].sort((a, b) => {
    const rank = Number(a.review_status !== 'pending') - Number(b.review_status !== 'pending');
    if (rank !== 0) return rank;
    return a.created_at.localeCompare(b.created_at);
  });
}

export function filterQueue(
  entries: ReviewQueueEntry[],
  filters: QueueFilters
): ReviewQueueEntry[] {
  return entries.filter((entry) => {
    if (filters.category !== 'all' && entry.reason_category !== filters.category) return false;
    if (filters.status !== 'all' && entry.review_status !== filters.status) return false;
    return true;
  });
}

/** What the list renders: filtered, then ordered. */
export function visibleQueue(
  entries: ReviewQueueEntry[],
  filters: QueueFilters
): ReviewQueueEntry[] {
  return sortQueue(filterQueue(entries, filters));
}
