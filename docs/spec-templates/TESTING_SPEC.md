# Estrategia de pruebas

> Plantilla. Ajusta los umbrales y bórrala cuando el proyecto tenga su propia versión.

## Alcance

| Capa | Qué se prueba | Cómo |
| --- | --- | --- |
| `lib/validation.ts` | cada rama de cada validador | pruebas puras, sin mocks |
| `lib/db-server.ts` | filtros y forma de la fila enviada | `createSupabaseMock` |
| `app/api/**` | 401, 400, 404, camino feliz y 500 | `jsonRequest` + módulos mockeados |
| Hooks de React Query | clave usada e invalidaciones tras mutar | `createWrapper` |
| Componentes | roles accesibles y estados, nunca clases CSS | Testing Library |

## Reglas

- Consulta el DOM por rol y texto accesible. Nunca por clase: el boilerplate no fija estilos y las clases cambiarán.
- Una prueba comprueba un comportamiento. El nombre dice qué falla, no qué llama.
- Nada de red real. El cliente del backend siempre está mockeado.
- Los datos de prueba salen de fábricas en `__tests__/helpers/`, con sobrescrituras parciales.

## Comandos

```bash
npm test              # una pasada
npm run test:watch    # durante el desarrollo
npm run test:coverage # informe de cobertura
```

## Umbral

Cobertura mínima acordada: __%. Configúrala en `coverageThreshold` dentro de `jest.config.js` cuando el proyecto la fije.
