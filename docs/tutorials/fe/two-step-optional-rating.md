# A two-step write where the second step is optional

## Problem

The rating at the foot of an assistant response is the input to the evaluation
set, not a satisfaction meter. A bare thumb gives a number with no diagnostic
value; a form gives diagnostic value and kills the response rate. The addendum
resolves this with two steps: the thumb is the rating, and a typed reason
category is an optional follow-up that opens only after a negative thumb.

The interface constraint is that the second step must be droppable at any point
without losing the first, and the whole thing must be reversible, because a user
who changes their mind should not have to think about what happens to the row.

## Relevant files

- `src/components/chat/rating-control.tsx` — the component.
- `src/components/chat/response-anatomy.tsx` — the footer slot, rendered in the
  normal state and in the insufficient information state.
- `src/lib/db/ratings.ts` — `createRating`, owned by the DB agent.
- `src/__tests__/components/rating-control.test.tsx` — the cases from spec
  section 10.

## Pattern or technique

**Two idempotent writes, not one deferred write.** The naive shape is to hold
the rating in component state and write once, when the user either picks a
reason or skips. That shape loses the rating whenever the user closes the tab
mid-step, which is the common case for an optional step.

Instead the thumb writes immediately with `{ is_positive: false }`, and picking
a reason writes a second time with the category added. `createRating` upserts on
`message_id`, so the second call updates the same row. Every state the user can
be in is already persisted, and the reason step becomes what it claims to be:
optional. The same property makes reversal free — clicking the other thumb is
one more upsert, and the server clears the reason fields on a positive rating.

**Server state as the single source of truth in local state.** The component
holds the `ResponseRating` returned by the write rather than a local boolean.
The rendered confirmation ("Registrada" versus "Motivo registrado") is read off
that row, so the interface cannot claim a reason was stored when the second
write failed. A rejected write sets an error flag and leaves the previous row
untouched; the reason step does not open on a rating that was not stored.

**Reason categories are data, not copy.** Spec section 5 keeps them in Spanish
in both languages, so they live in a `REASONS` constant next to the component
rather than in `src/i18n/`. Putting them in the dictionaries would force the
English file to hold Spanish strings, which reads as a mistake and invites a
future translation. Surrounding labels — the thumb names, "Omitir", "Enviar" —
go through `t()` as usual.

**State without colour.** The active thumb is marked by border contrast plus
`aria-pressed`, never by a colour alone (spec section 7). `aria-pressed` is also
what the tests assert on, which keeps them on user-visible behaviour rather than
class names.

## Decision tradeoffs

*A modal for the reason step* was rejected outright by the addendum: no
proactive prompting, no interruption. The step renders inline, below the thumbs,
and the component never opens anything the user did not click.

*Removing a rating* (clicking the active thumb to clear it) is not supported.
There is no delete function in `src/lib/db/`, and requesting one to serve a
gesture nobody has asked for is a poor trade. A click on the active thumb is a
no-op, and the user reverses by choosing the other thumb.

*Optimistic state* is not used here, unlike the quota counter. A rating is a
deliberate act with no follow-up work blocked on it, so waiting for the write
costs nothing and removes an entire class of reconciliation bugs. The cost is a
visible delay on a slow connection, where the thumb stays unmarked until the
round trip returns.

*The footer as a slot prop* — having `ResponseAnatomy` accept a `footer`
ReactNode — would keep the anatomy free of the rating import. It was rejected
because the rating position is fixed by the design in both response states, so
the choice would only be exercised in one way, and every caller would have to
repeat the wiring. `ResponseAnatomy` still fetches nothing: it forwards
`message.id` and an optional `rating` prop supplied by whoever loads the
conversation.
