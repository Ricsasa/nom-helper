# Pseudonymized by construction

## Problem

The operator module shows queries written by people and the money those people
cost. The addendum asks for a stable identifier by default and for the real
identity behind a deliberate action.

The easy version passes `name` down with every row and hides it behind a state
flag. That version is not pseudonymized. The name is in the HTML the server
sends, in the React Server Component payload, and in the browser's memory from
the first paint. "Hidden" is a CSS property, not a privacy property.

## Relevant files

- `src/app/(operator)/dashboard/page.tsx` — the server component, reads consumption
- `src/app/(operator)/dashboard/actions.ts` — `revealIdentity`, `readMessage`, `submitReview`
- `src/components/operator/consumption-block.tsx` — the table
- `src/lib/utils/pseudonym.ts` — `pseudonymFor`
- `src/__tests__/components/operator-consumption.test.tsx`

## Pattern or technique

**Server Actions as a data seam, and absence as the privacy mechanism.**

The page never reads a name. It passes `profile_id` and consumption figures.
The client derives the label with `pseudonymFor`, a pure FNV-1a hash: same id,
same label, forever, with no lookup table to keep in sync.

Revealing is a Server Action call. The name crosses the network only when the
operator clicks, only for the row they clicked, and it lives in component state
that dies with the page. There is nothing to leak from the initial payload
because the initial payload does not contain it.

The same seam carries the two write paths of block 1. A client component in this
project may not import `@/lib/db` (spec section 2), so `readMessage`,
`submitReview` and `revealIdentity` are the only doors between the operator
blocks and the data layer — the shape already used by
`(app)/settings/actions.ts`.

Each action re-checks the operator role. The `(operator)` layout already gates
the page, but a Server Action is its own HTTP endpoint: a request that never
rendered the page still reaches the action. A layout guard protects renders, not
mutations.

## Decision tradeoffs

**Rejected: encrypt or store the pseudonym in the database.** A column would
need a migration, and migrations belong to the DB agent. A derived label costs
one function and no schema.

**Rejected: `crypto.subtle` for the hash.** It is async, which would turn a
render into an effect. The pseudonym is not a secret — the real identity is one
click away by design — so a non-cryptographic hash is the honest tool.

**Cost: 4 hex characters collide.** Roughly one collision per 300 profiles by
the birthday bound. At this volume it is fine; the fix when it matters is more
characters, not a different algorithm.

**Cost: one round trip per reveal.** Deliberate. Batching would mean sending
names the operator did not ask for, which is exactly what this pattern exists to
prevent.

**Related, in the same module: the review card loads on open, not with the
list.** The list shows query, reason, age and status — enough to decide whether
to open a row. Explanations and citations are read by `readMessage` when a card
opens. It is an N+1 by design: the alternative loads every citation of every row
for an operator who will open two of them.
