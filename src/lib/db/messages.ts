import { getClient, unwrap, unwrapMaybe } from './client';
import { Message, MessagePayload } from './types';

/**
 * The payload is the response contract. Each field lands in its own column;
 * citations lands in JSONB because the RAG pipeline owns its shape.
 */

export async function createMessage(
  conversationId: string,
  payload: MessagePayload
): Promise<Message> {
  return unwrap<Message>(
    await getClient()
      .from('messages')
      .insert({ conversation_id: conversationId, ...payload })
      .select('*')
      .single()
  );
}

export async function getMessagesByConversation(conversationId: string): Promise<Message[]> {
  return unwrap<Message[]>(
    await getClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
  );
}

export async function getMessageById(messageId: string): Promise<Message | null> {
  return unwrapMaybe<Message>(
    await getClient().from('messages').select('*').eq('id', messageId).maybeSingle()
  );
}
