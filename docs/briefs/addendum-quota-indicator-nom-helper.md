# NOM Helper — Addendum: daily query limit indicator

Complements the main design brief. Adds a usage limit display component.

---

## What it is

An indicator that communicates to the user how many queries they can make today. Its purpose is for the user to feel the limit is fair, not arbitrary, and to be able to plan their usage.

**It is not an error notice or an aggressive block.** It is status information, as natural as showing battery level on a device.

---

## Location

**Footer of the sidebar**, alongside the user identity and the sign out button. Bottom left, at the same level as those elements.

It does not float in the conversation, does not interrupt, does not appear in modals. It is part of the structural interface.

---

## Anatomy

One line of text and a small visual indicator.

Format:

```
9 consultas disponibles hoy
```

Accompanied by a discrete visual element: a progress circle, a short horizontal bar, or simply the number with variable weight depending on proximity to the limit. The minimal solution that respects the project's visual direction.

**Never disabled or hidden** in any state. Always present. The user can expand or see more detail on hover, but the simple line must be sufficient on its own.

---

## States

**8–10 queries available (safe state)**

Neutral typography and color. The indicator is information, not a signal.

**4–7 queries available (caution state)**

Very subtle visual change. Perhaps slightly heavier font weight, or a darker tone. Enough for the user to notice in passing without alarming them.

Optionally, a tooltip on hover: "Te quedan pocas consultas hoy."

**0 queries available (limit reached)**

Different visual indicator — weight and tone that communicate closure. The user sees it immediately.

**Submit button disabled** when the limit is reached.

Below or above the input field, a clear message:

> Límite diario alcanzado. Tus 10 consultas se resetean mañana a las 00:00 CDMX.

The message does not apologize. One line: what happened and when it resolves. It does not suggest alternatives or actions — at this state the user cannot do anything else in the application, and offering options that do not exist makes the moment worse.

The conversation history remains browsable with the limit exhausted. Previous queries and their citations can be read normally; the only thing blocked is submitting a new query.

---

## Time zone

The reset occurs at midnight in the user's time zone (América/México_City in this MVP). The indicator always shows that zone explicitly in the limit-reached message.

This matters because later, if the product grows to other countries, a decision will be needed on whether to use UTC midnight or local midnight. Establish it in the interface from the start.

---

## Interaction

The user cannot do anything to change their limit from this component. No "buy more" button, no "request access", nothing. Information only.

The limit is part of the experience: all authenticated users have 10 free queries today.

---

## Data considerations

The indicator updates in real time. When the user submits a query, the number decrements immediately — no page reload required.

For streaming queries, it counts as 1 query at the moment of submission, not at completion.

---

## Out of scope

Previous limit history, explanation of why the limit exists, future plans table. None of that here. This component is about today.

---

## Visual direction

Inherits everything from the main brief: no gradients, solid colors, sober typography, green and purple as identity accents only.

The indicator does not use red, green, or amber with semantic purpose — that would conflict with the brand accents. State is communicated through typographic weight, contrast, and optionally gray tone.

The palette is the same as the rest of the application. No traffic light semantics.
