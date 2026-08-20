# The application shell and where the client boundary falls

## Problem

The design specifies a three-part frame that never scrolls as a whole: a sidebar,
a main column, and a footer strip pinned to the bottom of the window and crossing
both. Only two regions scroll — the query history inside the sidebar, and the
thread inside main.

The handoff suggests the shell as Server Components and the thread as Client
Components. That split does not survive contact with the state: the drawer
toggle, the query history, the composer draft and the thread-start notice are
each read or written by more than one of those three regions.

## Relevant files

- `src/app/layout.tsx` — fonts, global CSS, the language provider
- `src/app/(app)/layout.tsx` — route-group isolation, and where route protection
  will go
- `src/app/(app)/chat/page.tsx` — a Server Component that passes the profile down
- `src/components/layout/app-shell.tsx` — the single client boundary
- `src/components/layout/sidebar.tsx`, `topbar.tsx`
- `src/components/chat/composer.tsx`, `empty-state.tsx`, `thread-notice.tsx`
- `src/lib/utils/history.ts`, `src/__tests__/components/history.test.ts`

## Pattern or technique

**One client boundary, pushed as high as the shared state requires, with
presentational leaves below it.**

Spec section 9 says to keep client components as leaf nodes and not to make a
parent client just to pass a handler down. That rule assumes the state has a
single owner. Here it does not:

- `☰` lives in the topbar, `✕` lives in the sidebar, both drive `sidebarOpen`
- submitting in the composer writes the history the sidebar renders, and the
  thread title the topbar renders
- picking an example in the empty state writes the composer's draft
- submitting collapses the thread-start notice

Four pieces of state, each shared by two siblings. Lifting them to `AppShell` and
marking that one file `'use client'` is the smaller diff than four contexts. Every
component below it — `Sidebar`, `Topbar`, `Composer`, `EmptyState`,
`ThreadNotice` — takes props and owns nothing.

`page.tsx` stays a Server Component and passes the profile in, which is the seam
that matters: when `src/lib/auth/` lands, the profile is read server-side there
and nothing in the shell changes.

**The composer is controlled, not self-contained.** It started with its own
`useState` for the draft. The empty state needs to write that draft, so the draft
moved up and the composer became `{ draft, onDraftChange, onSubmit }`. Worth
naming because it is the moment the "leaf components own nothing" rule paid off.

**One breakpoint, expressed as a named screen.** The design has a single cut at
860px, which is not a Tailwind default. Rather than `min-[860px]:` scattered
through the markup, `screens: { shell: '860px' }` in the config gives
`shell:static`, `shell:w-sidebar`, `shell:hidden`. The sidebar carries both
states in one element: drawer classes unprefixed, docked classes behind `shell:`.
No duplicate markup, and no JavaScript media query that would need to match the
CSS.

## Decision tradeoffs

**One client boundary versus several contexts.** Contexts would keep more of the
tree on the server. They would also mean four providers, four hooks, and a
re-render story that is harder to follow than `useState` in one file. The cost of
the chosen approach is real: the sidebar's static chrome ships to the browser as
client JavaScript even though it never changes. At this size — the whole `/chat`
route is 5.66 kB — that is not worth optimising. If the thread grows expensive,
the fix is to pass server-rendered content into `AppShell` as `children`, not to
break the state apart.

**History as a pure function.** `addHistoryTopic` and `toHistoryTopic` live in
`src/lib/utils/` rather than inside the component. The truncation rule (38
characters plus an ellipsis) and the no-duplicates rule are the kind of thing
that gets quietly broken, and testing them through a rendered component would
mean typing into an input to assert on a string. Two pure functions, six
assertions, no DOM.

**`children` was not used for the thread.** `AppShell` renders `EmptyState`
directly instead of accepting it as `children`. That is a deliberate loan against
the future: it is the cheapest thing now, and it is exactly what has to change
when real messages arrive. The alternative — building the `children` seam before
there is a second thing to put through it — is scaffolding for a feature that
does not exist yet.
