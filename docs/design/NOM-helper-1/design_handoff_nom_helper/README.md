# Handoff: NOM Helper — asistente de consulta normativa

Paquete de implementación para **React + Next.js (App Router) + Tailwind CSS**.
Autor del diseño: rs-studio.dev

---

## 1. Overview

NOM Helper es un asistente de consulta sobre la **NOM-001-SEDE-2018** (instalaciones eléctricas). El usuario pregunta en lenguaje natural y recibe una respuesta estructurada donde **cada afirmación es rastreable a una cita** con capítulo, artículo y página.

El producto tiene tres superficies:

| Superficie | Ruta sugerida | Qué hace |
|---|---|---|
| Acceso / Registro | `/login`, `/registro` | Autenticación con errores específicos |
| Consulta (chat) | `/` | Hilo de consulta + barra lateral con historial |
| Acerca y fuentes | `/acerca` | Normas incorporadas, alcance, anatomía de la respuesta, aviso legal |

La tesis de diseño: **es una herramienta de referencia técnica, no un chatbot**. Por eso todo es cuadrado (radio 0), la tipografía monoespaciada carga los metadatos (referencias, estados, etiquetas) y la sans carga la prosa. No hay gradientes, no hay sombras salvo una, no hay color decorativo.

---

## 2. About the design files

El archivo `NOM Helper.dc.html` incluido en este bundle es una **referencia de diseño creada en HTML** — un prototipo que muestra la apariencia y el comportamiento previstos. **No es código de producción para copiar directamente.**

La tarea es **recrear estos diseños en el entorno del codebase destino** (Next.js + React) usando sus patrones y librerías establecidos. El prototipo usa estilos inline por razones ajenas al producto final; en Next.js todo debe expresarse como clases Tailwind sobre componentes React.

Para abrirlo: es un HTML autocontenido, se abre en cualquier navegador. La barra de navegación flotante (Acceso / Registro / Chat / Con respuesta / Error / Acerca) es **andamiaje del prototipo para saltar entre estados** — no se implementa.

---

## 3. Fidelity

**Alta fidelidad (hifi).** Colores, tipografía, espaciado y estados son finales. Reprodúcelos con precisión. Donde el codebase ya tenga primitivas equivalentes (Button, Input), úsalas y ajústalas a estos tokens en lugar de crear componentes paralelos.

---

## 4. Stack y setup

### 4.1 Fuentes — `next/font`

Dos familias, ambas de Google Fonts. **IBM Plex Sans** para prosa e interfaz, **IBM Plex Mono** para metadatos.

```ts
// app/fonts.ts
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
```

```tsx
// app/layout.tsx
<html lang="es" className={`${plexSans.variable} ${plexMono.variable}`}>
  <body className="bg-canvas text-ink font-sans antialiased">{children}</body>
</html>
```

**Nunca usar weight 700.** El peso máximo es 600 y solo en títulos y etiquetas cortas. El énfasis en esta interfaz se hace con peso 500–600, color y regla, no con negritas pesadas.

### 4.2 `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:    '#FBFBFA',  // fondo de la app
        surface:   '#FFFFFF',  // tarjetas, paneles, filas de datos
        muted:     '#F7F7F4',  // sidebar, franja de footer, blockquote de cita
        subtle:    '#FAFAF8',  // fila de norma sustituida
        hover:     '#F1F1EE',  // hover en sidebar
        hoverAlt:  '#F4F4F1',  // hover en filas de contenido
        selected:  '#EAEAE5',  // item de historial activo

        line:      '#E4E4E1',  // borde estructural (el más usado)
        lineSoft:  '#EDEDEA',  // separador interno dentro de una tarjeta
        lineInput: '#D8D8D4',  // borde de input
        lineDash:  '#DCDCD8',  // borde punteado de estado vacío
        lineGhost: '#E0E0DC',  // borde de botón fantasma
        lineFirm:  '#D6D6D2',  // borde de bloque enfático

        ink:       '#16181A',  // texto principal / botón primario
        body:      '#2A2D30',  // prosa larga
        muted2:    '#55595E',  // texto secundario, labels
        faint:     '#8A8F95',  // etiquetas mono, metadatos
        faint2:    '#A2A6AA',  // placeholder, footnotes
        faint3:    '#B6B9BC',  // texto inactivo en nav oscura

        green:     '#2E7D5B',  // acento: acción, confirmación, links
        greenDeep: '#1F5A41',  // link hover
        violet:    '#6B5BA6',  // acento: citas, referencias, sistema

        // Aviso (ámbar) — sistema de tres capas
        noticeBg:     '#FDFAEC',
        noticeBgHov:  '#FAF5DE',
        noticeBorder: '#E7DCB4',
        noticeRule:   '#C9A227',
        noticeText:   '#4A4127',
        noticeLink:   '#6B5312',

        // Error
        errBg:     '#FCF6F4',
        errBorder: '#D9C9C4',
        errTitle:  '#7A3520',
        errBody:   '#6B4A3E',
        errMark:   '#8C3A24',

        barEmpty:  '#C9C9C4',  // barra de confianza vacía
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // escala real del diseño — valores fraccionarios intencionales
        micro:  ['10.5px', { lineHeight: '1.4' }],
        mini:   ['11px',   { lineHeight: '1.4' }],
        xs:     ['11.5px', { lineHeight: '1.45' }],
        sm:     ['12.5px', { lineHeight: '1.5' }],
        base:   ['13.5px', { lineHeight: '1.55' }],
        md:     ['14.5px', { lineHeight: '1.55' }],
        lg:     ['15px',   { lineHeight: '1.6' }],
        xl:     ['17px',   { lineHeight: '1.5' }],
        '2xl':  ['19px',   { lineHeight: '1.4' }],
        '3xl':  ['23px',   { lineHeight: '1.35' }],
        '4xl':  ['24px',   { lineHeight: '1.3' }],
      },
      letterSpacing: {
        label: '0.09em',   // etiquetas mono en versalitas
        ref:   '0.01em',   // referencias mono
        tight: '-0.015em', // títulos grandes
      },
      maxWidth: {
        thread: '720px',   // columna del hilo de consulta
        doc:    '760px',   // columna de la página Acerca
        auth:   '396px',   // tarjeta de acceso
      },
      spacing: {
        sidebar: '274px',
        drawer:  '300px',
        topbar:  '53px',
      },
      boxShadow: {
        drawer: '0 0 0 100vw rgba(22,24,26,.28)', // scrim del drawer móvil
      },
    },
  },
} satisfies Config;
```

### 4.3 Reglas globales

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body { margin: 0; padding: 0; }
  a  { color: #2E7D5B; text-decoration: none; }
  a:hover { color: #1F5A41; text-decoration: underline; }
  ::placeholder { color: #A2A6AA; }
}

@layer utilities {
  @keyframes nom-pulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
  .animate-nom-pulse { animation: nom-pulse 1.1s ease-in-out infinite; }
}
```

---

## 5. Design tokens — resumen

### 5.1 Color: cómo se usa

Tres acentos, cada uno con un trabajo fijo. **No los intercambies.**

| Acento | Hex | Significado | Dónde aparece |
|---|---|---|---|
| Verde | `#2E7D5B` | Acción del usuario, links, confirmación | `+` de nueva consulta, links, hover del botón primario, cuadro de "Resumen", marcador de sección |
| Violeta | `#6B5BA6` | Procedencia: el sistema y sus fuentes | Marcas de cita `[1]`, regla del blockquote, numeración de ejemplos, punto de "generando", borde del historial activo |
| Ámbar | `#C9A227` | Advertencia persistente | Las tres capas de disclaimer, y nada más |

Negro `#16181A` es el color de acción primaria (botón lleno, regla del resumen, barras de confianza llenas). Rojo terroso solo para error de sistema.

**La confianza nunca se codifica por color** — se codifica por rótulo + peso 600 + tres marcas cuadradas llenas/vacías. Un daltónico debe poder leerla.

### 5.2 Forma

- **Border radius: `rounded-none` en absolutamente todo.** Botones, inputs, tarjetas, avisos, drawer. Esta es la decisión formal más importante del diseño; un `rounded-md` accidental rompe el registro.
- Bordes: `border` (1px) para estructura; `border-l-2` (regla de resumen, historial activo); `border-l-[3px]` (avisos ámbar).
- Marcadores: cuadrados de `w-2 h-2` (8px) o `w-[7px] h-[7px]`, llenos o con borde `1.5px`. Nunca círculos.
- Sombras: solo el scrim del drawer móvil y la barra de andamiaje del prototipo. **La UI de producción no lleva sombras.**

### 5.3 Espaciado

Ritmo de 2/4px. Valores recurrentes: `p-2 p-2.5 p-3 p-3.5 p-4 p-[18px] p-5 p-6`; gaps `gap-1 gap-1.5 gap-2 gap-2.5 gap-3 gap-3.5 gap-4`; separación entre bloques de sección `mt-11` / `mt-12` (44/48px).

**Usa siempre `flex`/`grid` + `gap`**, nunca márgenes individuales para separar hermanos.

---

## 6. Primitivas

Clases exactas, listas para copiar.

### Botón primario
```tsx
className="bg-ink text-white px-3.5 py-[11px] text-md font-medium tracking-[0.01em]
           cursor-pointer transition-colors hover:bg-green disabled:cursor-default"
```
Variante del compositor (estado deshabilitado por input vacío):
`bg-line text-faint2 cursor-default` cuando no hay texto; `bg-ink text-white cursor-pointer` cuando sí.

### Botón fantasma
```tsx
className="border border-lineGhost bg-transparent px-2.5 py-[5px] text-sm text-muted2
           hover:border-[#B9BCB8] hover:text-ink"
```

### Input
```tsx
className="w-full border border-lineInput bg-surface px-[11px] py-[9px] text-[14px]
           text-ink outline-none focus:border-green"
```
Label asociado: `text-sm font-medium text-muted2 tracking-[0.01em]`, `flex flex-col gap-1.5`.

### Etiqueta de sección (mono, versalitas)
```tsx
className="font-mono text-micro tracking-label uppercase text-faint"
```
Casi siempre precedida de un marcador: `<span className="w-[7px] h-[7px] bg-green shrink-0 -translate-y-px" />`.

### Tarjeta / panel
```tsx
className="border border-line bg-surface"
```
Filas internas separadas con `border-b border-lineSoft`, la última sin borde.

### Fila de datos clave/valor
```tsx
<div>
  <div className="font-mono text-[10px] tracking-label uppercase text-faint2">Versión</div>
  <div className="font-mono text-sm text-ink mt-[3px]">2018</div>
</div>
```

---

## 7. Pantallas

### 7.1 Acceso / Registro

**Layout:** columna de altura completa, `h-screen flex flex-col overflow-hidden`. Un área interior `flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-5 py-10 gap-6` y, pegada abajo, la **franja de footer** (§7.6). El footer debe quedar siempre a la vista: es el interior el que hace scroll, no la página.

**Contenido, en orden:**

1. **Marca** — dos cuadros de 10px lado a lado (`gap-2`), verde y violeta; debajo `NOM Helper` en `text-2xl font-semibold tracking-[-0.01em]`; debajo, en mono `text-xs uppercase tracking-[0.04em] text-faint`: `NOM-001-SEDE · Instalaciones eléctricas`.
2. **Tarjeta** — `w-full max-w-auth border border-line bg-surface p-8`.
   - Título `text-[16px] font-semibold`: *Iniciar sesión* / *Crear cuenta*.
   - Subtítulo `text-base text-muted2 mb-6`: *Consulta técnica sobre la NOM-001-SEDE.* / *Acceso a la consulta técnica de la NOM-001-SEDE.*
   - Banda de error (si aplica, §7.7).
   - Campos `flex flex-col gap-4`: **Nombre** (solo registro, placeholder `Ing. Ramiro Martínez`), **Correo** (`nombre@empresa.mx`), **Contraseña** (`••••••••`).
   - En login, la fila del label de contraseña lleva a la derecha *Recuperar acceso* (`text-sm font-normal text-muted2 underline underline-offset-2`).
   - En registro, bajo el campo: `Mínimo 8 caracteres, 1 número` en mono `text-xs text-faint`.
   - Botón primario ancho completo: *Entrar* / *Crear cuenta*.
3. **Cambio de modo** — `text-base text-muted2`: *¿No tienes cuenta?* + link *Crea una* (y viceversa: *¿Ya tienes cuenta?* / *Inicia sesión*).

**Validación (mensajes exactos, todos accionables):**

| Condición | Título | Ayuda |
|---|---|---|
| Login sin correo o sin contraseña | Faltan credenciales | Escribe tu correo y contraseña para entrar. |
| Login con contraseña incorrecta | Correo o contraseña incorrectos | Revisa la contraseña; si no la recuerdas, usa Recuperar acceso. |
| Registro, correo ya existente | Ese correo ya tiene cuenta | Inicia sesión con él o usa otro correo para registrarte. |
| Registro, contraseña débil | La contraseña no cumple los requisitos | Necesita al menos 8 caracteres e incluir un número. |
| Registro, campos vacíos | Faltan datos para crear la cuenta | Completa nombre y correo antes de continuar. |

Regla de contraseña: `length >= 8 && /[0-9]/.test(pass)`.
`Enter` en el campo de contraseña envía el formulario.

### 7.2 Shell de consulta

```
h-screen flex flex-col overflow-hidden
├── flex flex-1 min-h-0 overflow-hidden
│   ├── <Sidebar>   w-sidebar shrink-0        (drawer fijo en móvil)
│   └── <Main>      flex-1 flex flex-col min-w-0
└── <FooterStrip>   shrink-0
```

**Breakpoint: 860px.** Por debajo, la sidebar sale del flujo: `fixed inset-y-0 left-0 w-drawer z-40 shadow-drawer`, con botón `✕` en su cabecera y botón `☰` en la topbar principal. Se cierra al elegir cualquier item.

#### Sidebar (`bg-muted border-r border-line flex flex-col h-full overflow-hidden`)

1. **Cabecera** `px-4 pt-[18px] pb-3.5 border-b border-line` — dos cuadros de 8px (`gap-[3px]`) + `NOM Helper` en `text-[14.5px] font-semibold`.
2. **Navegación** `px-2.5 py-3 border-b border-line flex flex-col gap-0.5 shrink-0`:
   - **Nueva consulta** — item con `+` verde en mono, `font-medium text-ink`.
   - **Calculadoras** — *rótulo de sección*, no un botón: `flex items-center gap-2.5 px-2.5 pt-3.5 pb-1.5`, con `×÷` violeta en mono y el texto en `font-mono text-micro tracking-label uppercase text-faint2`. Debajo, tres entradas indentadas (`pl-8 py-[7px] text-base text-muted2`): *Calculadora 1/2/3* — placeholders sin funcionalidad todavía.
   - **Acerca y fuentes** — item con `§` en mono `text-faint`; activo cuando la vista es `about` (`bg-selected text-ink font-medium`).

   Item de navegación base:
   ```tsx
   className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 text-base
              text-muted2 hover:bg-hover hover:text-ink"
   ```
   El glifo va en `<span className="font-mono text-[13px] w-3 shrink-0">`.
3. **Historial** `flex-1 overflow-y-auto px-2.5 py-3.5` — etiqueta *Historial*; items truncados a una línea (`truncate`), item activo `bg-selected border-l-2 border-violet text-ink font-medium`, inactivo `border-l-2 border-transparent text-muted2`.
   Vacío: caja `border border-dashed border-lineDash p-3.5` — *Aquí se guardan tus consultas.* / *Cada una queda identificada por su tema.*
4. **Pie** `border-t border-line px-4 py-3 shrink-0` — nombre (`text-[13px] font-medium`) y correo (mono `text-mini text-faint`), ambos truncados; botón fantasma *Salir*.

#### Main

- **Topbar** `h-topbar shrink-0 border-b border-line flex items-center gap-3 px-5` — `☰` (solo móvil), título del hilo truncado (`text-base font-medium`), y a la derecha `NOM-001-SEDE-2018` en mono `text-mini text-faint tracking-[0.04em]`.
- **Área de scroll** `flex-1 overflow-y-auto`, con columna `max-w-thread mx-auto px-5`.
- **Compositor** `shrink-0 border-t border-line px-5 pt-3.5 pb-4`.

### 7.3 Estado vacío

Dentro de la columna del hilo, `pt-14 pb-10`:

- `¿Qué necesitas verificar?` — `text-3xl font-semibold tracking-tight`.
- Párrafo `text-md text-muted2 mt-2 max-w-[52ch] text-pretty`: *Pregunta en lenguaje natural. Cada respuesta viene con la referencia exacta al texto de la norma: capítulo, artículo y página.*
- Etiqueta *Consultas de ejemplo* (`mt-[34px] mb-2.5`).
- Lista con `border-t border-line`; cada fila es un botón `flex gap-3.5 items-baseline w-full text-left border-b border-line px-2 py-3.5 text-[14px] hover:bg-hoverAlt`, con número `01`–`05` en mono violeta.

Ejemplos exactos:
1. ¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?
2. Requisitos de puesta a tierra en instalación residencial
3. Distancia mínima entre tablero y muro
4. Protección requerida en circuitos de alumbrado comercial
5. Cálculo de factor de demanda para vivienda unifamiliar

### 7.4 Mensajes

Contenedor del hilo: `max-w-thread mx-auto px-5 pt-7 pb-10 flex flex-col gap-[34px]`.

#### Mensaje del usuario
Alineado a la derecha: `bg-surface border border-line px-3.5 py-[11px] text-md max-w-[86%] text-pretty`.

#### Respuesta — cuatro bloques en orden

**a) Resumen**
Etiqueta *Resumen* precedida de cuadro verde de 7px. Debajo:
```tsx
className="text-xl leading-[1.5] font-medium tracking-[-0.008em] border-l-2 border-ink pl-3.5 text-pretty"
```

**b) Explicación** — `mt-[26px]`, etiqueta con `pl-[15px]`, párrafos `pl-[15px] flex flex-col gap-3`, cada uno `text-md leading-[1.62] text-body text-pretty`.

**c) Citas** — `mt-7 pl-[15px]`. Cabecera: etiqueta *Citas de la norma* + conteo a la derecha (`3 referencias`) en mono `text-mini text-faint2`. Panel `border border-line bg-surface`; cada fila `border-b border-lineSoft` (última sin).

Fila colapsada = botón `flex w-full text-left gap-3 items-baseline px-3.5 py-3 hover:bg-[#F7F7F4]`:
- marca `[1]` en mono `text-mini text-violet`
- bloque central: referencia en mono `text-sm text-ink tracking-ref` (`Cap. 2 · Art. 210-19(a)(1)`), y debajo el título en `text-[13px] text-muted2 mt-[3px]`
- a la derecha, en mono `text-mini text-faint`: *Ver texto* / *Ocultar*

Expandida (**se abre en línea, nunca en modal o panel lateral** — el usuario no debe perder el hilo):
```tsx
<div className="px-3.5 pb-3.5 pl-10">
  <blockquote className="bg-muted border-l-2 border-violet px-3.5 py-[11px]
                         text-base leading-[1.6] text-body text-pretty">…</blockquote>
  <div className="font-mono text-mini text-faint mt-[7px]">p. 148 · NOM-001-SEDE-2018</div>
</div>
```

**d) Confianza** — `mt-3.5 border-t border-line pt-3`, en fila: etiqueta *Confianza*, tres barras, rótulo, nota.
```tsx
// barra: llena / vacía
"w-3.5 h-[7px] bg-ink border border-ink"
"w-3.5 h-[7px] bg-transparent border border-barEmpty"
```
Rótulo `text-[13px] font-semibold`; nota en mono `text-sm text-faint` (ej. `3 de 3 citas concuerdan`).

#### Información insuficiente
Bloque `border border-lineFirm bg-surface`. Cabecera `bg-hoverAlt border-b border-line px-4 py-[11px]` con cuadro de 7px `border-[1.5px] border-ink` y etiqueta *Información insuficiente*. Cuerpo `p-4`: frase principal `text-lg`, detalle `text-base text-muted2 mt-2.5`, luego etiqueta *Reformula así* y sugerencias como botones en lista con `border-b border-line`, `hover:text-green`.

**Regla de producto: cuando no hay respaldo suficiente, el sistema lo declara y propone reformulaciones concretas. Nunca completa el hueco con conocimiento general.**

#### Error de sistema
```tsx
className="border border-errBorder bg-errBg px-4 py-3.5 flex gap-3 items-start"
```
`!` en mono `text-errMark`; título `text-md font-medium text-errTitle` — *No se pudo procesar la consulta*; cuerpo `text-base text-errBody` — *Se perdió la conexión con el índice de la norma. Tu texto no se borró: vuelve a enviarlo.*; botón primario *Reintentar* que **reenvía la consulta original**, no un título recortado.

#### Generando
`flex items-center gap-2.5`: cuadro violeta de 8px con `.animate-nom-pulse`, y texto mono `text-sm text-muted2`. Dos fases: `Buscando en el texto de la norma…` (0–700ms) → `Redactando respuesta y verificando citas…` (700ms+).

### 7.5 Compositor

```tsx
<div className="flex border border-lineInput bg-surface items-stretch">
  <input className="flex-1 border-none outline-none px-3.5 py-3 text-md min-w-0"
         placeholder="Pregunta sobre la NOM-001-SEDE…" />
  <button className="px-[18px] text-[14px] font-medium">Consultar</button>
</div>
```
`Enter` envía. Debajo, la **capa permanente del aviso** (§7.8).

### 7.6 Franja de footer (siempre visible)

Fila de layout, no elemento flotante. Presente en **todas** las pantallas, pegada al borde inferior de la ventana, cruzando sidebar y contenido:

```tsx
<footer className="shrink-0 border-t border-line bg-muted px-5 py-[7px]
                   flex items-center justify-center gap-1.5 text-xs text-faint tracking-[0.01em]">
  <span>Made with</span>
  <span className="text-mini text-ink">🖤</span>
  <span>by</span>
  <a href="https://rs-studio.dev" className="text-muted2 font-medium no-underline hover:text-ink hover:underline">
    rs-studio.dev
  </a>
</footer>
```

🖤 es **el único emoji de todo el producto**. No introduzcas otros.

### 7.7 Banda de error de formulario

```tsx
className="border border-errBorder bg-errBg px-3.5 py-3 mb-5 flex gap-2.5 items-start"
```
`!` en mono `text-sm font-medium text-errMark`; título `text-base font-medium text-errTitle`; ayuda `text-[13px] text-errBody mt-0.5`.

### 7.8 Sistema de aviso en tres capas (ámbar)

Es un sistema deliberado; implementa las tres, no una.

| Capa | Dónde | Comportamiento |
|---|---|---|
| **Permanente** | Bajo el compositor | Siempre visible, no descartable |
| **Inicio de hilo** | Primer bloque del área de scroll | Colapsable, en el flujo (**nunca modal**) |
| **Completa** | Cierre de la página Acerca | Cuatro apartados |

Tratamiento compartido: `bg-noticeBg border border-noticeBorder border-l-[3px] border-l-noticeRule`.

**Permanente** (`mt-2.5 px-[11px] py-2 text-sm text-noticeText`): *Las respuestas pueden contener errores. Verifica siempre contra el texto oficial de la norma.* + link *Fuentes y alcance* (`text-noticeLink font-medium underline underline-offset-[3px]`).

**Inicio de hilo** (`px-[18px] py-4`, columna `max-w-thread mx-auto px-5 pt-[22px]`): cuadro ámbar de 8px + título *Antes de comenzar* + botón *Contraer* a la derecha. Tres párrafos `text-base text-body leading-[1.6]`:
- *Esta sesión consulta la NOM-001-SEDE-2018, vigente desde el 29 nov 2018.*
- *Las respuestas se construyen a partir del texto de la norma y siempre incluyen la cita correspondiente. Verifica cada cita contra el texto oficial antes de aplicarla.*
- *No sustituye el criterio de un profesional responsable ni constituye un dictamen técnico.*

Link final: *Fuentes y alcance completo*.

Colapsado: pastilla de una línea `px-3 py-2 hover:bg-noticeBgHov` con `NOM-001-SEDE-2018 · vigente desde 29 nov 2018` en mono y *Ver aviso* a la derecha. **Se colapsa automáticamente al enviar la primera consulta.**

**Vocabulario unificado: siempre el verbo "verificar".** No alternes con "consultar", "revisar" o "validar" en estos textos.

### 7.9 Página Acerca y fuentes

Mismo shell (sidebar + footer). Topbar propia: título *Acerca del proyecto y las fuentes* + botón fantasma *Volver a la consulta*. Columna `max-w-doc mx-auto px-5 pt-10 pb-24`.

1. **Intro** — `NOM Helper` en `text-4xl font-semibold tracking-tight`, dos párrafos `text-lg text-body leading-[1.62] max-w-[60ch]`.
2. **Normas incorporadas** (marcador verde) — panel `border border-line bg-surface`, una fila por norma (`p-[18px]`, separadas por `border-lineSoft`):
   - clave en mono `text-base font-medium`; a la derecha, marca de estado + rótulo en mono versalitas.
     Vigente: cuadro `bg-ink` + texto `text-ink font-medium`. Sustituida: cuadro `border-[1.5px] border-faint2` + texto `text-faint`, y la fila entera con `bg-subtle`.
   - nombre `text-[14px] text-body mt-[5px]`; nota opcional `text-[13px] text-muted2 mt-1.5`.
   - tres campos clave/valor en `flex flex-wrap gap-y-2 gap-x-7 mt-3.5`: **Versión**, **Publicación oficial**, **Incorporada al sistema**.

   Datos:

   | Clave | Nombre | Versión | Publicación | Incorporada | Estado |
   |---|---|---|---|---|---|
   | NOM-001-SEDE-2018 | Instalaciones eléctricas (utilización) | 2018 | 29 nov 2018 · DOF | 12 mar 2026 | Vigente |
   | NOM-001-SEDE-2012 | Instalaciones eléctricas (utilización) | 2012 | 27 nov 2012 · DOF | 12 mar 2026 | Sustituida |

   Nota de la 2012: *Se conserva como referencia histórica: sirve para consultar instalaciones proyectadas o verificadas bajo esa edición. No se cita en respuestas salvo que la consulta la pida de forma explícita.*
   Footnote bajo el panel, mono `text-mini text-faint2`: *2 documentos incorporados · última actualización del índice: 12 mar 2026*.

3. **Qué cubre y qué no** (marcador violeta) — `grid grid-cols-2 gap-px bg-line border border-line` (una columna bajo 860px), celdas `bg-surface p-[18px]`. Izquierda *Responde bien* con `+` verde; derecha *Queda fuera* con `–` gris. Cuatro items cada una.
4. **Cómo leer una respuesta** — cuatro filas `01`–`04`: Resumen, Explicación, Citas, Confianza; número mono violeta `w-[22px]`, nombre `w-[112px] font-semibold`, descripción.
5. **Niveles de confianza** — panel con tres filas (Alta / Media / Baja), cada una con sus barras.
6. **Aviso completo** (marcador ámbar) — bloque ámbar `p-[22px_24px] flex flex-col gap-4` con cuatro apartados: *Qué hace el sistema*, *Qué no hace*, *Errores posibles*, *Responsabilidad*.

Todos los textos exactos están en el prototipo (`ANSWERS`, `SOURCES`, `covers`, `notCovers`, `anatomy`, `confidenceLevels`, `disclaimer`).

---

## 8. Interacciones y comportamiento

- **Revelado escalonado de la respuesta.** No aparece completa de golpe: Resumen → +550ms Explicación → +550ms Citas + Confianza. Da la sensación de que el sistema arma la respuesta y hace que el resumen se lea primero. Implementar con un `reveal: 0|1|2|3` sobre el último mensaje.
- **Timings**: fase 1 de generación 0–700ms, respuesta a los 1600ms, luego los dos escalones. En producción esto se mapea al streaming real.
- **Citas expandibles en línea**, estado independiente por cita, clave `${messageIndex}-${citationIndex}`.
- **Historial**: al enviar una consulta se antepone su tema (derivado, truncado a 38 caracteres + `…`) y se marca activa; no se duplica si ya existe.
- **Enter** envía tanto en el compositor como en el formulario de acceso.
- **Botón Consultar deshabilitado** visualmente mientras el input esté vacío.
- **Responsive**: único breakpoint en 860px (sidebar → drawer con scrim). La columna de contenido ya está limitada a 720px, así que no requiere más puntos de corte.
- **Transiciones**: solo `transition-colors` en hover. Sin movimiento decorativo. La única animación es el pulso del indicador de generación.

---

## 9. Estado

```ts
type Screen = 'login' | 'register' | 'chat';
type View   = 'chat' | 'about';

type Citation = {
  mark: string;      // "[1]"
  ref: string;       // "Cap. 2 · Art. 210-19(a)(1)"
  title: string;
  quote: string;     // texto literal de la norma
  page: string;      // "p. 148 · NOM-001-SEDE-2018"
};

type Message =
  | { kind: 'user'; text: string }
  | { kind: 'answer'; summary: string; paragraphs: string[]; citations: Citation[];
      confidence: 1 | 2 | 3; confidenceLabel: 'Alta' | 'Media' | 'Baja'; confidenceNote: string }
  | { kind: 'insufficient'; summary: string; detail: string; suggestions: string[] }
  | { kind: 'error'; query: string };   // conserva la consulta para reintentar

type AppState = {
  screen: Screen;
  view: View;
  messages: Message[];
  history: string[];
  historyActive: number;      // -1 = ninguno
  threadTitle: string;        // "Nueva consulta" por defecto
  draft: string;
  generating: boolean;
  genStep: 0 | 1;
  reveal: 0 | 1 | 2 | 3;      // revelado escalonado del último mensaje
  openCites: Record<string, boolean>;
  noticeOpen: boolean;        // aviso de inicio de hilo
  sidebarOpen: boolean;
  formError: { title: string; help: string } | null;
};
```

**Sugerencia de arquitectura Next.js:** el shell (sidebar, topbar, footer) como Server Components en `app/(app)/layout.tsx`; el hilo y el compositor como Client Components. La consulta va por Route Handler con streaming; mapea los escalones de `reveal` a los eventos del stream real (resumen listo → explicación → citas verificadas).

---

## 10. Accesibilidad

- Contraste verificado; el texto más claro sobre fondo claro es `#8A8F95` sobre `#FBFBFA`, reservado a metadatos de 10–12px.
- La confianza y el estado de las normas se comunican con **texto + forma**, nunca solo con color.
- Los items de cita son `<button aria-expanded>` con la región expandida asociada por `aria-controls`.
- El drawer móvil necesita focus trap y cierre con `Escape`.
- La región del hilo debe ser `aria-live="polite"` para que el revelado escalonado se anuncie.
- Todos los targets táctiles ≥ 44px en móvil (subir el padding de los items de sidebar en el drawer).

---

## 11. Assets

Ninguno. No hay imágenes, iconos ni SVG. Los glifos (`+`, `×÷`, `§`, `!`, `☰`, `✕`) son caracteres tipográficos en IBM Plex Mono, y los marcadores son `<div>` cuadrados. **Si el codebase ya tiene una librería de iconos, no la introduzcas aquí sin revisar el efecto: la ausencia de iconografía es parte del registro visual.**

Único emoji: 🖤 en el footer.

---

## 12. Archivos

- `NOM Helper.dc.html` — prototipo completo, todos los estados (referencia de diseño).
- Estados navegables en el prototipo: Acceso, Registro, Chat vacío, Chat con respuesta, Error, Acerca.
- Credencial de la demo: cualquier correo + contraseña `nom2012`. Para ver el error de correo duplicado, registra `rmartinez@iepsa.mx`.
- Para forzar el estado de error desde el chat, envía una consulta que contenga la frase `simular error`.

---

## 13. Checklist de implementación

- [ ] Fuentes IBM Plex Sans/Mono vía `next/font`, peso máximo 600
- [ ] `rounded-none` en todo — sin radios heredados del reset o de la librería de UI
- [ ] Sin sombras en la UI de producción (salvo el scrim del drawer)
- [ ] Verde / violeta / ámbar usados solo en su rol asignado
- [ ] Confianza legible sin color
- [ ] Las tres capas del aviso implementadas
- [ ] Aviso de inicio de hilo en el flujo, no modal
- [ ] Citas expandibles en línea, sin perder el hilo
- [ ] Revelado escalonado conectado al streaming real
- [ ] Reintentar reenvía la consulta original
- [ ] Footer de rs-studio.dev visible en las tres pantallas, siempre en pantalla
