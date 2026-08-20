import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createConversation,
  deleteAllConversationsByProfile,
  deleteConversation,
  getConversationById,
  getConversationsByProfile,
  updateConversationTitle,
} from '../conversations';
import { Profile } from '../types';
import { createTestProfile, deleteTestProfile, MISSING_UUID } from './helpers';

describe('conversations domain', () => {
  let owner: Profile;
  let stranger: Profile;

  beforeEach(async () => {
    owner = await createTestProfile('Owner');
    stranger = await createTestProfile('Stranger');
  });

  afterEach(async () => {
    await deleteTestProfile(owner);
    await deleteTestProfile(stranger);
  });

  it('creates a conversation owned by the profile', async () => {
    const conversation = await createConversation(owner.id, 'Calibre de conductores');
    expect(conversation).toMatchObject({ profile_id: owner.id, title: 'Calibre de conductores' });
  });

  it('rejects a conversation for a profile that does not exist', async () => {
    await expect(createConversation(MISSING_UUID, 'Orphan')).rejects.toThrow();
  });

  it('lists only the conversations of the profile, newest first', async () => {
    const first = await createConversation(owner.id, 'First');
    const second = await createConversation(owner.id, 'Second');
    await createConversation(stranger.id, 'Not yours');

    const list = await getConversationsByProfile(owner.id);
    expect(list.map((row) => row.id)).toEqual([second.id, first.id]);
  });

  it('returns null when the profile does not own the conversation', async () => {
    const conversation = await createConversation(owner.id, 'Private');

    expect(await getConversationById(conversation.id, owner.id)).toMatchObject({
      id: conversation.id,
    });
    expect(await getConversationById(conversation.id, stranger.id)).toBeNull();
  });

  it('updates the title', async () => {
    const conversation = await createConversation(owner.id, 'Untitled');
    expect((await updateConversationTitle(conversation.id, 'Puesta a tierra'))?.title).toBe(
      'Puesta a tierra'
    );
    expect(await updateConversationTitle(MISSING_UUID, 'Nothing')).toBeNull();
  });

  it('deletes only a conversation the profile owns', async () => {
    const conversation = await createConversation(owner.id, 'To delete');

    expect(await deleteConversation(conversation.id, stranger.id)).toBe(false);
    expect(await deleteConversation(conversation.id, owner.id)).toBe(true);
    expect(await getConversationById(conversation.id, owner.id)).toBeNull();
  });

  it('deletes every conversation of one profile and leaves the others', async () => {
    await createConversation(owner.id, 'One');
    await createConversation(owner.id, 'Two');
    await createConversation(stranger.id, 'Untouched');

    expect(await deleteAllConversationsByProfile(owner.id)).toBe(2);
    expect(await getConversationsByProfile(owner.id)).toEqual([]);
    expect(await getConversationsByProfile(stranger.id)).toHaveLength(1);
  });
});
