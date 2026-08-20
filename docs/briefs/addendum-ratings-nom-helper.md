# NOM Helper — Addendum: response ratings

Complements the main design brief. Adds a feedback component to the conversation thread.

---

## What it actually does

It is not a satisfaction thermometer. It is the mechanism by which real queries feed the system's evaluation set.

That changes the design. A generic thumbs up / thumbs down produces a number with no diagnostic value. What is useful is knowing **what failed**, because each type of failure points to a different part of the system — a citation that does not match is not the same problem as an incomplete response.

The component must be designed to capture that distinction without becoming a survey.

---

## Scale: binary, not stars

Firm recommendation: thumbs up / thumbs down.

Stars force a decision the user cannot make well — three stars on a normative response means nothing interpretable, and the user hesitates before choosing. The real question is binary: did this help or not?

The richness does not come from the scale. It comes from the next step.

---

## Component in the thread

### Location

At the foot of each assistant response, after the citations. It does not compete with the content: it appears discreet and gains presence on hover or tap.

### States

**Unrated** — default state. Present but silent. Does not request attention, does not animate, does not appear with a delay to call attention.

**Rated** — discrete and reversible confirmation. The user can change their mind without friction. No effusive thank-you or celebration: a visual state change is enough.

**Reason submitted** — when the user completed the optional step.

### The reason step

On a negative rating, an optional step opens with typed reason categories. It can be skipped without penalty.

Proposed categories — each describes a distinct and recognizable failure from the user's side:

- La cita no corresponde a lo que dice la respuesta
- La respuesta no contesta lo que pregunté
- Falta información relevante de la norma
- La interpretación es incorrecta
- La referencia (capítulo, artículo o página) está mal
- Otro (campo de texto libre, breve)

Written from the user's perspective, not the system's. The user recognizes "la cita no corresponde"; they do not recognize "retrieval failure".

No reason is requested on a positive rating. Adding friction to the positive path discourages use of the full component.

---

## Edge cases to cover

**The insufficient info state is also ratable.** When the assistant acknowledges it could not find enough support, that abstention may be correct or overly cautious. Distinguishing between the two is valuable, so the component appears in that state as well.

**No proactive prompting.** No modals, no "was this response helpful?" appearing on its own, no reminders. The rating is always available and used when the user wants it.

**History.** A previous conversation retains its already-submitted ratings and allows submitting or changing them later.

---

## Out of scope for this pass

**Per-citation rating.** Being able to flag a specific citation as incorrect would be more precise than rating the full response, but it complicates the interface before knowing whether the basic component is used. Worth reserving the conceptual space and not building it yet.

**Usage statistics screen.** It is an admin view with a different audience and purpose from the three screens in the main brief — mixing it in now unfocuses the design. Treat it as a separate pass once there is enough real usage to look at.

---

## Copy note

No survey language. No "Tu opinión nos importa". No thank-yous. The user is solving a technical problem and the component must feel like part of the tool, not a product interruption.
