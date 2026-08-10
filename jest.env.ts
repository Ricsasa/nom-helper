// Modules that read the backend URL throw at import time when it is unset.
// Tests never reach a real backend (the client is mocked), so fake values are
// enough. Unused entries are harmless.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key';
process.env.NEXT_PUBLIC_CONVEX_URL ||= 'https://test.convex.cloud';
