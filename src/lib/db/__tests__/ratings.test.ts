import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRating, getPendingRatings, getRatingByMessage } from '../ratings';
import { Message, Profile } from '../types';
import { createTestMessage, createTestProfile, deleteTestProfile, MISSING_UUID } from './helpers';

describe('ratings domain', () => {
  let profile: Profile;
  let message: Message;

  beforeEach(async () => {
    profile = await createTestProfile();
    message = await createTestMessage(profile);
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
  });

  it('marks a positive rating as not applicable for review', async () => {
    const rating = await createRating(message.id, { is_positive: true });

    expect(rating).toMatchObject({
      is_positive: true,
      review_status: 'not_applicable',
      reason_category: null,
      reason_text: null,
    });
  });

  it('queues a negative rating with its reason', async () => {
    const rating = await createRating(message.id, {
      is_positive: false,
      reason_category: 'citation_mismatch',
      reason_text: 'La cita no corresponde.',
    });

    expect(rating).toMatchObject({
      review_status: 'pending',
      reason_category: 'citation_mismatch',
    });
  });

  it('updates the existing rating instead of creating a second one', async () => {
    const first = await createRating(message.id, {
      is_positive: false,
      reason_category: 'off_topic',
    });
    const second = await createRating(message.id, { is_positive: true });

    expect(second.id).toBe(first.id);
    expect(second.review_status).toBe('not_applicable');
    expect(second.reason_category).toBeNull();
  });

  it('rejects a reason category outside the allowed set', async () => {
    await expect(
      createRating(message.id, {
        is_positive: false,
        reason_category: 'bad_vibes' as unknown as 'other',
      })
    ).rejects.toThrow();
  });

  it('rejects a rating for a message that does not exist', async () => {
    await expect(createRating(MISSING_UUID, { is_positive: true })).rejects.toThrow();
  });

  it('reads the rating of a message, or null when there is none', async () => {
    expect(await getRatingByMessage(message.id)).toBeNull();
    const rating = await createRating(message.id, { is_positive: true });
    expect(await getRatingByMessage(message.id)).toMatchObject({ id: rating.id });
  });

  it('lists only pending negative ratings', async () => {
    const pending = await createRating(message.id, {
      is_positive: false,
      reason_category: 'missing_info',
    });
    const positiveMessage = await createTestMessage(profile);
    await createRating(positiveMessage.id, { is_positive: true });

    const queue = await getPendingRatings();
    const ids = queue.map((row) => row.id);
    expect(ids).toContain(pending.id);
    expect(queue.every((row) => !row.is_positive && row.review_status === 'pending')).toBe(true);
  });
});
