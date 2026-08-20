# Design — NOM Helper

Design documentation imported from Claude Design. This is reference material: it describes the intended interface, its exact copy, and its tokens. It contains no production code.

Documentation is written in English. Product copy stays in Spanish, because Spanish is the language the product shows to its users. Never translate a user interface string, an error message, or the text of a Mexican standard.

## Source

| Field | Value |
|---|---|
| Project | Prototipo funcional de chat legal |
| URL | https://claude.ai/design/p/7432935b-48da-4752-8b81-1147063d7665 |
| Main file | `NOM Helper.dc.html` (navigable prototype, 1738 lines) |
| Design author | rs-studio.dev |
| Import date | 9 Aug 2026 |

Files in the source project:

- `NOM Helper.dc.html` — the complete, current prototype. It includes the daily quota, the feedback control, the operations panel, and account settings.
- `design_handoff_nom_helper/README.md` — the handoff package for React and Next.js.
- `design_handoff_nom_helper/NOM Helper.dc.html` — a copy of the prototype at handoff time. This copy is older.
- `support.js` — the prototype runtime (`dc-runtime`). It is generated code with no value for the implementation.
- `uploads/brief-diseno-nom-helper.md` — the original client brief.

## Index

| Document | Contents |
|---|---|
| [00 — Design brief](00-design-brief.md) | The original brief: product, audience, scope, visual direction, success criterion. |
| [01 — Implementation handoff](01-implementation-handoff.md) | The full specification: tokens, primitives, screens, interactions, state, accessibility, checklist. |
| [02 — Current prototype state](02-prototype-current-state.md) | Functionality added to the prototype after the handoff. Document 01 does not cover it. |
| [03 — Content and data](03-content-and-data.md) | Exact copy and data structures from the prototype, ready to populate the implementation. |

## How to read this folder

1. The brief (00) sets the intent and the firm constraints.
2. The handoff (01) is the source of truth for tokens, primitives, and the three screens of the original scope.
3. Document 02 covers the delta. The prototype grew a daily quota, per-answer feedback, an operations panel, and account settings. Where 01 and 02 disagree, 02 wins, because 02 describes the current prototype.
4. Document 03 holds the strings and the sample data. Copy from that document, not from the prototype.
