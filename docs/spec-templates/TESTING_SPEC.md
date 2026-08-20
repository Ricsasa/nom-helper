# Testing strategy

> Template. Adjust the thresholds, and delete this file once the project has its own version.

## Scope

| Layer | What it tests | How |
| --- | --- | --- |
| `lib/validation.ts` | every branch of every validator | pure tests, no mocks |
| `lib/db-server.ts` | filters and the shape of the row sent | `createSupabaseMock` |
| `app/api/**` | 401, 400, 404, the happy path, and 500 | `jsonRequest` plus mocked modules |
| React Query hooks | the key used and the invalidations after a mutation | `createWrapper` |
| Components | accessible roles and states, never CSS classes | Testing Library |

## Rules

- Query the DOM by role and accessible text. Never query by class: the boilerplate sets no styles, and the classes will change.
- One test checks one behavior. The name says what fails, not what it calls.
- Use no real network. The backend client is always mocked.
- Test data comes from factories in `__tests__/helpers/`, with partial overrides.

## Commands

```bash
npm test              # one pass
npm run test:watch    # during development
npm run test:coverage # coverage report
```

## Threshold

Agreed minimum coverage: __%. Set it in `coverageThreshold` inside `jest.config.js` once the project fixes the value.
