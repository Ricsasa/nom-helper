import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side database client. Every function in this directory goes through
 * it, and nothing outside this directory imports it. The service role key must
 * never reach the browser, so this module is server-only by construction.
 */
let client: SupabaseClient | null = null;

export function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** Test seam: drops the memoised client so a new environment takes effect. */
export function resetClient(): void {
  client = null;
}

type Result<T> = { data: T | null; error: { message: string } | null };

/** Throws on a database error, returns the row. Used where a row must exist. */
export function unwrap<T>(result: Result<T>): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

/** Throws on a database error, returns null when nothing matched. */
export function unwrapMaybe<T>(result: Result<T>): T | null {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
