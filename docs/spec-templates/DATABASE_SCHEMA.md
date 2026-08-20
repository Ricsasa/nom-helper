# Database schema

> Template. Document the real schema here before you create the migrations.

## Tables

### `items`

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `user_id` | `uuid` | `not null`, FK to `auth.users(id)` `on delete cascade` |
| `name` | `text` | `not null`, `check (char_length(name) between 1 and 100)` |
| `created_at` | `timestamptz` | `not null default now()` |
| `updated_at` | `timestamptz` | `not null default now()` |

Indexes: one for every foreign key (`items_user_id_idx`), plus the ones each list query requires.

## Row Level Security

Every table with a `user_id` column runs RLS with four policies: select, insert, update, and delete. Wrap the session function in a subselect, so the planner evaluates it once:

```sql
alter table public.items enable row level security;

create policy "items_select_own" on public.items
  for select to authenticated
  using ((select auth.uid()) = user_id);
```

## Triggers

- `updated_at`: a `before update` trigger that writes `now()`.
- User creation: an `after insert on auth.users` trigger, when the project must create initial rows.

## Migrations

Write one migration per change, in `supabase/migrations/`. Never edit a migration after you apply it. Run `mcp__supabase__get_advisors` to verify that no table lacks RLS and no foreign key lacks an index.
