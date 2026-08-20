# NOM Helper — Orchestrator

Defines the relationship between agents, their execution order, synchronization points, and shared contracts. Read this after `CLAUDE.md` and before any agent spec.

---

## Agents

| Agent | Spec | Primary output |
|---|---|---|
| DB agent | `docs/specs/spec-db-agent.md` | Schema, migrations, data access functions, DB tests |
| Frontend agent | `docs/specs/spec-frontend-agent.md` | Next.js pages, components, hooks, UI tests |
| Ricardo (developer) | — | RAG pipeline, `rag` schema, system prompts |

The developer is not an agent in the orchestration sense. Their work is not scheduled or coordinated here — it runs independently and connects to the system through the response contract defined below.

---

## Execution order

Work is not fully parallel. There are two phases and one integration gate.

### Phase 1 — Foundation (serial)

The DB agent runs first and alone.

**What it delivers before the frontend agent starts:**
- All nine migrations applied to the local Supabase instance
- All data access functions in `src/lib/db/` implemented and tested
- The free plan seed record inserted
- The `set_updated_at` trigger attached to all tables

The frontend agent does not start until Phase 1 is complete. Starting in parallel would require the frontend agent to mock the entire data layer, which creates drift between the mock and the real implementation.

### Phase 2 — Interface (parallel capable)

Once Phase 1 is complete, both the frontend agent and the developer can work in parallel.

- Frontend agent builds UI against the real data access functions
- Developer builds the RAG pipeline against the `rag` schema

They do not share files. They do not block each other.

### Integration gate

Before the first end-to-end query can work, the following must be true simultaneously:

- [ ] Frontend agent: chat UI sends a query to the API route
- [ ] Developer: RAG pipeline returns a structured response matching the response contract
- [ ] DB agent: `createMessage` persists the response correctly
- [ ] DB agent: `checkAndIncrementQuota` enforces the daily limit

This gate is the first moment all three actors touch the same data flow. Plan a joint review here before declaring the integration complete.

---

## Response contract

The single shared artifact between the developer's RAG pipeline and the rest of the system. Both the frontend agent and the DB agent depend on this structure. It must not change without coordinating all three actors.

```typescript
type Citation = {
  chapter: string
  article: string
  page: string
  excerpt: string
}

type Message = {
  query: string
  summary: string
  explanation: string
  citations: Citation[]
  confidence_level: 'high' | 'medium' | 'low'
  insufficient_info: boolean
  norm_version: string
}
```

**Rules:**
- The RAG pipeline returns this shape. It never returns plain text.
- The DB agent stores each field as defined in `messages` table (section 5.5 of the DB spec). `citations` is stored as JSONB.
- The frontend agent renders each field as defined in the response anatomy component. It never accesses `citations` as a flat string.
- If the RAG pipeline cannot find sufficient support in the corpus, it returns `insufficient_info: true` with `citations: []`. It does not return an error.

---

## Synchronization points

Beyond the integration gate, these are moments where agents must align before continuing.

**After Phase 1:**
Developer and frontend agent both confirm the local Supabase instance is running and all migrations applied cleanly before starting Phase 2.

**Before adding a new table or field:**
Any schema change requires coordination. The DB agent does not add columns or tables to accommodate a frontend need without a spec update. The frontend agent does not request schema changes mid-sprint without documenting them as a spec amendment.

**Before changing the response contract:**
All three actors must agree. A contract change touches the RAG pipeline, the `messages` table, and the response anatomy component simultaneously.

---

## Shared directories

These directories are written by one actor and read by another. No actor writes to another's directory.

| Directory | Written by | Read by |
|---|---|---|
| `src/lib/db/` | DB agent | Frontend agent |
| `src/lib/auth/` | DB agent | Frontend agent |
| `docs/specs/` | Orchestrator / developer | All agents |
| `supabase/migrations/` | DB agent | Supabase CLI (not agents) |
| `docs/tutorials/db/` | DB agent | Developer (learning) |
| `docs/tutorials/fe/` | Frontend agent | Developer (learning) |

---

## Dependency map

```
Ricardo (RAG pipeline)
  └── depends on: response contract, rag schema (self-owned)

DB agent
  └── depends on: this orchestrator, DB spec, ERD

Frontend agent
  └── depends on: src/lib/db/ (DB agent output)
               design bundle (docs/design/)
               response contract
               i18n files (self-owned)
```

---

## What the orchestrator does not do

- It does not assign tasks. Task assignment is done by the developer in each Orca session.
- It does not resolve conflicts between agents. Conflicts go to the developer.
- It does not define implementation details. Those live in each agent's spec.
- It does not track progress. That is Orca's job.
