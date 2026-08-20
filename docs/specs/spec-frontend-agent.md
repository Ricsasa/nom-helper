# Frontend Agent Spec

Source of truth for the frontend agent. Read `CLAUDE.md` first, then this document, before touching anything.

---

## 1. Role and boundaries

The frontend agent owns the entire Next.js interface of NOM Helper. This means every page, component, hook, client-side type, and unit test for UI logic. Its design source is the Claude Design handoff bundle in `docs/design/`. Its data source is the set of functions defined by the DB agent in `src/lib/db/`.

The frontend agent is a consumer, never a producer, of data access logic.

| Owns | Never touches |
|---|---|
| All files under `src/app/`, `src/components/`, `src/hooks/` | `src/lib/db/` — any function, any file |
| Client-side types derived from DB function return types | `supabase/migrations/` — any migration file |
| UI state management | The `public` schema directly |
| Unit tests for UI logic and component behavior | The `rag` schema — any file, any reference |
| Styles and design tokens | RAG logic of any kind |

---

## 2. Hard prohibitions

These are not preferences. An agent that breaks one of these stops and reports instead of proceeding.

1. **Never write a direct Supabase query.** No `supabase.from()`, no `.select()`, no `.insert()` inside a component, hook, route handler, or server action written by this agent. Every database interaction goes through a function from `src/lib/db/`.
2. **Never reference `auth_user_id` directly.** The frontend knows `profile_id` only. Session resolution to `profile_id` is handled by auth utilities in `src/lib/auth/`.
3. **Never implement RAG logic.** If a task involves embeddings, chunking, retrieval, or prompt construction, stop and hand it to the developer.
4. **Never modify files in `src/lib/db/`.** If a needed data access function does not exist, stop and request it from the DB agent. Do not write it inline.
5. **Never write `created_at` or `updated_at` from the application.** These fields are set by database triggers.
6. **Never translate UI strings.** Product copy stays in Spanish by default. Translations are managed via i18n files, never hardcoded in components.
7. **Never use `localStorage`, `sessionStorage`, or any browser storage.** Session management is handled by Supabase Auth utilities in `src/lib/auth/`.

---

## 3. Design source

The Claude Design handoff bundle lives in `docs/design/`. Design versions are stored as numbered subdirectories: `NOM-helper-1/`, `NOM-helper-2/`, up to `NOM-helper-n/`. The active version is always the highest-numbered directory. When a new version is added, it becomes the source of truth and supersedes all previous versions. Never mix references across versions.

**What the bundle provides:**
- Component tree and layout hierarchy
- Design tokens: colors, typography, spacing
- All screen states: empty, loading, error, limit reached, insufficient info
- Responsive behavior

**Resolution order when sources conflict:**
1. `CLAUDE.md` — always wins on rules and prohibitions
2. This spec — wins on structure and conventions
3. The design bundle — wins on visual decisions
4. The briefs in `docs/briefs/` — supplementary context only

When the bundle and a brief disagree on a visual detail, the bundle wins. The briefs were the input to Claude Design; the bundle is the output.

---

## 4. Project structure

```
src/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
    (app)/
      layout.tsx
      chat/
        page.tsx
        [conversationId]/
          page.tsx
      settings/
        page.tsx
    (operator)/
      layout.tsx
      dashboard/
        page.tsx
        consumption/
          page.tsx
    layout.tsx
  components/
    auth/
    chat/
    layout/
    operator/
    shared/
    ui/
  hooks/
    use-conversation.ts
    use-messages.ts
    use-quota.ts
    use-ratings.ts
    use-operator.ts
  lib/
    db/
    auth/
    utils/
  i18n/
    es-MX.ts
    en-US.ts
  types/
    db.ts
    ui.ts
  __tests__/
    components/
    hooks/
```

Route groups use parentheses and do not affect the URL. `(auth)` and `(operator)` exist for layout isolation, not for URL structure.

---

## 5. Bilingual support (es-MX / en-US)

The application supports Spanish (es-MX, default) and English (en-US).

**Language preference** is stored in `profiles.language` and read on session load. The frontend reads it once and applies it globally. No language detection from the browser.

**i18n files** live in `src/i18n/`. Each file exports a flat object of keyed strings. Components import from the active language file — they never contain hardcoded UI strings.

**What is translated:**
- All UI labels, buttons, and navigation items
- Error messages shown to users
- Empty states and system notices
- The conversation start notice and the permanent disclaimer

**What is never translated:**
- The text of the NOM-001-SEDE standard
- Citation content (chapter, article, page, excerpt)
- Standard codes and references (NOM-001-SEDE)
- Reason categories in the rating component — always in Spanish

**Language selector on auth screens:** a two-option control (Español / English) visible before the user authenticates. No flags. Language names in their own language. Applies to the current session only — it does not persist until the user saves their preference in account settings after logging in.

**Language selector in account settings modal:** the persistent setting. Changing it calls `updateProfileLanguage(profileId, language)` and applies immediately across the interface without a reload.

---

## 6. Data access conventions

Every database call goes through a function from `src/lib/db/`. No exceptions.

**Correct pattern — server component:**
```typescript
import { getConversationsByProfile } from '@/lib/db/conversations'

export default async function ConversationsPage() {
  const conversations = await getConversationsByProfile(profileId)
  return <ConversationList conversations={conversations} />
}
```

**Correct pattern — client component with hook:**
```typescript
// src/hooks/use-conversation.ts
import { getConversationsByProfile } from '@/lib/db/conversations'

export function useConversations(profileId: string) {
  // fetch and return state
}
```

**Prohibited pattern:**
```typescript
// Never — not inside a component, hook, or route handler
const { data } = await supabase
  .from('conversations')
  .select('*')
  .eq('profile_id', profileId)
```

If a required function does not exist in `src/lib/db/`, stop. Do not write the query inline. Request the function from the DB agent and resume after it is available.

---

## 7. UI conventions

**Color and style:**
- No gradients anywhere.
- No decorative shadows.
- Solid colors only. Enterprise register.
- Green and purple are brand accent colors. They communicate identity, never state or meaning.
- State is communicated through typography weight, contrast, labels, or iconography — never through color alone.

**Typography:**
- Maximum three font weights across the entire interface.
- Size hierarchy carries meaning. Weight hierarchy carries emphasis. Color does not carry either.

**Copy:**
- All UI strings are managed through i18n files, never hardcoded.
- Default language is Spanish (es-MX).
- Names of standards (NOM-001-SEDE) are never translated or abbreviated.
- No lorem ipsum. Every component uses real technical content from the NOM-001-SEDE context.

**Tone:**
- The interface does not apologize. Error messages say what happened and how to resolve it.
- No celebratory language. No exclamation points in system messages.
- Disclaimers are informative and direct. They are part of the tool, not interruptions.

**Animation:**
- Minimum animation. Only where it communicates state change.
- No entrance animations on static content.

---

## 8. State management

**Server state:** fetched in server components where possible. Client-side fetching only when interactivity requires it.

**Client state:** React state (`useState`, `useReducer`) for local UI state. No global state library unless a specific cross-component requirement justifies it — if that happens, stop and align with the developer before adding a dependency.

**No browser storage.** No `localStorage`, no `sessionStorage`, no cookies written by the frontend. Session management is handled by Supabase Auth utilities in `src/lib/auth/`.

**Quota state:** `useQuota` hook reads from `getQuotaStatus` in `src/lib/db/`. The counter in the sidebar updates optimistically on each submitted query and reconciles with the server response.

---

## 9. Component conventions

**Naming:** PascalCase for components, camelCase for hooks, kebab-case for files.

**File per component.** One component per file. No barrel files that re-export everything from a directory.

**Props over context.** Pass props explicitly. Use React context only for values that are genuinely global to a subtree (active conversation ID, profile, quota status, active language). Do not use context to avoid prop drilling in components fewer than three levels deep.

**No inline styles.** Tailwind utility classes only. No `style={{}}` props except for dynamic values that cannot be expressed as utilities.

**Server vs client boundary:**
- Default to server components.
- Add `'use client'` only when the component needs interactivity, browser APIs, or React hooks.
- Keep client components as leaf nodes. Do not make a parent component client just to pass a handler down.

**Response anatomy component.** The structured response (summary, explanation, citations, confidence level, insufficient info flag) is a single component with defined slots. It receives a typed `Message` prop and renders each field. It does not fetch its own data.

---

## 10. Unit tests

UI logic and component behavior are tested. Tests live in `src/__tests__/`, mirroring the component and hook structure.

**Framework:** Vitest + React Testing Library.

**Conventions:**

- One test file per component or hook that contains non-trivial logic.
- Pure presentational components with no logic do not need tests.
- Tests do not hit the database. All `src/lib/db/` functions are mocked at the module level.
- Tests do not test implementation details — they test behavior visible to the user or consumer of the hook.

**What must be tested without exception:**

- `useQuota` — optimistic decrement, reconciliation with server response, disabled state at zero.
- `useConversations` — list ordering, empty state, deletion behavior.
- The response anatomy component — all four fields render correctly, insufficient info flag changes the component's visual state, confidence level renders without using color as the sole signal.
- The rating component — thumbs down opens the reason step, thumbs up does not, the component is reversible, the insufficient info state is ratable.
- The language selector — switching language on auth screens applies immediately, switching in settings calls `updateProfileLanguage`.
- Route protection — unauthenticated users are redirected from `(app)` and `(operator)` routes, non-operator users cannot access `(operator)` routes.

**Running tests:**

```bash
npx vitest run src/__tests__
```

---

## 11. Tutorial instructions

After completing every significant component, page, hook, or feature, write one entry in `docs/tutorials/fe/`.

**When to write:** only for new or architecturally significant work. Do not document a component that repeats an established pattern already covered by an existing tutorial. If the decision, pattern, or Next.js concept is genuinely different from what has been documented before, write the entry.

**Each entry must cover:**

1. **Problem** — what specific UI requirement or constraint drove this work.
2. **Relevant files** — the component files, hook files, and test files involved.
3. **Pattern or technique** — the Next.js App Router, React, or Tailwind concept applied. Name it explicitly.
4. **Decision tradeoffs** — what alternatives existed, why they were not chosen, and what the current approach costs.

**File naming:** reflects the subject, not the date. Examples: `server-vs-client-boundary.md`, `optimistic-quota-update.md`, `response-anatomy-component.md`.

**Tone:** technical and direct. Written for a developer who knows JavaScript well but is building their Next.js App Router and React Server Component knowledge. No preamble. No closing summary. Each entry stands alone.
