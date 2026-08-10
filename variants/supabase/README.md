# Variante Supabase

Instálala con `npm run setup supabase` desde la raíz del boilerplate. El script copia `files/` sobre la raíz e instala `@supabase/supabase-js`.

## Qué añade

| Archivo | Para qué |
| --- | --- |
| `lib/supabase.ts` | cliente de navegador, cliente por petición con el token del usuario y `authenticateRequest` |
| `lib/api-client.ts` | `authHeaders` y `apiRequest<T>` para el lado cliente |
| `lib/api-response.ts` | respuestas uniformes, límite de 64 KB en el cuerpo y errores 500 sin filtrar detalles |
| `lib/db-server.ts` | acceso a datos del servidor, con el recurso `items` de ejemplo |
| `lib/db-queries.ts` | hooks de React Query sobre la API interna |
| `app/api/items/**` | handlers de referencia: autenticar, leer, validar, consultar |
| `app/auth/login\|signup` | páginas de acceso sin estilos |
| `components/AuthForm.tsx` | formulario de acceso y registro |
| `components/SessionGate.tsx` | protege el árbol autenticado y limpia la caché al cerrar sesión |
| `__tests__/helpers/*` | `jsonRequest`, `malformedRequest` y el mock del query builder |
| `__tests__/api/items.test.ts` | prueba de referencia de un handler |

## Puesta en marcha

1. Crea el proyecto en [supabase.com](https://supabase.com) y copia la URL y la clave publicable.
2. `cp .env.local.example .env.local` y rellena los valores.
3. Crea la tabla `items` con RLS activo. Usa `docs/spec-templates/DATABASE_SCHEMA.md` como guía:

```sql
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index items_user_id_idx on public.items (user_id);

alter table public.items enable row level security;

create policy "items_select_own" on public.items
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "items_insert_own" on public.items
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "items_update_own" on public.items
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "items_delete_own" on public.items
  for delete to authenticated using ((select auth.uid()) = user_id);
```

4. Opcional: `cp .mcp.json.example .mcp.json` y pon tu `project_ref` para hablar con Supabase desde el agente.

## Reglas

- El navegador nunca escribe en la base de datos directamente: pasa por `app/api/**`, que valida antes de tocar Postgres.
- RLS es la frontera de seguridad. El filtro `user_id` en `lib/db-server.ts` es un segundo cierre, no el primero.
- Las skills `supabase` y `supabase-postgres-best-practices` de `.agents/skills/` cubren esquema, RLS, índices y migraciones.
