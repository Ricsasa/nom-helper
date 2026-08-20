# NOM Helper — Addendum: informational screen and disclaimers

Complements the main design brief. Adds one screen and two notices.

---

## Why this matters

A wrong answer about conductor sizing or circuit protection does not produce a bad search result — it produces an unsafe installation. The user is a professional who can act on what they read here.

That defines the tone of this entire addendum. Notices are not legal fine print or defensive boilerplate — they are part of the product's function. A technical user will read them, and they must say something useful: exactly what is being consulted, from when, and where the tool's responsibility ends.

Risk to avoid: three layers of notice can become noise that nobody reads. The solution is hierarchy, not repetition. Each layer says something different.

---

## New screen — About the project and sources

### Where it lives

Entry in the tools zone of the sidebar. Also reachable from the permanent notice below the chat input.

### What it contains

**1. What this is**

A brief explanation of the purpose: technical reference on Mexican electrical standards with verifiable citations to the normative text. Written for someone in the trade, no marketing language.

**2. Which standards are loaded**

The core of the screen. Tabular or card layout, one entry per loaded document, showing:

- Standard code and full name
- Version or year
- Official publication date
- Status: current, superseded, or in transition
- Date it was incorporated into the system

**Design requirement:** these values describe the documents actually loaded. The screen must be built to read them as data, not as fixed text — when a new version is added, the interface must reflect it without redesign. Also design the case of two versions coexisting, where one is current and the other is kept as a historical reference.

**3. What it covers and what it does not**

Explicit in both directions. What kinds of queries it answers well, and what falls outside: project calculations, technical rulings, verification of existing installations, standards not loaded into the system.

**4. How to read a response**

Explanation of the response anatomy: summary, explanation, citations, and confidence level. What each confidence level means and what to do when it is low.

**5. Full disclaimer**

The extended version of the notices, in their natural place. Not a separate legal block — it is the logical conclusion of everything above.

---

## Permanent notice — below the query input

A single line, always visible, discreet but legible. Never dismissed. Links to the informational screen.

Register: informative and direct. Does not apologize, does not alarm.

Draft options to choose from or adjust:

> Las respuestas pueden contener errores. Verifica siempre contra el texto oficial de la norma.

> Esta herramienta orienta, no dictamina. Contrasta cada cita con el texto publicado.

Visual requirement: must not compete with the input field or disappear visually. It is text read once and then recognized.

---

## Conversation start notice

Appears inside the thread, before the first message, every time a new conversation is opened.

**Not a modal.** It does not block, does not require acceptance, does not carry an "I understand" checkbox. It is thread content, with its own visual treatment that distinguishes it from an assistant message — the user must immediately understand it is not a response.

It is more specific than the permanent notice. It must communicate:

- Which document and version this session is consulting
- That responses are grounded in the retrieved text, not in professional judgment
- That it does not substitute the judgment of a responsible professional or constitute a technical ruling
- That citations must be checked against the official published text

Content draft:

> **Antes de comenzar**
>
> Esta sesión consulta la NOM-001-SEDE, versión [año], vigente desde [fecha].
>
> Las respuestas se construyen a partir del texto de la norma y siempre incluyen la cita correspondiente. Verifica cada referencia contra el documento oficial antes de aplicarla.
>
> Esta herramienta no sustituye el criterio de un profesional responsable ni constituye un dictamen técnico.

The block must be collapsible after the first query of the session, to avoid occupying permanent space in the thread. When collapsed, at minimum the version of the standard being consulted remains visible.

---

## Consistency across the three layers

| Layer | Length | Says |
|---|---|---|
| Permanent | One line | May contain errors, verify |
| Conversation start | Short block | What is being consulted, from when, scope |
| Informational screen | Full | All detail, sources, and scope |

No layer repeats another in different words. Consistent vocabulary across all three: if one says "verificar", the others say "verificar" — not "contrastar" or "corroborar".
