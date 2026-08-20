# Bilingual UI without browser storage

## Problem

The interface ships in Spanish (es-MX) and English (en-US). The obvious React
solution — a provider that reads and writes `localStorage` — is forbidden:
spec section 2.7 bans every browser storage API, because session and preference
state belong to Supabase Auth and to `profiles.language`.

The boilerplate arrived with exactly the forbidden version
(`lib/i18n/LanguageContext.tsx`: `localStorage.getItem('language')` plus browser
language detection). It was deleted rather than adapted.

Two audiences also disagree about persistence. On the access screens no profile
exists yet, so a language choice can only last for the session. Inside the
application the value comes from `profiles.language` and must survive a reload.

## Relevant files

- `src/i18n/es-MX.ts` — the source dictionary, a flat `as const` object
- `src/i18n/en-US.ts` — typed as `Record<keyof typeof esMX, string>`
- `src/i18n/dictionaries.ts` — the two dictionaries plus the default language
- `src/components/shared/language-provider.tsx`
- `src/components/shared/language-toggle.tsx`
- `src/__tests__/components/language-toggle.test.tsx`
- `src/__tests__/components/dictionaries.test.ts`

## Pattern or technique

**A context provider whose initial value is injected, not discovered.**

`LanguageProvider` takes an `initialLanguage` prop defaulting to `es-MX`. It
never reads anything. Where the initial value comes from is the caller's
problem: the root layout passes nothing today, and the `(app)` layout will pass
`profile.language` once a session can be resolved server-side.

This removes the hydration hazard that the boilerplate version worked around.
That version had to render the fallback language on first paint and then correct
itself in an effect, because reading `localStorage` during render makes server
and client markup disagree. With the value passed in as a prop, the server
already knows it, so the first paint is correct and there is no effect at all.

**Typing the second dictionary against the first.** `en-US.ts` is annotated
`Record<keyof typeof esMX, string>`. A key added to Spanish and forgotten in
English is a compile error, not a string that silently falls back to its own key
at runtime. The runtime test then covers what types cannot: empty strings, and
the rule that `NOM-001-SEDE` is never translated.

## Decision tradeoffs

**Flat keys over a nested tree.** `'auth.error.weakPassword.title'` is a single
string key, not `auth.error.weakPassword.title` resolved by walking objects. The
flat form is what makes `keyof typeof esMX` a useful union — a nested tree would
need a recursive conditional type to produce the same guarantee, and the lookup
helper the boilerplate used (`key.split('.').reduce(...)`) returns `string | null`
and cannot be type-checked at all. The cost: keys are long, and grouping is a
naming convention rather than a structure.

**No `t(key, vars)` interpolation.** The boilerplate supported `{{name}}`
substitution. No string in this design needs it, so it is not there. Adding it
later is a few lines in `t`; carrying it now would be an untested code path.

**A prop instead of a cookie.** A cookie would persist across reloads without a
database read, and cookies are technically not "browser storage" in the
`localStorage` sense. The spec forbids the frontend writing cookies too, and
`profiles.language` is already the system of record — a cookie would be a second
copy that can drift. The cost is one profile read per request in the `(app)`
tree, which happens anyway to resolve `profile_id`.
