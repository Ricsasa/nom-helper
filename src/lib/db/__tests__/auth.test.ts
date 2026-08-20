import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import { getClient } from '../client';
import {
  createProfile,
  deleteProfile,
  getProfileByAuthUserId,
  getProfileById,
  updateProfileLanguage,
  updateProfileName,
  updateProfileRole,
} from '../auth';
import { createConversation } from '../conversations';
import { logConsumption } from '../consumption';
import { checkAndIncrementQuota } from '../rate-limiting';
import { Profile } from '../types';
import { createTestMessage, createTestProfile, deleteTestProfile, MISSING_UUID } from './helpers';

describe('auth domain', () => {
  const created: Profile[] = [];

  afterEach(async () => {
    while (created.length) await deleteTestProfile(created.pop() as Profile);
  });

  it('creates a profile with the default role and language', async () => {
    const profile = await createTestProfile('Ricardo');
    created.push(profile);

    expect(profile.name).toBe('Ricardo');
    expect(profile.role).toBe('user');
    expect(profile.language).toBe('es-MX');
    expect(profile.created_at).toBeTruthy();
  });

  it('rejects a profile whose auth user does not exist', async () => {
    await expect(createProfile(MISSING_UUID, 'Ghost')).rejects.toThrow();
  });

  it('resolves a session to a profile and back by id', async () => {
    const profile = await createTestProfile();
    created.push(profile);

    expect(await getProfileByAuthUserId(profile.auth_user_id)).toMatchObject({ id: profile.id });
    expect(await getProfileById(profile.id)).toMatchObject({ id: profile.id });
  });

  it('returns null for an unknown profile', async () => {
    expect(await getProfileByAuthUserId(randomUUID())).toBeNull();
    expect(await getProfileById(MISSING_UUID)).toBeNull();
  });

  it('updates name, language and role, and lets the trigger move updated_at', async () => {
    const profile = await createTestProfile();
    created.push(profile);

    const renamed = await updateProfileName(profile.id, 'Nuevo nombre');
    expect(renamed?.name).toBe('Nuevo nombre');
    expect(new Date(renamed!.updated_at).getTime()).toBeGreaterThanOrEqual(
      new Date(profile.updated_at).getTime()
    );

    expect((await updateProfileLanguage(profile.id, 'en-US'))?.language).toBe('en-US');
    expect((await updateProfileRole(profile.id, 'operator'))?.role).toBe('operator');
  });

  it('rejects a language outside the allowed set', async () => {
    const profile = await createTestProfile();
    created.push(profile);

    await expect(
      updateProfileLanguage(profile.id, 'fr-FR' as unknown as 'en-US')
    ).rejects.toThrow();
  });

  it('returns null when updating a profile that does not exist', async () => {
    expect(await updateProfileName(MISSING_UUID, 'Nobody')).toBeNull();
  });

  it('cascades the delete to every table that owns rows of the profile', async () => {
    const profile = await createTestProfile();
    const message = await createTestMessage(profile);
    await logConsumption(profile.id, message.id, 100, 0.0001);
    await checkAndIncrementQuota(profile.id);
    await createConversation(profile.id, 'Second conversation');

    expect(await deleteProfile(profile.id)).toBe(true);

    const client = getClient();
    for (const table of ['conversations', 'daily_quotas', 'consumption_logs']) {
      const { data } = await client.from(table).select('id').eq('profile_id', profile.id);
      expect(data).toEqual([]);
    }
    const { data: messages } = await client.from('messages').select('id').eq('id', message.id);
    expect(messages).toEqual([]);

    await getClient().auth.admin.deleteUser(profile.auth_user_id);
  });

  it('reports false when deleting a profile that does not exist', async () => {
    expect(await deleteProfile(MISSING_UUID)).toBe(false);
  });
});
