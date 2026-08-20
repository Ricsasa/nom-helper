# Handoff: NOM Helper — standards reference assistant

> Translated from `design_handoff_nom_helper/README.md` in the Claude Design project. It describes the prototype at handoff time. The current prototype adds functionality, documented in [02 — Current prototype state](02-prototype-current-state.md). All product copy stays in Spanish.

Implementation package for **React + Next.js (App Router) + Tailwind CSS**.
Design author: rs-studio.dev

---

## 1. Overview

NOM Helper is a reference assistant for **NOM-001-SEDE-2018** (electrical installations). The user asks in natural language and receives a structured answer where **every statement is traceable to a citation** with chapter, article, and page.

The product has three surfaces:

| Surface | Suggested route | What it does |
|---|---|---|
| Access / Registration | `/login`, `/registro` | Authentication with specific errors |
| Query (chat) | `/` | Query thread plus a sidebar with history |
| About and sources | `/acerca` | Loaded standards, scope, answer anatomy, legal notice |

The design thesis: **this is a technical reference tool, not a chatbot**. Therefore every shape is square (radius 0), the monospaced typeface carries the metadata (references, states, labels), and the sans typeface carries the prose. There are no gradients, no shadows except one, and no decorative color.

---

## 2. About the design files

`NOM Helper.dc.html` is a **design reference built in HTML** — a prototype that shows the intended appearance and behavior. **It is not production code to copy directly.**

The task is to **rebuild these designs in the target codebase** (Next.js and React) with its established patterns and libraries. The prototype uses inline styles for reasons unrelated to the final product. In Next.js, express everything as Tailwind classes on React components.

To open it: it is a self-contained HTML file and opens in any browser. The floating navigation bar (Acceso / Registro / Chat / Con respuesta / Error / Acerca) is **prototype scaffolding to jump between states**. Do not implement it.

---

## 3. Fidelity

**High fidelity.** Colors, typography, spacing, and states are final. Reproduce them precisely. Where the codebase already has equivalent primitives (Button, Input), use them and adjust them to these tokens. Do not create parallel components.

---

## 4. Stack and setup

### 4.1 Fonts — `next/font`

Two families, both from Google Fonts. Use **IBM Plex Sans** for prose and interface. Use **IBM Plex Mono** for metadata.

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

**Never use weight 700.** The maximum weight is 600, and only on titles and short labels. Emphasis in this interface comes from weight 500–600, color, and rules. It does not come from heavy bold text.

### 4.2 `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:    '#FBFBFA',  // app background
        surface:   '#FFFFFF',  // cards, panels, data rows
        muted:     '#F7F7F4',  // sidebar, footer strip, citation blockquote
        subtle:    '#FAFAF8',  // superseded standard row
        hover:     '#F1F1EE',  // sidebar hover
        hoverAlt:  '#F4F4F1',  // content row hover
        selected:  '#EAEAE5',  // active history item

        line:      '#E4E4E1',  // structural border (most used)
        lineSoft:  '#EDEDEA',  // inner separator inside a card
        lineInput: '#D8D8D4',  // input border
        lineDash:  '#DCDCD8',  // dashed empty-state border
        lineGhost: '#E0E0DC',  // ghost button border
        lineFirm:  '#D6D6D2',  // emphatic block border

        ink:       '#16181A',  // main text / primary button
        body:      '#2A2D30',  // long prose
        muted2:    '#55595E',  // secondary text, labels
        faint:     '#8A8F95',  // mono labels, metadata
        faint2:    '#A2A6AA',  // placeholder, footnotes
        faint3:    '#B6B9BC',  // inactive text on dark nav

        green:     '#2E7D5B',  // accent: action, confirmation, links
        greenDeep: '#1F5A41',  // link hover
        violet:    '#6B5BA6',  // accent: citations, references, system

        // Notice (amber) — three-layer system
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

        barEmpty:  '#C9C9C4',  // empty confidence bar
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // the real scale of the design — fractional values are intentional
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
        label: '0.09em',   // mono labels in small caps
        ref:   '0.01em',   // mono references
        tight: '-0.015em', // large titles
      },
      maxWidth: {
        thread: '720px',   // query thread column
        doc:    '760px',   // About page column
        auth:   '396px',   // access card
      },
      spacing: {
        sidebar: '274px',
        drawer:  '300px',
        topbar:  '53px',
      },
      boxShadow: {
        drawer: '0 0 0 100vw rgba(22,24,26,.28)', // mobile drawer scrim
      },
    },
  },
} satisfies Config;
```

### 4.3 Global rules

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

## 5. Design tokens — summary

### 5.1 Color: how it is used

Three accents. Each one has a fixed job. **Do not exchange them.**

| Accent | Hex | Meaning | Where it appears |
|---|---|---|---|
| Green | `#2E7D5B` | User action, links, confirmation | The `+` of a new query, links, primary button hover, the "Resumen" marker, section markers |
| Violet | `#6B5BA6` | Provenance: the system and its sources | Citation marks `[1]`, blockquote rule, example numbering, the generating dot, active history border |
| Amber | `#C9A227` | Persistent warning | The three disclaimer layers, and nothing else |

Black `#16181A` is the primary action color: filled button, summary rule, filled confidence bars. Earthy red is only for a system error.

**Confidence is never encoded by color.** It is encoded by label, weight 600, and three filled or empty square marks. A color-blind user must be able to read it.

### 5.2 Shape

- **Border radius: `rounded-none` on absolutely everything.** Buttons, inputs, cards, notices, drawer. This is the most important formal decision of the design. One accidental `rounded-md` breaks the register.
- Borders: `border` (1px) for structure; `border-l-2` (summary rule, active history); `border-l-[3px]` (amber notices).
- Markers: squares of `w-2 h-2` (8px) or `w-[7px] h-[7px]`, filled or with a `1.5px` border. Never circles.
- Shadows: only the mobile drawer scrim and the prototype scaffolding bar. **The production interface carries no shadows.**

### 5.3 Spacing

A 2/4px rhythm. Recurring values: `p-2 p-2.5 p-3 p-3.5 p-4 p-[18px] p-5 p-6`; gaps `gap-1 gap-1.5 gap-2 gap-2.5 gap-3 gap-3.5 gap-4`; separation between section blocks `mt-11` or `mt-12` (44/48px).

**Always use `flex` or `grid` plus `gap`.** Never use individual margins to separate siblings.

---

## 6. Primitives

Exact classes, ready to copy.

### Primary button

```tsx
className="bg-ink text-white px-3.5 py-[11px] text-md font-medium tracking-[0.01em]
           cursor-pointer transition-colors hover:bg-green disabled:cursor-default"
```

Composer variant (disabled by an empty input): use `bg-line text-faint2 cursor-default` when there is no text, and `bg-ink text-white cursor-pointer` when there is.

### Ghost button

```tsx
className="border border-lineGhost bg-transparent px-2.5 py-[5px] text-sm text-muted2
           hover:border-[#B9BCB8] hover:text-ink"
```

### Input

```tsx
className="w-full border border-lineInput bg-surface px-[11px] py-[9px] text-[14px]
           text-ink outline-none focus:border-green"
```

Associated label: `text-sm font-medium text-muted2 tracking-[0.01em]`, inside `flex flex-col gap-1.5`.

### Section label (mono, small caps)

```tsx
className="font-mono text-micro tracking-label uppercase text-faint"
```

A marker almost always precedes it: `<span className="w-[7px] h-[7px] bg-green shrink-0 -translate-y-px" />`.

### Card / panel

```tsx
className="border border-line bg-surface"
```

Separate inner rows with `border-b border-lineSoft`. The last row carries no border.

### Key/value data row

```tsx
<div>
  <div className="font-mono text-[10px] tracking-label uppercase text-faint2">Versión</div>
  <div className="font-mono text-sm text-ink mt-[3px]">2018</div>
</div>
```

---

## 7. Screens

### 7.1 Access / Registration

**Layout:** a full-height column, `h-screen flex flex-col overflow-hidden`. Inside it, an area `flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-5 py-10 gap-6`, and pinned to the bottom, the **footer strip** (§7.6). The footer must stay in view. The inner area scrolls, the page does not.

**Content, in order:**

1. **Brand** — two 10px squares side by side (`gap-2`), green and violet; below them `NOM Helper` in `text-2xl font-semibold tracking-[-0.01em]`; below that, in mono `text-xs uppercase tracking-[0.04em] text-faint`: `NOM-001-SEDE · Instalaciones eléctricas`.
2. **Card** — `w-full max-w-auth border border-line bg-surface p-8`.
   - Title `text-[16px] font-semibold`: *Iniciar sesión* / *Crear cuenta*.
   - Subtitle `text-base text-muted2 mb-6`: *Consulta técnica sobre la NOM-001-SEDE.* / *Acceso a la consulta técnica de la NOM-001-SEDE.*
   - Error band, if it applies (§7.7).
   - Fields `flex flex-col gap-4`: **Nombre** (registration only, placeholder `Ing. Ramiro Martínez`), **Correo** (`nombre@empresa.mx`), **Contraseña** (`••••••••`).
   - On sign in, the password label row carries *Recuperar acceso* on the right (`text-sm font-normal text-muted2 underline underline-offset-2`).
   - On registration, below the field: `Mínimo 8 caracteres, 1 número` in mono `text-xs text-faint`.
   - Full-width primary button: *Entrar* / *Crear cuenta*.
3. **Mode switch** — `text-base text-muted2`: *¿No tienes cuenta?* plus the link *Crea una*, and the reverse: *¿Ya tienes cuenta?* / *Inicia sesión*.

**Validation. The messages are exact and every one is actionable:**

| Condition | Title | Help |
|---|---|---|
| Sign in with no email or no password | Faltan credenciales | Escribe tu correo y contraseña para entrar. |
| Sign in with a wrong password | Correo o contraseña incorrectos | Revisa la contraseña; si no la recuerdas, usa Recuperar acceso. |
| Registration, email already exists | Ese correo ya tiene cuenta | Inicia sesión con él o usa otro correo para registrarte. |
| Registration, weak password | La contraseña no cumple los requisitos | Necesita al menos 8 caracteres e incluir un número. |
| Registration, empty fields | Faltan datos para crear la cuenta | Completa nombre y correo antes de continuar. |

Password rule: `length >= 8 && /[0-9]/.test(pass)`.
`Enter` in the password field submits the form.

### 7.2 Query shell

```
h-screen flex flex-col overflow-hidden
├── flex flex-1 min-h-0 overflow-hidden
│   ├── <Sidebar>   w-sidebar shrink-0        (fixed drawer on mobile)
│   └── <Main>      flex-1 flex flex-col min-w-0
└── <FooterStrip>   shrink-0
```

**Breakpoint: 860px.** Below it, the sidebar leaves the flow: `fixed inset-y-0 left-0 w-drawer z-40 shadow-drawer`, with a `✕` button in its header and a `☰` button in the main topbar. It closes when the user picks any item.

#### Sidebar (`bg-muted border-r border-line flex flex-col h-full overflow-hidden`)

1. **Header** `px-4 pt-[18px] pb-3.5 border-b border-line` — two 8px squares (`gap-[3px]`) plus `NOM Helper` in `text-[14.5px] font-semibold`.
2. **Navigation** `px-2.5 py-3 border-b border-line flex flex-col gap-0.5 shrink-0`:
   - **Nueva consulta** — an item with a green `+` in mono, `font-medium text-ink`.
   - **Calculadoras** — a *section label*, not a button: `flex items-center gap-2.5 px-2.5 pt-3.5 pb-1.5`, with a violet `×÷` in mono and the text in `font-mono text-micro tracking-label uppercase text-faint2`. Below it, three indented entries (`pl-8 py-[7px] text-base text-muted2`): *Calculadora 1/2/3*. They are placeholders with no functionality yet.
   - **Acerca y fuentes** — an item with `§` in mono `text-faint`. It is active when the view is `about` (`bg-selected text-ink font-medium`).

   Base navigation item:

   ```tsx
   className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 text-base
              text-muted2 hover:bg-hover hover:text-ink"
   ```

   The glyph goes in `<span className="font-mono text-[13px] w-3 shrink-0">`.
3. **History** `flex-1 overflow-y-auto px-2.5 py-3.5` — the *Historial* label; items truncate to one line (`truncate`); the active item is `bg-selected border-l-2 border-violet text-ink font-medium`, and an inactive item is `border-l-2 border-transparent text-muted2`.
   Empty: a box `border border-dashed border-lineDash p-3.5` — *Aquí se guardan tus consultas.* / *Cada una queda identificada por su tema.*
4. **Footer** `border-t border-line px-4 py-3 shrink-0` — name (`text-[13px] font-medium`) and email (mono `text-mini text-faint`), both truncated, plus the ghost button *Salir*.

#### Main

- **Topbar** `h-topbar shrink-0 border-b border-line flex items-center gap-3 px-5` — `☰` (mobile only), the truncated thread title (`text-base font-medium`), and on the right `NOM-001-SEDE-2018` in mono `text-mini text-faint tracking-[0.04em]`.
- **Scroll area** `flex-1 overflow-y-auto`, with the column `max-w-thread mx-auto px-5`.
- **Composer** `shrink-0 border-t border-line px-5 pt-3.5 pb-4`.

### 7.3 Empty state

Inside the thread column, `pt-14 pb-10`:

- `¿Qué necesitas verificar?` — `text-3xl font-semibold tracking-tight`.
- Paragraph `text-md text-muted2 mt-2 max-w-[52ch] text-pretty`: *Pregunta en lenguaje natural. Cada respuesta viene con la referencia exacta al texto de la norma: capítulo, artículo y página.*
- The label *Consultas de ejemplo* (`mt-[34px] mb-2.5`).
- A list with `border-t border-line`. Each row is a button `flex gap-3.5 items-baseline w-full text-left border-b border-line px-2 py-3.5 text-[14px] hover:bg-hoverAlt`, with the number `01`–`05` in violet mono.

Exact examples:

1. ¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?
2. Requisitos de puesta a tierra en instalación residencial
3. Distancia mínima entre tablero y muro
4. Protección requerida en circuitos de alumbrado comercial
5. Cálculo de factor de demanda para vivienda unifamiliar

### 7.4 Messages

Thread container: `max-w-thread mx-auto px-5 pt-7 pb-10 flex flex-col gap-[34px]`.

#### User message

Aligned right: `bg-surface border border-line px-3.5 py-[11px] text-md max-w-[86%] text-pretty`.

#### Answer — four blocks, in order

**a) Summary**
The label *Resumen*, preceded by a 7px green square. Below it:

```tsx
className="text-xl leading-[1.5] font-medium tracking-[-0.008em] border-l-2 border-ink pl-3.5 text-pretty"
```

**b) Explanation** — `mt-[26px]`, the label with `pl-[15px]`, paragraphs in `pl-[15px] flex flex-col gap-3`, each one `text-md leading-[1.62] text-body text-pretty`.

**c) Citations** — `mt-7 pl-[15px]`. Header: the label *Citas de la norma* plus a count on the right (`3 referencias`) in mono `text-mini text-faint2`. Panel `border border-line bg-surface`; each row `border-b border-lineSoft`, the last one without.

A collapsed row is a button `flex w-full text-left gap-3 items-baseline px-3.5 py-3 hover:bg-[#F7F7F4]`:

- the mark `[1]` in mono `text-mini text-violet`
- a center block: the reference in mono `text-sm text-ink tracking-ref` (`Cap. 2 · Art. 210-19(a)(1)`), and below it the title in `text-[13px] text-muted2 mt-[3px]`
- on the right, in mono `text-mini text-faint`: *Ver texto* / *Ocultar*

Expanded. **It opens inline, never in a modal or a side panel.** The user must not lose the thread.

```tsx
<div className="px-3.5 pb-3.5 pl-10">
  <blockquote className="bg-muted border-l-2 border-violet px-3.5 py-[11px]
                         text-base leading-[1.6] text-body text-pretty">…</blockquote>
  <div className="font-mono text-mini text-faint mt-[7px]">p. 148 · NOM-001-SEDE-2018</div>
</div>
```

**d) Confidence** — `mt-3.5 border-t border-line pt-3`, in one row: the label *Confianza*, three bars, the rating, and a note.

```tsx
// bar: filled / empty
"w-3.5 h-[7px] bg-ink border border-ink"
"w-3.5 h-[7px] bg-transparent border border-barEmpty"
```

Rating `text-[13px] font-semibold`; note in mono `text-sm text-faint`, for example `3 de 3 citas concuerdan`.

#### Insufficient information

Block `border border-lineFirm bg-surface`. Header `bg-hoverAlt border-b border-line px-4 py-[11px]` with a 7px square `border-[1.5px] border-ink` and the label *Información insuficiente*. Body `p-4`: the main sentence `text-lg`, the detail `text-base text-muted2 mt-2.5`, then the label *Reformula así* and the suggestions as buttons in a list with `border-b border-line` and `hover:text-green`.

**Product rule: when support is insufficient, the system declares it and proposes concrete rewordings. It never fills the gap with general knowledge.**

#### System error

```tsx
className="border border-errBorder bg-errBg px-4 py-3.5 flex gap-3 items-start"
```

`!` in mono `text-errMark`; title `text-md font-medium text-errTitle` — *No se pudo procesar la consulta*; body `text-base text-errBody` — *Se perdió la conexión con el índice de la norma. Tu texto no se borró: vuelve a enviarlo.*; primary button *Reintentar*, which **resends the original query**, not a truncated title.

#### Generating

`flex items-center gap-2.5`: an 8px violet square with `.animate-nom-pulse`, and mono text `text-sm text-muted2`. Two phases: `Buscando en el texto de la norma…` (0–700ms), then `Redactando respuesta y verificando citas…` (700ms and later).

### 7.5 Composer

```tsx
<div className="flex border border-lineInput bg-surface items-stretch">
  <input className="flex-1 border-none outline-none px-3.5 py-3 text-md min-w-0"
         placeholder="Pregunta sobre la NOM-001-SEDE…" />
  <button className="px-[18px] text-[14px] font-medium">Consultar</button>
</div>
```

`Enter` submits. Below it sits the **permanent notice layer** (§7.8).

### 7.6 Footer strip (always visible)

A layout row, not a floating element. It appears on **every** screen, pinned to the bottom edge of the window, crossing the sidebar and the content:

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

🖤 is **the only emoji in the whole product**. Do not introduce others.

### 7.7 Form error band

```tsx
className="border border-errBorder bg-errBg px-3.5 py-3 mb-5 flex gap-2.5 items-start"
```

`!` in mono `text-sm font-medium text-errMark`; title `text-base font-medium text-errTitle`; help `text-[13px] text-errBody mt-0.5`.

### 7.8 Three-layer notice system (amber)

This is a deliberate system. Implement all three layers, not one.

| Layer | Where | Behavior |
|---|---|---|
| **Permanent** | Below the composer | Always visible, not dismissible |
| **Thread start** | First block of the scroll area | Collapsible, in the flow (**never a modal**) |
| **Complete** | Closing block of the About page | Four sections |

Shared treatment: `bg-noticeBg border border-noticeBorder border-l-[3px] border-l-noticeRule`.

**Permanent** (`mt-2.5 px-[11px] py-2 text-sm text-noticeText`): *Las respuestas pueden contener errores. Verifica siempre contra el texto oficial de la norma.* plus the link *Fuentes y alcance* (`text-noticeLink font-medium underline underline-offset-[3px]`).

**Thread start** (`px-[18px] py-4`, column `max-w-thread mx-auto px-5 pt-[22px]`): an 8px amber square, the title *Antes de comenzar*, and a *Contraer* button on the right. Three paragraphs `text-base text-body leading-[1.6]`:

- *Esta sesión consulta la NOM-001-SEDE-2018, vigente desde el 29 nov 2018.*
- *Las respuestas se construyen a partir del texto de la norma y siempre incluyen la cita correspondiente. Verifica cada cita contra el texto oficial antes de aplicarla.*
- *No sustituye el criterio de un profesional responsable ni constituye un dictamen técnico.*

Closing link: *Fuentes y alcance completo*.

Collapsed: a one-line pill `px-3 py-2 hover:bg-noticeBgHov` with `NOM-001-SEDE-2018 · vigente desde 29 nov 2018` in mono and *Ver aviso* on the right. **It collapses automatically when the user sends the first query.**

**Unified vocabulary: always the verb "verificar".** Do not alternate with "consultar", "revisar", or "validar" in these texts.

### 7.9 About and sources page

The same shell (sidebar and footer). It has its own topbar: the title *Acerca del proyecto y las fuentes* plus the ghost button *Volver a la consulta*. Column `max-w-doc mx-auto px-5 pt-10 pb-24`.

1. **Intro** — `NOM Helper` in `text-4xl font-semibold tracking-tight`, then two paragraphs `text-lg text-body leading-[1.62] max-w-[60ch]`.
2. **Loaded standards** (green marker) — panel `border border-line bg-surface`, one row per standard (`p-[18px]`, separated by `border-lineSoft`):
   - the code in mono `text-base font-medium`; on the right, a status mark plus a label in mono small caps.
     Current: a `bg-ink` square plus `text-ink font-medium` text. Superseded: a square `border-[1.5px] border-faint2` plus `text-faint` text, and the whole row on `bg-subtle`.
   - name `text-[14px] text-body mt-[5px]`; optional note `text-[13px] text-muted2 mt-1.5`.
   - three key/value fields in `flex flex-wrap gap-y-2 gap-x-7 mt-3.5`: **Versión**, **Publicación oficial**, **Incorporada al sistema**.

   Data:

   | Code | Name | Version | Publication | Loaded | Status |
   |---|---|---|---|---|---|
   | NOM-001-SEDE-2018 | Instalaciones eléctricas (utilización) | 2018 | 29 nov 2018 · DOF | 12 mar 2026 | Vigente |
   | NOM-001-SEDE-2012 | Instalaciones eléctricas (utilización) | 2012 | 27 nov 2012 · DOF | 12 mar 2026 | Sustituida |

   Note on the 2012 edition: *Se conserva como referencia histórica: sirve para consultar instalaciones proyectadas o verificadas bajo esa edición. No se cita en respuestas salvo que la consulta la pida de forma explícita.*
   Footnote below the panel, mono `text-mini text-faint2`: *2 documentos incorporados · última actualización del índice: 12 mar 2026*.

3. **What it covers and what it does not** (violet marker) — `grid grid-cols-2 gap-px bg-line border border-line`, one column below 860px, cells `bg-surface p-[18px]`. On the left, *Responde bien* with a green `+`. On the right, *Queda fuera* with a gray `–`. Four items each.
4. **How to read an answer** — four rows, `01`–`04`: Resumen, Explicación, Citas, Confianza. The number is violet mono `w-[22px]`, the name is `w-[112px] font-semibold`, then the description.
5. **Confidence levels** — a panel with three rows (Alta / Media / Baja), each one with its bars.
6. **Complete notice** (amber marker) — an amber block `p-[22px_24px] flex flex-col gap-4` with four sections: *Qué hace el sistema*, *Qué no hace*, *Errores posibles*, *Responsabilidad*.

All exact copy lives in [03 — Content and data](03-content-and-data.md).

---

## 8. Interactions and behavior

- **Staged reveal of the answer.** The answer does not appear at once: Summary, then Explanation after 550ms, then Citations and Confidence after another 550ms. It gives the sense that the system assembles the answer, and it makes the user read the summary first. Implement it with a `reveal: 0|1|2|3` value on the last message.
- **Timings**: generation phase 1 runs 0–700ms, the answer arrives at 1600ms, then the two stages follow. In production, map this to real streaming.
- **Inline expandable citations.** State is independent per citation, with the key `${messageIndex}-${citationIndex}`.
- **History**: when the user sends a query, prepend its topic (derived, truncated to 38 characters plus `…`) and mark it active. Do not duplicate an entry that already exists.
- **Enter** submits both in the composer and in the access form.
- **The Consultar button is visually disabled** while the input is empty.
- **Responsive**: one breakpoint at 860px (sidebar becomes a drawer with a scrim). The content column is already capped at 720px, so it needs no further breakpoints.
- **Transitions**: only `transition-colors` on hover. No decorative motion. The only animation is the pulse of the generating indicator.

---

## 9. State

```ts
type Screen = 'login' | 'register' | 'chat';
type View   = 'chat' | 'about';

type Citation = {
  mark: string;      // "[1]"
  ref: string;       // "Cap. 2 · Art. 210-19(a)(1)"
  title: string;
  quote: string;     // literal text of the standard
  page: string;      // "p. 148 · NOM-001-SEDE-2018"
};

type Message =
  | { kind: 'user'; text: string }
  | { kind: 'answer'; summary: string; paragraphs: string[]; citations: Citation[];
      confidence: 1 | 2 | 3; confidenceLabel: 'Alta' | 'Media' | 'Baja'; confidenceNote: string }
  | { kind: 'insufficient'; summary: string; detail: string; suggestions: string[] }
  | { kind: 'error'; query: string };   // keeps the query so retry can resend it

type AppState = {
  screen: Screen;
  view: View;
  messages: Message[];
  history: string[];
  historyActive: number;      // -1 = none
  threadTitle: string;        // "Nueva consulta" by default
  draft: string;
  generating: boolean;
  genStep: 0 | 1;
  reveal: 0 | 1 | 2 | 3;      // staged reveal of the last message
  openCites: Record<string, boolean>;
  noticeOpen: boolean;        // thread-start notice
  sidebarOpen: boolean;
  formError: { title: string; help: string } | null;
};
```

**Suggested Next.js architecture:** build the shell (sidebar, topbar, footer) as Server Components in `app/(app)/layout.tsx`. Build the thread and the composer as Client Components. Send the query through a Route Handler with streaming, and map the `reveal` stages to the events of the real stream: summary ready, explanation, verified citations.

---

## 10. Accessibility

- Contrast is verified. The lightest text on a light background is `#8A8F95` on `#FBFBFA`, reserved for 10–12px metadata.
- Confidence and standard status are communicated with **text plus shape**, never with color alone.
- Citation items are `<button aria-expanded>` elements, with the expanded region associated through `aria-controls`.
- The mobile drawer needs a focus trap and closes with `Escape`.
- The thread region must be `aria-live="polite"`, so the staged reveal is announced.
- All touch targets are 44px or larger on mobile. Increase the padding of the sidebar items in the drawer.

---

## 11. Assets

None. There are no images, icons, or SVG files. The glyphs (`+`, `×÷`, `§`, `!`, `☰`, `✕`) are typographic characters in IBM Plex Mono, and the markers are square `<div>` elements. **If the codebase already has an icon library, do not introduce it here without checking the effect: the absence of iconography is part of the visual register.**

The only emoji is 🖤, in the footer.

---

## 12. Prototype files

- `NOM Helper.dc.html` — the complete prototype with every state (design reference).
- States you can navigate in the prototype: Acceso, Registro, empty chat, chat with an answer, Error, Acerca.
- Demo credentials: any email plus the password `nom2012`. To see the duplicate email error, register `rmartinez@iepsa.mx`.
- To force the error state from the chat, send a query that contains the phrase `simular error`.

---

## 13. Implementation checklist

- [ ] IBM Plex Sans and Mono through `next/font`, maximum weight 600
- [ ] `rounded-none` everywhere — no radius inherited from the reset or the UI library
- [ ] No shadows in the production interface, except the drawer scrim
- [ ] Green, violet, and amber used only in their assigned role
- [ ] Confidence readable without color
- [ ] All three notice layers implemented
- [ ] Thread-start notice in the flow, not a modal
- [ ] Citations expand inline, without losing the thread
- [ ] Staged reveal connected to real streaming
- [ ] Retry resends the original query
- [ ] The rs-studio.dev footer visible on all three screens, always on screen
