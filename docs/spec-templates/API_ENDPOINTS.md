# API interna

> Plantilla. Rellena una fila por endpoint antes de escribir el handler y bórrala si el proyecto no expone API propia (Convex no la necesita).

## Convenciones

- Todos los handlers viven en `app/api/**/route.ts`.
- Autenticación: cabecera `Authorization: Bearer <access_token>`; el handler llama a `authenticateRequest(request)` y responde 401 si devuelve `null`.
- Cuerpo: se lee con `readJsonBody`, que rechaza cargas mayores de 64 KB y JSON inválido (400).
- Respuestas: `jsonOk`, `jsonError`, `unauthorized`, `notFound`, `serverError`. El detalle de un error 500 nunca cruza la red; solo viaja el `reference` que lo enlaza con el log del servidor.
- Validación: primitivas de `lib/validation.ts`, encadenadas con `??`, antes de tocar la base de datos.

## Endpoints

| Método | Ruta | Auth | Cuerpo | Respuesta 2xx | Errores |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/items` | Sí | — | `200 { items: Item[] }` | 401, 500 |
| POST | `/api/items` | Sí | `{ name: string }` | `201 { item: Item }` | 400, 401, 500 |
| PATCH | `/api/items/[id]` | Sí | `{ name?: string }` | `200 { item: Item }` | 400, 401, 404, 500 |
| DELETE | `/api/items/[id]` | Sí | — | `200 { success: true }` | 401, 404, 500 |

## Límites

| Límite | Valor | Dónde se aplica |
| --- | --- | --- |
| Tamaño del cuerpo | 64 KB | `readJsonBody` |
| Filas por lectura | 1000 | consultas de lista |
| Identificadores por filtro | 100 | `validateUuidList` |
