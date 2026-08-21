# Route protection in a layout

## Problem

Two route groups must be closed to the wrong visitor. `(app)` is closed to
anyone without a session. `(operator)` is closed to anyone without a session
and, additionally, to a signed-in user whose `profiles.role` is not
`operator`. Spec section 10 requires both behaviours to be tested.

The role lives in a `profiles` row, not in the session token. That single fact
decides the whole design.

## Relevant files

- `src/lib/auth/index.ts` — `getCurrentSession`
- `src/app/(app)/layout.tsx`
- `src/app/(operator)/layout.tsx`
- `src/app/(app)/chat/page.tsx`
- `src/__tests__/app/route-protection.test.tsx`

## Pattern or technique

**Guarding in an async Server Component layout, not in middleware.**

Next.js middleware runs on every matching request before the route renders, and
it is the usual place for an authentication gate. It is the wrong place here.
Middleware can read the session cookie, but reading `profiles.role` means a
database round trip, and the data access functions in `src/lib/db/` are not
built for the middleware runtime. A gate that can only answer "is there a
session" would still leave the role check to the page.

So the gate lives in the layout, which is an async Server Component:

```tsx
export default async function OperatorLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (session.profile.role !== 'operator') redirect('/chat');

  return <LanguageProvider initialLanguage={session.profile.language}>{children}</LanguageProvider>;
}
```

`redirect` from `next/navigation` throws a control-flow exception that Next
catches. Nothing after it runs, so no `return` is needed and no `else` branch
appears.

**`cache` for the repeated read.** The layout needs the session, and so does
`chat/page.tsx` below it. A layout does not pass values to its children — that
is what `children` being an opaque `ReactNode` means — so the page has to ask
again. `getCurrentSession` is wrapped in React's `cache`, which memoises the
call for the duration of one server request:

```ts
export const getCurrentSession = cache(async () => { /* ... */ });
```

Two calls, one round trip. This is why the page can write
`(await getCurrentSession())!` without either a second query or a fallback
identity: the layout above it has already proven the value is there.

**Two providers, deliberately.** `LanguageProvider` sits at the root for the
access screens, where no profile exists yet. The `(app)` and `(operator)`
layouts mount a second one with `initialLanguage={session.profile.language}`.
React context resolves to the nearest provider, so the authenticated subtree
starts in the user's stored language while the auth screens keep the default.

## Decision tradeoffs

**Middleware plus a page-level role check** was the alternative. It gives an
earlier redirect for the anonymous case — before any rendering work — but it
splits one rule across two files, and the role half still has to run somewhere
with database access. One rule in one place is worth the later redirect.

**A shared `requireSession()` helper for both layouts** was rejected as
premature. Two call sites, four lines each, different redirect targets. The
helper would have to take the target as a parameter, which is longer than the
code it replaces.

**Testing by rendering** does not work: these are async Server Components, and
React Testing Library renders client trees. The test instead calls the layout
as the async function it is and asserts where `redirect` was told to go. The
mock throws, matching the real behaviour, so a layout that continued past a
redirect would fail the test rather than pass it quietly.

**Cost of the current approach.** A layout guard runs after routing, not
before, so an unauthenticated request does a little more work than a middleware
rejection would. The `!` in `chat/page.tsx` is an assertion the type system
cannot verify: it holds only because the layout redirects first. If that layout
ever loses its guard, the page throws instead of redirecting.
