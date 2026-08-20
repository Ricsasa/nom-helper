# NOM Helper — Addendum: bilingual support (es-MX / en-US)

Complements the main design brief. Defines how language selection is surfaced and applied across the interface.

---

## Default and scope

The application defaults to Spanish (es-MX). English (en-US) is the only other supported language in this version.

Every UI string, label, error message, empty state, tooltip, and system notice has a translation in both languages. The text of the NOM-001-SEDE standard itself is never translated — it is normative content in Spanish and must always appear as published.

---

## Language selection: two entry points

### 1. Login and register screens

A discreet language selector is visible on both screens before the user authenticates. This is the only place in the interface where language selection is accessible without being logged in.

It does not interrupt the flow. It does not require a separate step. It sits quietly in a corner — top right is the conventional position — and switching it changes the screen immediately without a reload.

The selector shows two options only: Español and English. No flags. Language names in their own language.

**Design note:** the selector on the auth screens sets the session language for that visit. It does not persist to the account until the user saves it in settings after logging in.

### 2. Account settings modal

The language preference lives in the Account block of the settings modal, as an additional field after name and email. It is a simple two-option control.

Changing it applies immediately across the interface. No save-and-reload. The modal itself switches language on selection.

This is the persistent setting. Once saved, the user's language preference follows them across sessions.

---

## What changes with language, what does not

| Changes | Does not change |
|---|---|
| All UI strings and labels | Text of the NOM-001-SEDE standard |
| Error messages | Citation content (chapter, article, page, excerpt) |
| Empty states and system notices | Standard codes and references (NOM-001-SEDE) |
| Conversation start notice | norm_version field values |
| Permanent disclaimer | Reason categories in the rating component |
| Operator module labels and actions | Tutorial content in `tutorials/` |
| Account settings modal | — |

The rating reason categories are a special case: they are written from the user's perspective in Spanish and must remain in Spanish regardless of UI language, because they describe the normative content that is always in Spanish.

---

## Conversation start notice

The notice that appears at the start of each conversation is part of the UI and is therefore translated. The norm version it references remains as published.

English version draft:

> **Before you begin**
>
> This session queries the NOM-001-SEDE, version [year], in effect since [date].
>
> Responses are built from the text of the standard and always include the corresponding citation. Verify every reference against the official published document before applying it.
>
> This tool does not substitute the judgment of a responsible professional and does not constitute a technical ruling.

---

## Permanent notice

English version draft:

> Responses may contain errors. Always verify against the official text of the standard.

---

## Operator module

The operator module is translated in full. The operator may work in either language. Query content shown in the review queue always appears as the user wrote it, regardless of the operator's language setting.

---

## Visual direction

The language selector on the auth screens must not draw attention away from the login or register form. It is the last thing the user needs to interact with, not the first.

In the settings modal, it follows the same save behavior as other fields: change applies immediately, no separate save button for this field.

No flags, no country names. Language names only, in their own language: Español, English.
