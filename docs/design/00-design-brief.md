# NOM Helper — Design brief (first interface pass)

> Translated from `uploads/brief-diseno-nom-helper.md` in the Claude Design project. Sample queries and product copy stay in Spanish, because the product ships in Spanish.

## What it is

A technical reference assistant for the NOM-001-SEDE standard (electrical installations — utilization). The user asks in natural language. The system answers with a grounded response and verifiable citations to the text of the standard: chapter, article, and page.

This is not a general-purpose chatbot. It is a work tool. Traceability of the source is worth as much as the answer.

## Who it is for

Electricians, designers, electrical engineers, inspectors, and contractors in Mexico. The audience is technical and has low tolerance for ambiguity. It is used to manuals and tables.

Most use happens on the desktop. Some use happens on a phone at the job site. The interface must work well on both.

## Scope of this pass

Design three screens:

1. Sign in
2. Account registration
3. Chat with a sidebar

**Out of scope:** the calculators screen (only its place in the navigation must exist), dark mode, and account settings.

---

## Screens 1 and 2 — Access

Sign in and registration. Keep them sober. Add no decorative illustration and no sales argument: the person who arrives here already knows the product.

- **Sign in:** email, password, sign in, password recovery, link to registration.
- **Registration:** name, email, password, create account, link to sign in.

Both screens need visible and specific error states: wrong credentials, email already registered, password that fails the requirements. The error says what happened and how to solve it. The error does not apologize.

---

## Screen 3 — Chat

### Sidebar

Two clearly separated zones. This separation is a requirement, not a suggestion.

**Upper zone — tools.** It is fixed and does not grow. It contains:

- New query
- Calculators (a navigation entry; its screen is not designed yet)

**Lower zone — history.** A chronological list of previous queries with its own scroll. Each item is identified by the topic of the query, not by a generic date. An empty state must exist for the new user.

**Footer:** user identity and sign out.

On mobile the sidebar collapses.

### Conversation area

Interaction reference: Claude and ChatGPT. The distinctive part is how the answer is presented, not a new chat pattern.

**Anatomy of an answer.** Every assistant answer has this structure. The design must make the parts distinguishable at a glance:

1. **Summary** — the direct answer, in one or two sentences.
2. **Explanation** — the technical development.
3. **Citations** — references to the text of the standard, each one with chapter, article, and page. They are the highest-value element of the screen. The user must be able to read them without losing the thread of the conversation.
4. **Confidence level** — how well the retrieved text supports the answer.

**About the confidence level:** do not communicate it by color alone. The palette uses green and purple as decorative brand accents, so color is already occupied and a traffic-light reading would be ambiguous. Solve it with typography, weight, label, or iconography.

### States to design

- **Empty:** first visit, no queries. It is an invitation to ask, not a welcome sign. Real query examples help.
- **Generating:** the answer arrives progressively.
- **Insufficient information:** the assistant found no sufficient support in the standard. This state is important and must look different from a normal answer. It is a product function, not a failure.
- **Error:** the query could not be processed.

### Real content for layout

Use true technical content, not filler text.

Example query:

> ¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?

Other queries, to populate the history and the empty-state examples:

- Requisitos de puesta a tierra en instalación residencial
- Distancia mínima entre tablero y muro
- Protección requerida en circuitos de alumbrado comercial
- Cálculo de factor de demanda para vivienda unifamiliar
- Canalización permitida en área clasificada

Citations must look like real citations to a standard (a reference to chapter, article, and page of NOM-001-SEDE), not like web links.

---

## Visual direction

**Firm requirements:**

- No gradients.
- Solid, sober colors. An enterprise register, a professional tool.
- Green and purple accents. They are decorative and belong to the identity. They do not encode state or meaning.
- Sober typography with few weights. Typographic variety is not where the personality lives here.
- No dark mode in this pass.
- Minimal animation. Use it only where it communicates something.

**Spirit:** minimal, technical, timeless. It must age well and look credible to a person who works with standards and tables all day. Precision in spacing, hierarchy, and detail is what holds up a direction like this one.

**Working name:** NOM Helper.

---

## Success criterion

An electrician opens the screen, asks a question, and can verify in the interface itself which article of the standard produced the answer. The electrician does not have to wonder whether the system invented it.

---

## Import note

The final design departs from the brief on one point. The accents stopped being decorative and received a fixed semantic role: green for user action, violet for provenance and sources, amber for warnings. The confidence level does follow the brief and is never encoded by color. See [01 — Handoff](01-implementation-handoff.md), section 5.1.
