# Next boilerplate

Punto de partida para proyectos Next.js 15 + React 19 con backend Supabase o Convex. **Sin decisiones visuales**: Tailwind está instalado pero su configuración no define ni un color, ni un espaciado, ni una escala tipográfica. Cada proyecto encima de esta base elige su propio lenguaje visual.

## Puesta en marcha

```bash
git clone <este-repo> mi-proyecto && cd mi-proyecto
rm -rf .git && git init
npm install
npm run setup supabase     # o: npm run setup convex
cp .env.local.example .env.local   # la variante lo deja en la raíz
npm run dev
```

Después: cambia `name` en `package.json`, el `<title>` y el `metadata` de [app/layout.tsx](app/layout.tsx), y borra `variants/` cuando ya no la necesites.

## Qué trae el núcleo

| Área | Qué hay |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript en modo estricto, alias `@/*` |
| Estado servidor | React Query con `staleTime` de 5 min y claves centralizadas en [lib/query-keys.ts](lib/query-keys.ts) |
| Estado cliente | Zustand, solo para estado de interfaz ([lib/store.ts](lib/store.ts)) |
| Tema | `next-themes` con `attribute="class"`, alineado con `darkMode: 'class'` de Tailwind |
| Idioma | Contexto propio en/es con `t('clave.anidada')` e interpolación `{{var}}` ([lib/i18n/](lib/i18n/)) |
| Avisos | `ToastProvider` con roles `status` y `alert`, sin estilos |
| Validación | Primitivas reutilizables en [lib/validation.ts](lib/validation.ts), con pruebas |
| Seguridad | CSP y cabeceras estrictas en [next.config.mjs](next.config.mjs) |
| Pruebas | Jest + ts-jest + Testing Library, `jsdom` por defecto y `node` por docblock en las de API |
| CI | Lint, tipos y pruebas, más despliegue de preview y de producción a Vercel |
| Agentes | Skills `supabase` y `supabase-postgres-best-practices` en [.agents/skills/](.agents/skills/), plantillas de especificación en [docs/spec-templates/](docs/spec-templates/) |

## Variantes de backend

`npm run setup <variante>` copia `variants/<variante>/files/` sobre la raíz e instala sus paquetes.

- **[supabase](variants/supabase/README.md)** — cliente de navegador y por petición, `authenticateRequest` con token Bearer, capa `app/api/**` con validación, helpers de respuesta, hooks de React Query, formulario de acceso y mock del query builder para pruebas. Extraído de un proyecto en producción.
- **[convex](variants/convex/README.md)** — esquema, funciones con comprobación de identidad y propiedad, provider y página de referencia. Escrito para este boilerplate, sin proveedor de autenticación fijado.

Las dos variantes escriben archivos distintos salvo `components/providers/AppProviders.tsx` y `.env.local.example`. Instala una sola.

## Convenciones

- **Los componentes no llaman a `fetch`.** Llaman a un hook, y el hook decide de dónde salen los datos.
- **Una clave de React Query, un sitio.** Todas viven en `lib/query-keys.ts`, para que una invalidación no se separe de la clave con la que un hook se suscribió.
- **El error 500 nunca lleva detalle.** `serverError` registra el error completo en el servidor y devuelve solo un `reference`.
- **Las pruebas consultan por rol y texto accesible**, nunca por clase: aquí no hay estilos y las clases cambiarán.
- **`lib/types.ts`, `queryKeys.items` y la tabla `items`** son el recurso de ejemplo. Bórralos en cuanto el dominio real exista.

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # eslint (next/core-web-vitals)
npm run type-check   # tsc --noEmit
npm test             # jest
npm run test:coverage
npm run setup <v>    # instalar una variante de backend
```

## Configuración de agentes

- `.claude/settings.json` se versiona; `.claude/settings.local.json` no. Copia `.claude/settings.local.json.example` para partir de una lista de permisos razonable.
- `.mcp.json.example` — cópialo a `.mcp.json` y pon tu `project_ref` de Supabase.
- `skills-lock.json` fija la versión de las skills de `.agents/skills/`.

## Despliegue

El workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) verifica cada push y despliega a Vercel. Secretos necesarios: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` y las variables públicas del backend que uses. Con Convex, añade `npx convex deploy` al job de producción.
