import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createOperatorReview,
  getOperatorReviewByRating,
  getReviewQueue,
  getReviewQueueByStatus,
} from '../operator';
import { createRating, getRatingByMessage } from '../ratings';
import { Message, Profile, ResponseRating } from '../types';
import { createTestMessage, createTestProfile, deleteTestProfile, MISSING_UUID } from './helpers';

describe('operator domain', () => {
  let profile: Profile;
  let message: Message;
  let rating: ResponseRating;

  beforeEach(async () => {
    profile = await createTestProfile();
    message = await createTestMessage(profile);
    rating = await createRating(message.id, {
      is_positive: false,
      reason_category: 'wrong_reference',
      reason_text: 'El artículo no existe.',
    });
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
  });

  it('creates the review and moves the rating out of the queue in one step', async () => {
    const review = await createOperatorReview(rating.id, {
      technical_cause: 'wrong_citation_attribution',
      destination: 'add_to_eval_set',
    });

    expect(review).toMatchObject({
      rating_id: rating.id,
      technical_cause: 'wrong_citation_attribution',
    });
    expect((await getRatingByMessage(message.id))?.review_status).toBe('reviewed');
  });

  it('marks the rating as discarded when the review discards it', async () => {
    await createOperatorReview(rating.id, {
      technical_cause: 'no_issue',
      destination: 'discarded',
    });

    expect((await getRatingByMessage(message.id))?.review_status).toBe('discarded');
  });

  it('leaves the rating pending when the review fails', async () => {
    await expect(
      createOperatorReview(rating.id, {
        technical_cause: 'unknown_cause' as unknown as 'no_issue',
        destination: 'discarded',
      })
    ).rejects.toThrow();

    expect((await getRatingByMessage(message.id))?.review_status).toBe('pending');
  });

  it('refuses a second review for the same rating', async () => {
    await createOperatorReview(rating.id, {
      technical_cause: 'no_issue',
      destination: 'marked_reviewed',
    });

    await expect(
      createOperatorReview(rating.id, {
        technical_cause: 'no_issue',
        destination: 'marked_reviewed',
      })
    ).rejects.toThrow();
  });

  it('rejects a review for a rating that does not exist', async () => {
    await expect(
      createOperatorReview(MISSING_UUID, {
        technical_cause: 'no_issue',
        destination: 'discarded',
      })
    ).rejects.toThrow();
  });

  it('reads the review of a rating, or null when there is none', async () => {
    expect(await getOperatorReviewByRating(rating.id)).toBeNull();
    const review = await createOperatorReview(rating.id, {
      technical_cause: 'content_not_in_corpus',
      destination: 'add_to_eval_set',
    });
    expect(await getOperatorReviewByRating(rating.id)).toMatchObject({ id: review.id });
  });

  it('returns the pending queue with the message that produced each rating', async () => {
    const entry = (await getReviewQueue()).find((row) => row.id === rating.id);

    expect(entry).toBeDefined();
    expect(entry!.message).toMatchObject({ id: message.id, query: message.query });
  });

  it('drops the rating from the queue once it is reviewed', async () => {
    await createOperatorReview(rating.id, {
      technical_cause: 'no_issue',
      destination: 'marked_reviewed',
    });

    expect((await getReviewQueue()).some((row) => row.id === rating.id)).toBe(false);
  });

  it('reads the queue of any review status', async () => {
    expect((await getReviewQueueByStatus('pending')).some((row) => row.id === rating.id)).toBe(true);

    await createOperatorReview(rating.id, {
      technical_cause: 'no_issue',
      destination: 'marked_reviewed',
    });

    const reviewed = (await getReviewQueueByStatus('reviewed')).find((row) => row.id === rating.id);
    expect(reviewed).toBeDefined();
    expect(reviewed!.message).toMatchObject({ id: message.id, query: message.query });
    expect((await getReviewQueueByStatus('pending')).some((row) => row.id === rating.id)).toBe(
      false
    );
  });

  it('returns an empty result for a status the rating never reached', async () => {
    await createOperatorReview(rating.id, {
      technical_cause: 'no_issue',
      destination: 'marked_reviewed',
    });

    expect((await getReviewQueueByStatus('discarded')).some((row) => row.id === rating.id)).toBe(
      false
    );
  });
});
