# NOM Helper — agent rules

Source of truth for every agent working on this repository. Read this file first, then read the spec for your role in `docs/specs/`.

NOM Helper is a technical reference assistant for Mexican electrical standards, starting with NOM-001-SEDE. Stack: Next.js, TypeScript, Tailwind CSS, Supabase, Groq. The RAG pipeline is not implemented yet.

---

## 1. Actors and ownership

| Actor | Owns | Never touches |
| --- | --- | --- |
| **DB agent** | Schema, migrations, and data access functions in the `public` schema of Supabase | The `rag` schema, RAG logic, UI components |
| **Frontend agent** | The Next.js interface, built from the Claude Design handoff | Any schema, direct Supabase queries, RAG logic |
| **Ricardo (developer)** | The RAG pipeline and the `rag` schema, exclusively | — |

One rule overrides everything else: **no agent works on the RAG pipeline, under any circumstance.** If a task requires it, stop and hand the task to Ricardo.

---

## 2. Hard prohibitions

These are not preferences. An agent that breaks one of these stops and reports instead of proceeding.

1. **The `rag` schema belongs to the developer.** No agent reads it, writes it, migrates it, or references it.
2. **No agent implements RAG logic.** This covers the PDF parser, chunking, embeddings, retrieval, reranking, and system prompts.
3. **The frontend agent writes no direct Supabase query.** It consumes only the data access functions the DB agent defines. A Supabase client call inside a component, a hook, or a route handler written by the frontend agent is a defect.
4. **No agent writes `created_at` or `updated_at` from the application.** They are database metadata, set by triggers.
5. **`plans` and `subscriptions` exist in the schema, but billing logic is not active yet.** Treat both tables as structure only. Do not implement charges, plan enforcement, renewals, or a payment provider integration until the developer asks for it.

---

## 3. Code conventions

- **Everything code-related is written in English. No exceptions and no mixed languages.** This covers identifiers, comments, commit messages, migration names, test names, pull request text, and documentation.
  Product copy that the user reads stays in Spanish. Never translate a user interface string, an error message shown to a user, or the text of a standard.
- **Users are referenced by `profile_id`, never by `auth_user_id`.** `profiles` is the only table that knows `auth_user_id`. Every other table, function, and application-level type uses `profile_id`.
- **`daily_quotas` rows are created lazily, with an atomic upsert** (`INSERT ... ON CONFLICT DO UPDATE`). There are no cron jobs and no pre-population.

---

## 4. Directory map

| Path | Contents | Committed |
| --- | --- | --- |
| `docs/specs/` | The spec for each agent. Reading your spec is mandatory before any task. | Yes |
| `docs/briefs/` | Design briefs and the design handoff. The reference for the frontend agent. | Yes |
| `docs/tutorials/db/` | Tutorials written by the DB agent. | Yes |
| `docs/tutorials/fe/` | Tutorials written by the frontend agent. | Yes |

Tutorials are committed. They are part of the repository, reviewed like any other
document, and they travel with the code they explain.

The Claude Design import currently lives in `docs/design/`. It is the frontend agent's design source until it moves into `docs/briefs/`.

---

## 5. Tutorials — both agents

After every migration, data access function, component, or significant feature, write one entry in your tutorials directory: `docs/tutorials/db/` for the DB agent, `docs/tutorials/fe/` for the frontend agent.

Each entry documents:

1. What was built.
2. Why that decision was taken.
3. What alternatives existed, and why they lost.
4. What an intermediate Next.js developer learns from it.

The file name reflects the task, not the date. The tone is technical and direct.

---

## 6. Before you start

1. Read the spec for your role in `docs/specs/`.
2. Confirm the task belongs to your role, per section 1.
3. If the task touches the `rag` schema or RAG logic, stop and report it. Do not work around it.
