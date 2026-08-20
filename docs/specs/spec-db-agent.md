# DB Agent Spec

Source of truth for the DB agent. Read `CLAUDE.md` first, then this document, before touching anything.

---

## 1. Role and boundaries

The DB agent owns the entire data layer of NOM Helper within the `public` schema of Supabase. This means the schema definition, all migrations, every data access function the rest of the application consumes, and the unit tests that cover those functions.

The frontend agent calls functions. It never writes queries. The developer owns the `rag` schema entirely. The DB agent has no visibility into it.

| Owns | Never touches |
|---|---|
| `public` schema: tables, indexes, constraints | `rag` schema — any table, any query, any migration |
| All migrations in `supabase/migrations/` | RAG logic: PDF parser, chunking, embeddings, retrieval, reranking |
| Data access functions consumed by Next.js | UI components, hooks, or any frontend file |
| Trigger definitions for `updated_at` | Supabase Auth configuration |
| Unit tests for all data access functions | Billing logic of any kind |
| `plans` and `subscriptions` structure | — |

---

## 2. Hard prohibitions

These are not guidelines. If a task requires crossing one of these lines, stop and report it. Do not work around it.

1. **Never read, write, migrate, or reference the `rag` schema.** It does not exist from this agent's perspective.
2. **Never implement RAG logic.** If a task description mentions embeddings, chunking, retrieval, or system prompts, it belongs to the developer.
3. **Never write `created_at` or `updated_at` from application code.** These fields are set exclusively by database triggers.
4. **Never pre-populate `daily_quotas`.** Rows are created lazily on first query of the day using an atomic upsert. No cron jobs, no batch inserts.
5. **Never implement billing logic.** `plans` and `subscriptions` are structural placeholders. Their data access functions are read-only stubs until billing is explicitly scoped.
6. **Never reference `auth_user_id` outside of `profiles`.** Every other table, function, and type uses `profile_id` exclusively.

---

## 3. Supabase setup

NOM Helper uses Supabase as the PostgreSQL host for the MVP. The current runner is Supabase CLI. Migrations are written in standard PostgreSQL SQL with no Supabase-specific abstractions inside the SQL files — this guarantees they can be executed against any PostgreSQL instance (RDS, Aurora, or self-hosted) by changing the connection string only.

**Schemas in use:**

| Schema | Owner | Purpose |
|---|---|---|
| `auth` | Supabase | Authentication. Managed entirely by Supabase. Read-only from this agent. |
| `public` | DB agent | Application data. All nine tables live here. |
| `rag` | Developer | RAG pipeline data. Invisible to this agent. |

**Required extension:**

`pgvector` must be enabled before any table is created. This is handled by the first migration file. Even though `pgvector` is used exclusively in the `rag` schema, the extension is instance-wide and must be enabled by this agent as part of the initial setup.

**Relationship with `auth.users`:**

`profiles` has a `1:1` relationship with `auth.users` via `auth_user_id`. This is the only point of contact between the `public` schema and Supabase Auth. All other tables reference `profile_id`. If the authentication provider changes in the future (e.g., AWS Cognito), only `profiles` requires modification.

---

## 4. Migration conventions

**File location:** `supabase/migrations/`

**Naming:** `YYYYMMDDHHMMSS_description_in_snake_case.sql`
Example: `20240801120000_create_profiles_table.sql`

The timestamp prefix guarantees deterministic execution order. Never rely on alphabetical order.

**One migration, one responsibility.** Each file does exactly one thing. Do not mix table creation with trigger attachment, index creation with constraint addition, or any two unrelated operations. If a migration fails, the scope of the failure must be immediately obvious.

**Standard PostgreSQL SQL only.** No Supabase helpers, no proprietary functions, no platform-specific syntax inside migration files. The runner is Supabase CLI today. It will be replaced by a direct PostgreSQL connection when the project moves to AWS. The SQL files will not change when that happens.

**Forward-only migrations.** No rollback (`down`) migrations in this phase. If a migration produces an incorrect result, write a new migration that corrects it. This decision is revisited when the project scales.

**Execution order follows schema dependencies:**

1. Enable extensions (`pgvector`)
2. Create the `set_updated_at` trigger function
3. Create tables with no foreign keys (`plans`)
4. Create tables that depend on those (`profiles`, `subscriptions`)
5. Create tables that depend on `profiles` (`conversations`, `daily_quotas`, `consumption_logs`)
6. Create tables that depend on `conversations` (`messages`)
7. Create tables that depend on `messages` (`response_ratings`, `consumption_logs` FK to messages)
8. Create tables that depend on `response_ratings` (`operator_reviews`)
9. Attach triggers to all tables

**Deployment:**

- Local and development: `supabase migration up` or `supabase db push`
- Production (current): same command pointing to the Supabase cloud project
- Production (future): GitHub Actions workflow on merge to `main`, running migrations against `DATABASE_URL` stored as a repository secret

---

## 5. Schema: public

For the full entity relationship diagram, see `docs/specs/erd-schema-public.mermaid`.

### 5.1 `profiles`

Extends `auth.users`. Created automatically when a user registers via a Supabase Auth trigger.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `auth_user_id` | `uuid` | FK → `auth.users.id`. Unique. The only field that references Auth directly. |
| `name` | `text` | Display name. |
| `role` | `text` | `user` or `operator`. Default: `user`. |
| `language` | `text` | `es-MX` or `en-US`. Default: `es-MX`. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

### 5.2 `plans`

Structural placeholder. No billing logic is active. Populated manually by the operator for now.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `name` | `text` | Plan display name. |
| `daily_quota_limit` | `integer` | Max queries per day for this plan. |
| `price` | `numeric` | Monthly price. Zero for the free plan. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

### 5.3 `subscriptions`

Structural placeholder. No billing logic is active. Links a profile to a plan.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `plan_id` | `uuid` | FK → `plans.id` |
| `starts_at` | `date` | Semantic field: when the subscription period begins. |
| `ends_at` | `date` | Semantic field: when the subscription period ends. |
| `status` | `text` | `active`, `expired`, `cancelled`. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

### 5.4 `conversations`

A conversation groups messages under a user. Title is derived from the first query.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `title` | `text` | Derived from the first query of the conversation. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

### 5.5 `messages`

One row per exchange: the user's query and the system's structured response.

The response is not stored as plain text. Every structured field is its own column. `citations` is a JSONB array because its length varies and its structure is defined by the RAG pipeline, not by this schema.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `conversation_id` | `uuid` | FK → `conversations.id` |
| `query` | `text` | The user's original query. |
| `summary` | `text` | Direct answer in one or two sentences. |
| `explanation` | `text` | Technical development of the answer. |
| `citations` | `jsonb` | Array of citation objects: `{ chapter, article, page, excerpt }`. |
| `confidence_level` | `text` | `high`, `medium`, `low`. |
| `insufficient_info` | `boolean` | True when the system could not find enough support in the corpus. |
| `norm_version` | `text` | The version of the standard active at the time of the query. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

### 5.6 `response_ratings`

One row per rated message. Not every message gets rated.

`review_status` is set by the operator workflow, not by the user. Default is `pending` for negative ratings and `not_applicable` for positive ones.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `message_id` | `uuid` | FK → `messages.id`. Unique. One rating per message. |
| `is_positive` | `boolean` | True for thumbs up, false for thumbs down. |
| `reason_category` | `text` | Nullable. Only for negative ratings. One of six defined categories. |
| `reason_text` | `text` | Nullable. Free text comment from the user. |
| `review_status` | `text` | `pending`, `reviewed`, `discarded`, `not_applicable`. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

**Reason categories (negative ratings only):**

- `citation_mismatch` — the citation does not match what the response says
- `off_topic` — the response does not answer the query
- `missing_info` — relevant norm content is absent
- `wrong_interpretation` — the interpretation of the norm is incorrect
- `wrong_reference` — the chapter, article, or page number is incorrect
- `other` — free text only

### 5.7 `operator_reviews`

Created by the operator when reviewing a negative rating. Not every negative rating gets a review row — only those the operator decides to process.

`technical_cause` is the operator's classification of the root cause in technical terms, distinct from the user-reported `reason_category`.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `rating_id` | `uuid` | FK → `response_ratings.id`. Unique. One review per rating. |
| `technical_cause` | `text` | Operator's root cause classification. |
| `destination` | `text` | `add_to_eval_set`, `marked_reviewed`, `discarded`. |
| `reviewed_at` | `timestamptz` | Semantic field: when the operator completed the review. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

**Technical cause categories:**

- `wrong_chunk_retrieved` — the retrieved text was not relevant to the query
- `correct_chunk_wrong_response` — the chunk was correct but the LLM used it incorrectly
- `content_not_in_corpus` — the information is not in the loaded documents
- `wrong_citation_attribution` — the citation metadata is incorrect
- `no_issue` — the negative rating was not warranted

### 5.8 `daily_quotas`

Tracks query consumption per user per calendar day. **Rows are created lazily** on the first query of the day via atomic upsert. No pre-population, no cron jobs.

`reset_at` is a semantic field: the timestamp when the counter was last reset to zero. It is distinct from `updated_at`, which reflects any row modification.

The daily limit is currently hardcoded to 10. When billing is active, this agent will read the limit from the user's active `subscriptions` → `plans.daily_quota_limit` instead.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `queries_used` | `integer` | Counter. Starts at 1 on row creation. |
| `quota_date` | `date` | The calendar date this row tracks. |
| `reset_at` | `timestamptz` | Semantic field: last reset timestamp. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

Unique constraint: `(profile_id, quota_date)`.

### 5.9 `consumption_logs`

Append-only log. One row per processed query. Never updated after insertion.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `message_id` | `uuid` | FK → `messages.id` |
| `tokens_used` | `integer` | Approximate token count for the query and response. |
| `estimated_cost` | `numeric` | Estimated cost in USD based on current Groq pricing. |
| `created_at` | `timestamptz` | Set by trigger. |
| `updated_at` | `timestamptz` | Set by trigger. |

---

## 6. Triggers

A single reusable trigger function handles `updated_at` across all tables. It is defined once and attached to every table in the `public` schema.

The function is created in its own migration file before any table migration runs.

The trigger fires `BEFORE UPDATE` on each row. It sets `updated_at = NOW()`. Application code never writes this field.

Tables where `updated_at` is attached:
`profiles`, `plans`, `subscriptions`, `conversations`, `messages`, `response_ratings`, `operator_reviews`, `daily_quotas`, `consumption_logs`.

---

## 7. Data access functions

All data access functions live in `src/lib/db/`. They are the only entry point to the database for the rest of the application. No component, hook, route handler, or server action writes a Supabase query directly.

Functions are grouped by domain. Each function has a single responsibility.

### 7.1 Auth domain

- `createProfile(authUserId, name)` — called by Supabase Auth trigger on registration
- `getProfileByAuthUserId(authUserId)` — resolves a session to a profile
- `getProfileById(profileId)`
- `updateProfileName(profileId, name)`
- `updateProfileLanguage(profileId, language)` — `es-MX` or `en-US`
- `updateProfileRole(profileId, role)` — operator only
- `deleteProfile(profileId)` — cascades to all owned rows

### 7.2 Conversations domain

- `createConversation(profileId, title)`
- `getConversationsByProfile(profileId)` — returns list ordered by `created_at DESC`
- `getConversationById(conversationId, profileId)` — profile scoping is mandatory
- `updateConversationTitle(conversationId, title)`
- `deleteConversation(conversationId, profileId)`
- `deleteAllConversationsByProfile(profileId)`

### 7.3 Messages domain

- `createMessage(conversationId, payload)` — payload maps to all structured fields
- `getMessagesByConversation(conversationId)` — ordered by `created_at ASC`
- `getMessageById(messageId)`

### 7.4 Rate limiting domain

- `checkAndIncrementQuota(profileId)` — atomic upsert. Returns `{ allowed: boolean, remaining: number }`. This is the only function that writes to `daily_quotas`.
- `getQuotaStatus(profileId)` — returns current usage and remaining quota for display

### 7.5 Ratings domain

- `createRating(messageId, payload)` — creates or updates the rating for a message
- `getRatingByMessage(messageId)`
- `getPendingRatings()` — operator only. Returns negative ratings with `review_status = pending`

### 7.6 Operator domain

- `createOperatorReview(ratingId, payload)` — creates the review and updates `response_ratings.review_status`
- `getOperatorReviewByRating(ratingId)`
- `getReviewQueue()` — returns pending negative ratings joined with their message and query

### 7.7 Consumption domain

- `logConsumption(profileId, messageId, tokensUsed, estimatedCost)`
- `getConsumptionByProfile(profileId, dateRange)` — operator use, for the consumption panel
- `getTotalConsumptionSummary(dateRange)` — operator only. Aggregated view.

### 7.8 Plans and subscriptions domain (stubs)

These functions exist as structural stubs. They return hardcoded values until billing is active. No billing logic is implemented here.

- `getActivePlanByProfile(profileId)` — returns the free plan record for all users
- `getSubscriptionByProfile(profileId)` — returns a stub subscription tied to the free plan

---

## 8. Plans and subscriptions

`plans` and `subscriptions` exist in the schema from the start. Their purpose is to make the future billing integration a data migration and a logic addition, not a schema redesign.

**What is implemented now:**
- Table structure and migrations
- Read-only stub functions (section 7.8)
- One seed record for the free plan: `{ name: 'free', daily_quota_limit: 10, price: 0 }`

**What is not implemented:**
- Payment processing of any kind
- Subscription lifecycle management (upgrades, cancellations, renewals)
- Quota enforcement reading from `subscriptions`. The daily limit is hardcoded to 10 in `checkAndIncrementQuota`.
- Any UI for plan selection or billing management

When billing is scoped, `checkAndIncrementQuota` will read `daily_quota_limit` from the user's active plan instead of the hardcoded value. That is the only function that changes.

---

## 9. Unit tests

Every data access function in `src/lib/db/` has a corresponding unit test. Tests live in `src/lib/db/__tests__/`, mirroring the domain structure.

**Framework:** Vitest.

**Test database:** a local Supabase instance via `supabase start`. Tests never run against the production database. The test environment uses a separate `.env.test` file.

**Conventions:**

- One test file per domain: `auth.test.ts`, `conversations.test.ts`, `rate-limiting.test.ts`, etc.
- Each function has at least one happy path test and one failure path test.
- Tests clean up after themselves. Each test that inserts data deletes it on teardown.
- No mocking of the database layer. Tests hit a real local PostgreSQL instance. Mocks are reserved for external services (Groq, Supabase Auth).

**What must be tested without exception:**

- `checkAndIncrementQuota` — the atomic upsert, the counter increment, the limit enforcement, and the race condition behavior.
- `deleteProfile` — cascade coverage across all owned tables.
- `createRating` — upsert behavior when a rating already exists for a message.
- `createOperatorReview` — that `response_ratings.review_status` is updated atomically.
- All functions that enforce `profile_id` scoping — a query with the wrong `profile_id` must return null or an empty result, never another user's data.

**Running tests:**

```bash
supabase start
npx vitest run src/lib/db
```

---

## 10. Tutorial instructions

After completing each migration, trigger definition, group of related data access functions, or test suite, write one entry in `docs/tutorials/db/`.

**When to write:** only for new or architecturally significant work. Do not document a function that repeats an established pattern already covered by an existing tutorial. Use judgment — if the decision or technique is genuinely different from what has been documented before, write the entry.

**Each entry must cover:**

1. **Problem** — what specific requirement or constraint drove this work.
2. **Relevant files** — the migration files, function files, and test files involved.
3. **Pattern or technique** — the PostgreSQL, Supabase, or data modeling concept applied. Name it explicitly.
4. **Decision tradeoffs** — what alternatives existed, why they were not chosen, and what the current approach costs.

**File naming:** reflects the subject, not the date. Examples: `lazy-quota-creation-upsert.md`, `updated-at-trigger-pattern.md`, `profile-scoping-in-queries.md`.

**Tone:** technical and direct. Written for a developer who knows JavaScript well but is building their PostgreSQL and Supabase knowledge. No preamble. No closing summary. Each entry stands alone.
