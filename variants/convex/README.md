# Variante Convex

Instálala con `npm run setup convex` desde la raíz del boilerplate. El script copia `files/` sobre la raíz e instala `convex`.

> Esta variante no viene del proyecto original: está escrita desde cero para este boilerplate. La de Supabase sí está extraída de código en producción.

## Qué añade

| Archivo | Para qué |
| --- | --- |
| `convex/schema.ts` | tabla `items` de ejemplo con índice `by_user` |
| `convex/items.ts` | query y mutations de referencia, con comprobación de identidad y de propiedad |
| `components/providers/ConvexProvider.tsx` | cliente de Convex, creado una sola vez a nivel de módulo |
| `components/providers/AppProviders.tsx` | sustituye al del núcleo: monta Convex en lugar de React Query |
| `app/items/page.tsx` | página de referencia con `useQuery` y `useMutation` |

## Puesta en marcha

1. `npx convex dev` — crea el deployment, genera `convex/_generated/` y escribe `NEXT_PUBLIC_CONVEX_URL` y `CONVEX_DEPLOYMENT` en `.env.local`.
2. Deja ese proceso corriendo en una terminal y `npm run dev` en otra.
3. Hasta que el paso 1 termine, `convex/_generated/` no existe y `npm run type-check` falla en `convex/items.ts` y en `app/items/page.tsx`. Es esperado.

## Autenticación

El boilerplate no fija proveedor. Elige uno:

- **Convex Auth**: `npm create convex@latest -- --auth`, o `npx @convex-dev/auth` sobre este proyecto. Después cambia `ConvexProvider` por `ConvexAuthNextjsProvider` en `AppProviders.tsx`.
- **Clerk**: envuelve con `ConvexProviderWithClerk`.

`ctx.auth.getUserIdentity()` funciona igual con cualquiera de los dos, así que `convex/items.ts` no cambia.

## Diferencias con la variante Supabase

- **No hay RLS.** La autorización es código: cada función llama a `requireUserId` y comprueba la propiedad del documento antes de escribir. Un id de documento se puede adivinar.
- **No hay `app/api/**`.** Las funciones de `convex/` son el backend; no hace falta capa REST intermedia.
- **No hay React Query.** `useQuery` de Convex ya es reactivo y se actualiza solo tras una mutación. Si además hablas con una API REST, vuelve a montar `QueryProvider` en `AppProviders.tsx`.
- **Despliegue:** además de Vercel, la producción de Convex se publica con `npx convex deploy`. Añádelo al workflow si usas CI.
