import { getClient, unwrap, unwrapMaybe } from './client';
import { Conversation } from './types';

/**
 * Every read and every write is scoped by profile_id. A wrong profile_id
 * returns null or an empty list, never another user's conversation.
 */

export async function createConversation(profileId: string, title: string): Promise<Conversation> {
  return unwrap<Conversation>(
    await getClient()
      .from('conversations')
      .insert({ profile_id: profileId, title })
      .select('*')
      .single()
  );
}

export async function getConversationsByProfile(profileId: string): Promise<Conversation[]> {
  return unwrap<Conversation[]>(
    await getClient()
      .from('conversations')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
  );
}

export async function getConversationById(
  conversationId: string,
  profileId: string
): Promise<Conversation | null> {
  return unwrapMaybe<Conversation>(
    await getClient()
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('profile_id', profileId)
      .maybeSingle()
  );
}

export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<Conversation | null> {
  return unwrapMaybe<Conversation>(
    await getClient()
      .from('conversations')
      .update({ title })
      .eq('id', conversationId)
      .select('*')
      .maybeSingle()
  );
}

/** Cascades to the messages of the conversation. */
export async function deleteConversation(
  conversationId: string,
  profileId: string
): Promise<boolean> {
  const row = unwrapMaybe<{ id: string }>(
    await getClient()
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('profile_id', profileId)
      .select('id')
      .maybeSingle()
  );
  return row !== null;
}

/** Returns the number of conversations deleted. */
export async function deleteAllConversationsByProfile(profileId: string): Promise<number> {
  const rows = unwrap<{ id: string }[]>(
    await getClient().from('conversations').delete().eq('profile_id', profileId).select('id')
  );
  return rows.length;
}
