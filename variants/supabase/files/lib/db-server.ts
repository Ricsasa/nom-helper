import { SupabaseClient } from '@supabase/supabase-js';
import { Item, ItemInput } from './types';

/**
 * Every query in this file runs through the caller's client, so RLS decides
 * what is visible. The explicit `user_id` filter is a second lock, not the
 * first one.
 *
 * This is the example resource. Copy the shape, drop the name.
 */

// Without paging, an unbounded select is a request-sized hole: one account with
// a large history makes every list response arbitrarily large.
export const MAX_ROWS = 1000;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export async function listItems(client: SupabaseClient, userId: string): Promise<Item[]> {
  return unwrap(
    await client
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_ROWS)
  );
}

export async function getItem(
  client: SupabaseClient,
  userId: string,
  itemId: string
): Promise<Item | null> {
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('id', itemId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Item | null;
}

export async function createItem(
  client: SupabaseClient,
  userId: string,
  input: ItemInput
): Promise<Item> {
  const row = { user_id: userId, name: input.name.trim() };
  return unwrap(await client.from('items').insert(row).select('*').single());
}

/** Returns null when no row matched, which the handler turns into a 404. */
export async function updateItem(
  client: SupabaseClient,
  userId: string,
  itemId: string,
  patch: Partial<ItemInput>
): Promise<Item | null> {
  const { data, error } = await client
    .from('items')
    .update(patch)
    .eq('id', itemId)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Item | null;
}

export async function deleteItem(
  client: SupabaseClient,
  userId: string,
  itemId: string
): Promise<boolean> {
  const { data, error } = await client
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data !== null;
}
