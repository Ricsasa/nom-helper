# Esquema de base de datos

> Plantilla. Documenta aquí el esquema real antes de crear las migraciones.

## Tablas

### `items`

| Columna | Tipo | Restricciones |
| --- | --- | --- |
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `user_id` | `uuid` | `not null`, FK a `auth.users(id)` `on delete cascade` |
| `name` | `text` | `not null`, `check (char_length(name) between 1 and 100)` |
| `created_at` | `timestamptz` | `not null default now()` |
| `updated_at` | `timestamptz` | `not null default now()` |

Índices: uno por cada clave foránea (`items_user_id_idx`), más los que exija cada consulta de lista.

## Row Level Security

Cada tabla con `user_id` lleva RLS activo y cuatro políticas (select, insert, update, delete). Envuelve la función de sesión en un subselect para que el planificador la evalúe una sola vez:

```sql
alter table public.items enable row level security;

create policy "items_select_own" on public.items
  for select to authenticated
  using ((select auth.uid()) = user_id);
```

## Triggers

- `updated_at`: trigger `before update` que escribe `now()`.
- Alta de usuario: trigger `after insert on auth.users` si el proyecto necesita crear filas iniciales.

## Migraciones

Una migración por cambio, en `supabase/migrations/`, nunca editada después de aplicarse. Verifica con `mcp__supabase__get_advisors` que no queden tablas sin RLS ni claves foráneas sin índice.
