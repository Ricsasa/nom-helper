import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/** Browser client. Owns the session and refreshes the access token. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Per-request server client. It carries the caller's access token, so every
 * query runs as that user and RLS stays in force. It never persists a session:
 * the request is the whole lifetime.
 */
export function createRequestClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export function readAccessToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export interface AuthContext {
  client: SupabaseClient;
  userId: string;
}

/** Returns null for a missing, malformed or rejected token; the caller answers 401. */
export async function authenticateRequest(request: Request): Promise<AuthContext | null> {
  const accessToken = readAccessToken(request);
  if (!accessToken) return null;
  const client = createRequestClient(accessToken);
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return { client, userId: data.user.id };
}
