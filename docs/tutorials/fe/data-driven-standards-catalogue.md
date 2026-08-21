# A screen that reads a catalogue instead of stating it

## Problem

The About screen lists the normative documents loaded into the system: code,
full name, version, official publication date, status and the date each one was
incorporated. The addendum adds a constraint that outranks the layout: those
values describe the documents actually loaded, so the screen must read them as
data. Adding a version, or letting two versions of the same standard coexist —
one in effect, one kept as a historical reference — must change data and nothing
else.

The document metadata lives in the `rag` schema, which belongs to the developer,
and `src/lib/db/` exposes no function for it. So the frontend cannot fetch the
catalogue, and it also cannot write the query. Both doors are closed.

## Relevant files

- `src/lib/utils/standards.ts` — the catalogue, its types and the date formatter
- `src/components/about/standards-table.tsx`
- `src/components/about/about-view.tsx`
- `src/app/(app)/about/page.tsx`
- `src/__tests__/components/standards-table.test.tsx`

## Pattern or technique

**Freeze the contract, not the source.**

The component takes `standards: LoadedStandard[]` as a prop and knows nothing
else. It does not import the catalogue, does not count the rows it expects, and
has no branch named after a specific standard. The status of a row drives its
own presentation through `STATUS_KEY`, a `Record<StandardStatus, TranslationKey>`:
a new status is a key, not an `if`.

Today the array is a module constant. When the DB agent publishes a function
that returns the loaded documents, the page — already a Server Component —
awaits it and passes the result down the same prop. `standards-table.tsx` does
not change, and neither do its tests, because the tests build their own
catalogue instead of asserting against the one the product ships. One of them
renders a standard that does not exist in the product at all; it passes for the
same reason the future migration will be cheap.

Two decisions keep the data honest:

- **Dates are stored as ISO and formatted at render time**, with
  `Intl.DateTimeFormat(language, …, { timeZone: 'UTC' })`. A pre-formatted
  string like `"29 nov 2018"` is Spanish copy hiding inside a data field; it
  would have to be duplicated per language, or it would leak Spanish into the
  English interface. UTC is what stops the day from sliding by one in a negative
  offset.
- **The row note is a `TranslationKey`, not a sentence.** The note explaining
  why the 2012 edition is kept is product copy, so it belongs in `src/i18n/`.
  The code, the official title and the publisher are not copy — they are the
  document's own identity, and spec section 5 forbids translating them. The
  English dictionary carries the translated note and leaves
  `Instalaciones eléctricas (utilización)` untouched.

## Decision tradeoffs

**A constant in `src/lib/utils/` instead of a DB call.** The honest alternative
was to stop and request a data access function, as spec section 6 requires when
a query is missing. That rule exists to prevent inline Supabase queries; there
is no query here to inline. Requesting the function would also mean asking the
DB agent to reach into the `rag` schema, which CLAUDE.md section 2 forbids
outright. The constant costs one edit per new document until the seam exists,
and it buys a screen whose shape is already correct when it does.

**A card per document instead of a `<table>`.** A real table is the more
semantic element, and it was the first choice. It loses on the single
breakpoint this product has: five columns of mono text at 320px either scroll
horizontally or collapse into something that is no longer a table. The card
keeps a `<dl>` per row, so the label/value pairing survives for a screen reader
in both widths. The cost is that a document cannot be scanned column by column
across rows — acceptable while the catalogue is two entries, worth revisiting
past roughly ten.

**Status shown three ways at once.** The row carries `data-status`, a filled or
outlined marker, a weight change, and the word itself. That is deliberate
redundancy: spec section 7 forbids colour as the sole signal, and the design
already distinguished the superseded row only by a paler background. The word
is the part that actually carries the meaning; the rest is reinforcement.
`data-status` costs nothing at runtime and gives the test a stable hook that is
not a class name.
