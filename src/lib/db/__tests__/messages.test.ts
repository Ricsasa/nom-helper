import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createConversation } from '../conversations';
import { createMessage, getMessageById, getMessagesByConversation } from '../messages';
import { Conversation, Profile } from '../types';
import { createTestProfile, deleteTestProfile, messagePayload, MISSING_UUID } from './helpers';

describe('messages domain', () => {
  let profile: Profile;
  let conversation: Conversation;

  beforeEach(async () => {
    profile = await createTestProfile();
    conversation = await createConversation(profile.id, 'Test conversation');
  });

  afterEach(async () => {
    await deleteTestProfile(profile);
  });

  it('stores every field of the response contract, citations included', async () => {
    const payload = messagePayload();
    const message = await createMessage(conversation.id, payload);

    expect(message).toMatchObject(payload);
    expect(Array.isArray(message.citations)).toBe(true);
    expect(message.citations[0].article).toBe('210-19');
  });

  it('stores an insufficient information answer with no citations', async () => {
    const message = await createMessage(
      conversation.id,
      messagePayload({ insufficient_info: true, citations: [], confidence_level: 'low' })
    );

    expect(message.insufficient_info).toBe(true);
    expect(message.citations).toEqual([]);
  });

  it('rejects a confidence level outside the allowed set', async () => {
    await expect(
      createMessage(
        conversation.id,
        messagePayload({ confidence_level: 'certain' as unknown as 'high' })
      )
    ).rejects.toThrow();
  });

  it('rejects a message for a conversation that does not exist', async () => {
    await expect(createMessage(MISSING_UUID, messagePayload())).rejects.toThrow();
  });

  it('returns the messages of the conversation oldest first', async () => {
    const first = await createMessage(conversation.id, messagePayload({ query: 'First' }));
    const second = await createMessage(conversation.id, messagePayload({ query: 'Second' }));

    const list = await getMessagesByConversation(conversation.id);
    expect(list.map((row) => row.id)).toEqual([first.id, second.id]);
  });

  it('returns an empty list for a conversation with no messages', async () => {
    expect(await getMessagesByConversation(MISSING_UUID)).toEqual([]);
  });

  it('reads one message by id and null for an unknown id', async () => {
    const message = await createMessage(conversation.id, messagePayload());
    expect(await getMessageById(message.id)).toMatchObject({ id: message.id });
    expect(await getMessageById(MISSING_UUID)).toBeNull();
  });
});
