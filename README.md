# Next boilerplate

A starting point for Next.js 15 and React 19 projects with a Supabase or Convex backend. **No visual decisions**: Tailwind is installed, but its configuration defines no color, no spacing, and no type scale. Each project on top of this base picks its own visual language.

## Getting started

```bash
git clone <this-repo> my-project && cd my-project
rm -rf .git && git init
npm install
npm run setup supabase     # or: npm run setup convex
cp .env.local.example .env.local   # the variant leaves it in the root
npm run dev
```

Then: change `name` in `package.json`, change the `<title>` and the `metadata` in [app/layout.tsx](app/layout.tsx), and delete `variants/` once you no longer need it.

## What the core brings

| Area | What it has |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript in strict mode, the `@/*` alias |
| Server state | React Query with a 5 min `staleTime` and keys centralized in [lib/query-keys.ts](lib/query-keys.ts) |
| Client state | Zustand, for interface state only ([lib/store.ts](lib/store.ts)) |
| Theme | `next-themes` with `attribute="class"`, aligned with the Tailwind `darkMode: 'class'` setting |
| Language | An en/es context of its own, with `t('nested.key')` and `{{var}}` interpolation ([lib/i18n/](lib/i18n/)) |
| Notices | `ToastProvider` with the `status` and `alert` roles, unstyled |
| Validation | Reusable primitives in [lib/validation.ts](lib/validation.ts), with tests |
| Security | A strict CSP and headers in [next.config.mjs](next.config.mjs) |
| Tests | Jest, ts-jest, and Testing Library. `jsdom` by default, and `node` by docblock in the API tests |
| CI | Lint, types, and tests, plus preview and production deployment to Vercel |
| Agents | The `supabase` and `supabase-postgres-best-practices` skills in [.agents/skills/](.agents/skills/), plus specification templates in [docs/spec-templates/](docs/spec-templates/) |

## Backend variants

`npm run setup <variant>` copies `variants/<variant>/files/` over the root and installs its packages.

- **[supabase](variants/supabase/README.md)** — a browser client and a per-request client, `authenticateRequest` with a Bearer token, an `app/api/**` layer with validation, response helpers, React Query hooks, a sign-in form, and a query builder mock for tests. Extracted from a production project.
- **[convex](variants/convex/README.md)** — a schema, functions that check identity and ownership, a provider, and a reference page. Written for this boilerplate, with no authentication provider fixed.

The two variants write different files, except `components/providers/AppProviders.tsx` and `.env.local.example`. Install one only.

## Conventions

- **Components never call `fetch`.** They call a hook, and the hook decides where the data comes from.
- **One React Query key, one place.** They all live in `lib/query-keys.ts`, so an invalidation never drifts from the key a hook subscribed with.
- **A 500 error never carries detail.** `serverError` logs the full error on the server and returns a `reference` only.
- **Tests query by role and accessible text**, never by class: there are no styles here, and the classes will change.
- **`lib/types.ts`, `queryKeys.items`, and the `items` table** are the sample resource. Delete them as soon as the real domain exists.

## Scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run lint         # eslint (next/core-web-vitals)
npm run type-check   # tsc --noEmit
npm test             # jest
npm run test:coverage
npm run setup <v>    # install a backend variant
```

## Agent configuration

- `.claude/settings.json` is versioned; `.claude/settings.local.json` is not. Copy `.claude/settings.local.json.example` to start from a reasonable permission list.
- `.mcp.json.example` — copy it to `.mcp.json` and set your Supabase `project_ref`.
- `skills-lock.json` pins the version of the skills in `.agents/skills/`.

## Deployment

The [.github/workflows/ci.yml](.github/workflows/ci.yml) workflow verifies every push and deploys to Vercel. Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and the public variables of the backend you use. With Convex, add `npx convex deploy` to the production job.
