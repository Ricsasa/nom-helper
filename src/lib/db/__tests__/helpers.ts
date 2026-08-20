import { randomUUID } from 'crypto';
import { getClient } from '../client';
import { createProfile } from '../auth';
import { createConversation } from '../conversations';
import { createMessage } from '../messages';
import { Message, MessagePayload, Profile } from '../types';

/**
 * The tests hit a real local PostgreSQL instance. Nothing here is mocked, so
 * every helper that creates data also gives the caller the identifier it needs
 * to delete it again.
 */

/** Creates an auth user and its profile. Deleting the user cascades to both. */
export async function createTestProfile(name = 'Test user'): Promise<Profile> {
  const { data, error } = await getClient().auth.admin.createUser({
    email: `test-${randomUUID()}@example.test`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(error?.message ?? 'auth user not created');
  return createProfile(data.user.id, name);
}

/** Removes the auth user, and with it the profile and every row it owns. */
export async function deleteTestProfile(profile: Profile): Promise<void> {
  await getClient().auth.admin.deleteUser(profile.auth_user_id);
}

export function messagePayload(overrides: Partial<MessagePayload> = {}): MessagePayload {
  return {
    query: '¿Cuál es el calibre mínimo para un circuito derivado?',
    summary: 'El calibre mínimo es 14 AWG de cobre.',
    explanation: 'La NOM-001-SEDE establece el calibre mínimo en circuitos derivados.',
    citations: [{ chapter: '210', article: '210-19', page: '145', excerpt: 'Calibre mínimo...' }],
    confidence_level: 'high',
    insufficient_info: false,
    norm_version: 'NOM-001-SEDE-2012',
    ...overrides,
  };
}

/** Profile, conversation and one message: the smallest complete chain. */
export async function createTestMessage(profile: Profile): Promise<Message> {
  const conversation = await createConversation(profile.id, 'Test conversation');
  return createMessage(conversation.id, messagePayload());
}

export const MISSING_UUID = '00000000-0000-0000-0000-000000000000';
