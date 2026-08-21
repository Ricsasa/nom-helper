# The response anatomy component

## Problem

A system answer is not free text. It is a fixed structure of five fields, set
by the response contract: `summary`, `explanation`, `citations`,
`confidence_level` and `insufficient_info`. Spec section 9 requires one
component with one slot per field, typed on `Message`, that fetches nothing.

Two constraints shape it. Spec section 7 forbids colour as the only carrier of
state, which rules out a red/amber/green confidence indicator. Spec section 5
forbids translating citation content, which means part of this component's
output must stay in Spanish while the labels around it change language.

## Relevant files

- `src/components/chat/response-anatomy.tsx`
- `src/i18n/es-MX.ts`, `src/i18n/en-US.ts` — the `response.*` keys
- `src/__tests__/components/response-anatomy.test.tsx`

## Pattern or technique

**A presentational component with state pushed to the leaves.**

`ResponseAnatomy` takes a `Message` and renders it. It holds no state of its
own. The only interactive element is a citation row that expands to show the
text of the standard, and that flag lives inside `CitationRow`:

```tsx
function CitationRow({ citation, index, isLast }: { /* ... */ }) {
  const [open, setOpen] = useState(false);
  // ...
}
```

Holding an `openIndex` in the parent would have made the list single-open and
given the parent state it does not otherwise need. Per-row state costs nothing
and lets a reader compare two articles side by side.

**The insufficient case is an early return, not a variant.**

```tsx
if (message.insufficient_info) {
  return <section data-insufficient="true">{/* framed block */}</section>;
}
```

When the system cannot support an answer, there are no citations and no
confidence to report. Rendering the normal anatomy with empty slots would show
a citation header above nothing. The early return replaces the whole structure
with a framed block that names the situation in its header.

**Confidence without colour.** Three bars, filled by level, plus the level
written out:

```tsx
const FILLED_BARS: Record<ConfidenceLevel, number> = { high: 3, medium: 2, low: 1 };
```

The bars are `aria-hidden` — they are a redundant restatement of the label, not
information of their own. The word "Alta" is what carries the meaning, and it
is the word the test asserts on. Every bar is the same ink colour: the signal
is how many are filled, not what shade they are.

**Translated shell, untranslated content.** Every label goes through
`t('response.*')`. The citation `chapter`, `article`, `page` and `excerpt` are
interpolated straight from the `Message`. The test renders the component in
`en-US` and asserts that `Citations from the standard` appears while
`Capítulo 3 · Artículo 310-15` does not change.

## Decision tradeoffs

**Splitting into four components** — one per field — was rejected. The spec
asks for a single component with slots, and the fields are not reusable in
isolation: a citation list outside a response has no meaning here. The two
private helpers, `CitationRow` and `ConfidenceMeter`, stay in the same file for
that reason. They are implementation detail, not API.

**A `<details>` element for each citation** would give the expand behaviour for
free and without JavaScript. It was rejected because the design places the
toggle label on the right of the row, opposite the reference, and styling a
`<summary>` marker into that layout across browsers is more work than the
`useState` line it replaces.

**Splitting the explanation on `\n`** is a simplification. The contract types
`explanation` as a single string, so paragraph breaks are the only structure
available. If the contract later carries structured blocks, this line is where
that change lands.

**Cost of the current approach.** `'use client'` covers the whole component
because of one boolean in the citation rows. The summary, explanation and
confidence meter ship to the browser without needing to. Moving the boundary
would mean splitting the file, which trades the spec's "single component" for
a smaller bundle — not a trade worth making at this size.

**Not yet mounted.** The component renders a `Message`, and no message thread
exists: it depends on the RAG route, which belongs to the developer. The
component and its tests are complete and independent of that work.
