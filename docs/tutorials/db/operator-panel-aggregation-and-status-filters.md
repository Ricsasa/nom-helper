# Operator panel: per-profile aggregation and status filters

## Problem

The operator consumption panel ranks users by how much they consume. The
operator review screen must show reviewed and discarded ratings, not only the
pending ones. Two requirements, two different techniques.

## Relevant files

- `supabase/migrations/20260820121700_create_all_profile_consumption_function.sql`
- `src/lib/db/consumption.ts` — `listAllProfileConsumption`
- `src/lib/db/operator.ts` — `getReviewQueueByStatus`, `getReviewQueue`
- `src/lib/db/types.ts` — `ProfileConsumption`
- `src/lib/db/__tests__/consumption.test.ts`, `src/lib/db/__tests__/operator.test.ts`

## Pattern or technique

**Aggregation in the database.** `GROUP BY profile_id` with `ORDER BY
SUM(tokens_used) DESC` runs inside a `LANGUAGE sql` function that returns a
table. PostgREST exposes it as an RPC, so Node receives one row per profile
instead of every log row. This repeats the technique of
`total_consumption_summary`, applied to a grouped result instead of a scalar one.

The function joins `profiles` for the display name. A profile with no logs does
not appear: an inner join plus `GROUP BY` produces no group for it, and a
ranking of consumption has nothing to say about a user who consumed nothing.

**Parameter instead of a second query.** `getReviewQueueByStatus(status)` holds
the filter, and `getReviewQueue()` calls it with `pending`. Every existing caller
of `getReviewQueue` keeps working, and there is one query to maintain.

The parameter type is `Extract<ReviewStatus, 'pending' | 'reviewed' |
'discarded'>`. It derives from the shared union, so a change to `ReviewStatus`
reaches this signature. `not_applicable` stays out: it belongs to positive
ratings, and the queue only holds negative ones.

## Decision tradeoffs

A `SELECT` with `.select('profile_id, tokens_used.sum()')` was possible, but
PostgREST aggregate syntax is a platform feature. Migrations in this project are
standard PostgreSQL, so the SQL function moves with the database to RDS
unchanged.

`listAllProfileConsumption` takes no date range and no pagination. The panel
shows all time today. A range parameter is a new argument on the same function
when the panel asks for one; adding it now would be a parameter nobody passes.

The cost of the join: renaming `profiles.name` breaks the function silently
until it runs. The tests cover the returned `profile_name`, so a rename fails the
suite rather than the panel.
