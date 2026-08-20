# Internal API

> Template. Fill one row per endpoint before you write the handler. Delete this file if the project exposes no API of its own (Convex does not need one).

## Conventions

- Every handler lives in `app/api/**/route.ts`.
- Authentication: the `Authorization: Bearer <access_token>` header. The handler calls `authenticateRequest(request)` and answers 401 when the call returns `null`.
- Body: read it with `readJsonBody`. That helper rejects payloads larger than 64 KB and invalid JSON with a 400.
- Responses: `jsonOk`, `jsonError`, `unauthorized`, `notFound`, `serverError`. The detail of a 500 error never crosses the network. Only the `reference` travels, which links the response to the server log.
- Validation: use the primitives in `lib/validation.ts`, chained with `??`, before you touch the database.

## Endpoints

| Method | Route | Auth | Body | 2xx response | Errors |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/items` | Yes | — | `200 { items: Item[] }` | 401, 500 |
| POST | `/api/items` | Yes | `{ name: string }` | `201 { item: Item }` | 400, 401, 500 |
| PATCH | `/api/items/[id]` | Yes | `{ name?: string }` | `200 { item: Item }` | 400, 401, 404, 500 |
| DELETE | `/api/items/[id]` | Yes | — | `200 { success: true }` | 401, 404, 500 |

## Limits

| Limit | Value | Where it applies |
| --- | --- | --- |
| Body size | 64 KB | `readJsonBody` |
| Rows per read | 1000 | list queries |
| Identifiers per filter | 100 | `validateUuidList` |
