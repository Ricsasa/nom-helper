# Convex variant

Install it with `npm run setup convex` from the boilerplate root. The script copies `files/` over the root and installs `convex`.

> This variant does not come from the original project. It is written from scratch for this boilerplate. The Supabase variant is extracted from production code.

## What it adds

| File | What for |
| --- | --- |
| `convex/schema.ts` | the sample `items` table with a `by_user` index |
| `convex/items.ts` | reference query and mutations, with identity and ownership checks |
| `components/providers/ConvexProvider.tsx` | the Convex client, created once at module level |
| `components/providers/AppProviders.tsx` | replaces the core file: it mounts Convex instead of React Query |
| `app/items/page.tsx` | a reference page with `useQuery` and `useMutation` |

## Getting started

1. `npx convex dev` — it creates the deployment, generates `convex/_generated/`, and writes `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` into `.env.local`.
2. Leave that process running in one terminal and run `npm run dev` in another.
3. Until step 1 finishes, `convex/_generated/` does not exist and `npm run type-check` fails in `convex/items.ts` and in `app/items/page.tsx`. That is expected.

## Authentication

The boilerplate fixes no provider. Pick one:

- **Convex Auth**: `npm create convex@latest -- --auth`, or run `npx @convex-dev/auth` on this project. Then replace `ConvexProvider` with `ConvexAuthNextjsProvider` in `AppProviders.tsx`.
- **Clerk**: wrap the tree with `ConvexProviderWithClerk`.

`ctx.auth.getUserIdentity()` works the same with either one, so `convex/items.ts` does not change.

## Differences from the Supabase variant

- **There is no RLS.** Authorization is code: every function calls `requireUserId` and checks document ownership before it writes. A document id can be guessed.
- **There is no `app/api/**`.** The functions in `convex/` are the backend, so no intermediate REST layer is needed.
- **There is no React Query.** The Convex `useQuery` is already reactive and refreshes itself after a mutation. If you also talk to a REST API, mount `QueryProvider` again in `AppProviders.tsx`.
- **Deployment:** besides Vercel, the Convex production deployment ships with `npx convex deploy`. Add that command to the workflow when you use CI.
