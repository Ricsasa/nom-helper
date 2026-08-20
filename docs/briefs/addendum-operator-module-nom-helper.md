# NOM Helper — Addendum: operator module

Complements the main design brief. Adds a separate view accessible only to the system operator.

---

## What it is

A work view, not a presentation dashboard.

Its purpose is for the operator to convert real system usage into two decisions: what to fix in the query pipeline, and how much the operation is costing.

**Audience: one person.** The system operator. No enterprise clients or teams are looking at this screen in this version.

**Design warning that governs this entire document:** at the start there will be very little data. An interface built for volume looks broken and empty with fifteen records. Design for the sparse case first — empty states and low-density states are the primary scenario, not the exception.

---

## Access

Same login as the application, with a different role.

- For a regular user the entry **does not exist**. It does not appear disabled, hidden, or locked — it simply is not there.
- For the operator there is a discreet entry that leads to a full view with its own navigation.
- It is not another section in the chat sidebar. These are two different work modes: one queries the standard, the other audits the system.
- There must be a clear path back to the query application.

---

## Block 1 — Review queue

The core of the module and the first thing seen on entry.

A list of negatively rated responses, to be reviewed one by one.

### The list

Each item shows enough to decide whether to open it:

- The user's query
- The reason category marked by the rater
- When it occurred
- Review status

Ordered by age, unreviewed first. Filterable by reason category and by status.

**Empty state:** when there is nothing pending, the screen states it as a neutral fact, not a congratulation. It is the normal state for much of the time and must look deliberate.

### The review card

When an item is opened, everything needed to diagnose without leaving the screen:

- The complete query
- The response the system gave, with its confidence level
- The citations that were retrieved and presented
- The reason category marked and the free text comment, if any

Layout matters: the operator is comparing the query against the retrieved citations. Those two elements must be visible together without scrolling.

### Actions on a card

The operator classifies the cause and decides the destination. The classification is theirs, not the user's — it translates the reported reason into a technical root cause:

**Cause:**
- The retrieved text was not relevant to the query
- The text was correct but the response used it incorrectly
- The information is not in the loaded corpus
- The citation reference (chapter, article, page) was incorrectly attributed
- No real issue — the complaint is not warranted

**Destination:**
- Add to evaluation set
- Mark as reviewed
- Discard

A reviewed item does not disappear: it changes status and remains queryable.

---

## Block 2 — Consumption

The second most important block, because cost control was the reason authentication exists.

What it must answer at a glance:

- Queries made in the period
- Accumulated consumption and its estimated cost
- Consumption per user, ordered from highest to lowest
- Who is outside the normal range

Tabular and sober presentation. Numbers and rows, not charts. At initial volume, an ordered table says more than any visualization.

There must be a visible threshold: what is considered normal consumption and who exceeds it. A number without a reference point does not enable a decision.

---

## Privacy

The module shows queries written by people.

**Design rule:** identity appears pseudonymized by default. The operator sees a stable identifier, not the name or email. The query itself is shown in full — it is the object of the review.

There must be an explicit action to reveal the real identity when needed (support, abuse, abnormal consumption), but it is a deliberate action, never the default state of the screen.

Today the users are the operator and their test accounts, so this changes nothing in practice. It is designed this way now because changing it later is expensive.

---

## Out of scope for this pass

Explicitly excluded, even if it seems natural to include:

- Trend charts and period comparisons
- Corpus coverage by article or chapter
- Views by organization or team
- User management
- Document corpus management

All of this becomes useful when there is real usage to look at. Including it now produces empty screens that inform nothing.

---

## Visual direction

Inherits the palette, typography, and rules from the main brief: no gradients, solid sober colors, green and purple as identity accents, few font weights.

**What changes is density.** The chat is spacious and conversational. This view is work: tabular, dense, more information per screen, less breathing room. It must feel like the same product and a different mode.

No product language or celebration. The operator does not need encouragement, they need to see the state of the system.
