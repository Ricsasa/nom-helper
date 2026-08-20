# Supabase variant

Install it with `npm run setup supabase` from the boilerplate root. The script copies `files/` over the root and installs `@supabase/supabase-js`.

## What it adds

| File | What for |
| --- | --- |
| `lib/supabase.ts` | the browser client, the per-request client with the user token, and `authenticateRequest` |
| `lib/api-client.ts` | `authHeaders` and `apiRequest<T>` for the client side |
| `lib/api-response.ts` | uniform responses, a 64 KB body limit, and 500 errors that leak no detail |
| `lib/db-server.ts` | server-side data access, with the sample `items` resource |
| `lib/db-queries.ts` | React Query hooks over the internal API |
| `app/api/items/**` | reference handlers: authenticate, read, validate, query |
| `app/auth/login\|signup` | unstyled access pages |
| `components/AuthForm.tsx` | the sign-in and registration form |
| `components/SessionGate.tsx` | protects the authenticated tree and clears the cache on sign out |
| `__tests__/helpers/*` | `jsonRequest`, `malformedRequest`, and the query builder mock |
| `__tests__/api/items.test.ts` | a reference test for one handler |

## Getting started

1. Create the project at [supabase.com](https://supabase.com) and copy the URL and the publishable key.
2. Run `cp .env.local.example .env.local` and fill in the values.
3. Create the `items` table with RLS enabled. Use `docs/spec-templates/DATABASE_SCHEMA.md` as the guide:

```sql
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index items_user_id_idx on public.items (user_id);

alter table public.items enable row level security;

create policy "items_select_own" on public.items
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "items_insert_own" on public.items
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "items_update_own" on public.items
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "items_delete_own" on public.items
  for delete to authenticated using ((select auth.uid()) = user_id);
```

4. Optional: run `cp .mcp.json.example .mcp.json` and set your `project_ref`, so the agent can talk to Supabase.

## Rules

- The browser never writes to the database directly. It goes through `app/api/**`, which validates before it touches Postgres.
- RLS is the security boundary. The `user_id` filter in `lib/db-server.ts` is a second lock, not the first one.
- The `supabase` and `supabase-postgres-best-practices` skills in `.agents/skills/` cover schema, RLS, indexes, and migrations.
