# Per-field save in a modal, and the server action seam

## Problem

The account settings modal has to write four different things — display name,
email address, password, language — plus two destructive actions, from a client
component that is forbidden from importing the data layer.

Two constraints shape everything:

1. The addendum rejects a global save button. Closing the modal must never
   discard work, which rules out "collect a form, submit at the end".
2. Spec section 2.1 forbids a Supabase call inside a component or a hook, and
   spec section 2.2 forbids the frontend from ever seeing `auth_user_id`.

## Relevant files

- `src/app/(app)/settings/actions.ts` — the server actions
- `src/components/settings/account-settings-modal.tsx` — the dialog and its steps
- `src/components/settings/editable-field.tsx` — one field, one save
- `src/components/settings/destructive-action.tsx` — the typed confirmation gate
- `src/components/settings/language-setting.tsx` — the persistent language control
- `src/lib/auth/index.ts` — `updateEmail`, `updatePassword`, `signOut`
- `src/__tests__/components/account-settings-modal.test.tsx`

## Pattern or technique

**Server Actions as the seam.** `actions.ts` carries `'use server'`, so every
export becomes a callable the client bundle references by id instead of by body.
The modal imports those callables and passes them down as props. The result: the
data layer is never in the client bundle, the leaf components take a
`(value) => Promise<SettingsResult>` prop and know nothing about Supabase, and
the same components are testable by mocking one module.

The actions never accept a `profile_id`. Each one calls `requireProfileId()`,
which resolves the session cookie on the server. An id travelling from the
browser is user input; taking it on trust would let any signed-in user rename or
delete somebody else's profile.

**State that commits per field.** `EditableField` holds two values: `committed`,
the value the server has, and `draft`, the value being typed. Saving swaps
`draft` into `committed` and returns the row to its read state. Because each row
owns its own commit, Escape, the close button and a click on the scrim are all
the same action, and none of them can lose anything — which is exactly why the
addendum could drop the exit confirmation.

**A step, not a second dialog.** The password change swaps the body of the same
`role="dialog"` element. One dialog means one Escape target and one focus scope.
Stacking a second modal would need a second focus trap and a decision about
which Escape wins.

**The typed gate.** `DestructiveAction` disables the confirm button until the
typed text equals the confirmation word, and the word comes from the dictionary
rather than a constant, so a user reading in English types `DELETE` and a user
reading in Spanish types `ELIMINAR`. A hardcoded word would test transcription
rather than intent.

**Language applied without a reload.** `LanguageSetting` writes first and calls
`setLanguage` from `LanguageProvider` second. The provider re-renders the whole
tree, the modal included, so the interface switches in place. Switching the
context first and rolling back on failure would flicker the copy of the very
error message that reports the failure.

## Decision tradeoffs

**Server actions over an API route.** A route handler would need its own request
parsing, its own error shapes and a fetch wrapper on the client. The actions give
typed arguments and typed returns with none of that. The cost is that the modal
now imports from `src/app/`, which reads oddly for a component — the alternative
was a `src/hooks/use-settings.ts` wrapper that would only re-export the same
callables.

**Discriminated result over thrown errors.** Every action returns
`{ ok: true } | { ok: false; code }`. The codes map to dictionary keys, so a new
failure mode is two dictionary entries and no new branch in a component. Throwing
would have meant a try/catch in every leaf and error copy assembled at the throw
site, far from the interface that has to show it.

**Reading the quota when the modal opens.** `UsageBlock` calls the action from an
effect instead of receiving a number as a prop from the page. A prop read at page
load would go stale as the user spends their quota during the session. The cost
is a round trip on open and a loading line; the callback is wrapped in
`useCallback` in the modal, because an unstable identity in the effect dependency
would repeat the read on every render.

**`updateEmail` and `updatePassword` live in `src/lib/auth/`.** `profiles` stores
no email, so neither is a `src/lib/db/` concern, and section 2.4 forbids writing
one there anyway. `updatePassword` re-authenticates with the current password
before writing: `updateUser` alone does not ask for it, so without the re-auth
the current-password field would be decoration and an open session would be
enough to take over the account.
