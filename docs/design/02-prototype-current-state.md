# Current prototype state — delta over the handoff

The prototype `NOM Helper.dc.html` grew after the handoff. This document covers what [document 01](01-implementation-handoff.md) does not describe. The tokens, the shape rules, and the typographic rules of the handoff still apply without change. Product copy stays in Spanish.

Delta summary:

| Block | In the handoff | In the current prototype |
|---|---|---|
| Daily query quota | Does not exist | 10 queries per day, with a meter in the sidebar |
| Per-answer feedback | Does not exist | Thumbs up and down, plus a failure reason |
| Account settings | Out of scope | A complete modal with data, usage, and deletion |
| Operations panel | Does not exist | Review queue and usage, for the operator role |
| User role | User only | `user` and `ops` |

The original brief declares account settings out of scope. The prototype includes it. The prototype version wins.

---

## 1. Daily quota

Constant: `QUOTA_TOTAL = 10`.

### Sidebar meter

Its own block, between the history and the account footer: `border-t border-line px-4 pt-[11px] pb-3 shrink-0`.

- Ten 8×8px marks with `gap-[2px]`. A spent mark is `border border-lineDash`. An available mark uses the fill `#55595E`, or `#B6B9BC` when 8 or more remain.
- Text below the marks, `mt-2`:

  | Quota | Text | Style |
  |---|---|---|
  | 0 | `Sin consultas disponibles hoy` | `text-sm text-ink font-semibold` |
  | 1 | `1 consulta disponible hoy` | `text-sm text-body font-medium` |
  | 2–7 | `N consultas disponibles hoy` | `text-sm text-body font-medium` |
  | 8–10 | `N consultas disponibles hoy` | `text-sm text-muted2 font-normal` |

- The `title` attribute of the block: `Se resetean mañana a las 00:00 CDMX` when the quota is 0; `Te quedan pocas consultas hoy.` when it is 7 or less; empty otherwise.

### Composer with no quota left

Above the input field, `mb-2.5`:

```tsx
className="border border-lineDash bg-hover px-3 py-[9px] text-[13px] text-ink text-pretty"
```

Text: *Límite diario alcanzado. Tus 10 consultas se resetean mañana a las 00:00 CDMX.*

### Rules

- Every sent query subtracts 1.
- At quota 0, `ask()` does nothing. The *Consultar* button stays disabled, the same as with an empty input (`bg-line text-faint2 cursor-default`).
- The counter resets at 00:00, Mexico City time.

---

## 2. Per-answer feedback

It appears below `answer` messages, only when `reveal >= 3`, and below *Información insuficiente* blocks.

### Rating row

`mt-[22px] pl-[15px]`, with `border-t border-lineSoft pt-[11px] flex items-center flex-wrap gap-2`.

Two pills, *Sirvió* and *No sirvió*:

```tsx
// active
"flex items-center gap-2 bg-hover border border-ink px-[11px] py-[5px]
 font-mono text-mini tracking-[0.04em] text-ink cursor-pointer"
// inactive
"flex items-center gap-2 bg-transparent border border-line px-[11px] py-[5px]
 font-mono text-mini tracking-[0.04em] text-faint cursor-pointer"
```

The 7px mark inside the pill is filled green for *Sirvió* and filled `ink` for *No sirvió* when active. It is `border-[1.5px] border-faint3` when inactive.

After the user rates, the status appears on the right in mono `text-mini text-faint`:

- *Registrado* — for a positive rating, or a negative rating with no reason sent.
- *Registrado · {short reason}* — once the reason is sent.

Next to the status sits an underlined mono link: *Indicar qué falló* for a negative rating with no reason sent, or *Quitar* in every other case. *Quitar* clears the rating and the reason.

### "Qué falló" panel

It opens when the user marks *No sirvió*, but only the first time. After that, the user reopens it with *Indicar qué falló*. Panel `border border-line bg-surface mt-2.5`:

- Header `px-3.5 py-[11px] border-b border-lineSoft`: the label *Qué falló* on the left and *Opcional* in mono `text-mini text-faint2` on the right.
- Six reasons as single-select buttons, `px-3.5 py-2.5 text-base`, separated by `border-b border-lineSoft`, the last one without. The 7px mark is filled `ink` when selected and `border-[1.5px] border-barEmpty` when not. The selected reason uses `text-ink font-medium`.
- Selecting *Otro* reveals an input at `pl-9 pr-3.5 pb-3.5` with the placeholder *En una línea, qué falló*.
- Footer `px-3.5 py-3 border-t border-lineSoft bg-subtle flex items-center gap-3`: the *Enviar* button (primary, disabled until a reason exists, and with *Otro* until the free text is not empty) and the *Omitir* link.

The reason list is in [03 — Content and data](03-content-and-data.md#7-feedback-reasons).

---

## 3. Account settings

It opens when the user clicks the account name in the sidebar footer. It is the **only modal in the product**. The rule that notices are never modal still holds.

- Scrim: `fixed inset-0 bg-[rgba(22,24,26,.4)] z-[80] flex items-center justify-center p-6`. A click on the scrim closes the modal.
- Panel: `w-full max-w-[520px] max-h-[min(88vh,720px)] bg-canvas border border-line flex flex-col overflow-hidden`.
- Header `border-b border-line p-4 px-5`: the title *Configuración de la cuenta* (`text-lg font-semibold`) and a `✕` button.
- Body `flex-1 overflow-y-auto p-5`, with three sections labeled in mono small caps: **Cuenta**, **Uso**, **Datos**.

### Cuenta

| Field | Action | Behavior |
|---|---|---|
| Nombre | *Guardar* button | Saves when the value is not empty. |
| Correo electrónico | *Confirmar* button | Rejects `lfuentes@iepsa.mx` with the error *Ese correo ya está en uso por otra cuenta.* |
| Contraseña | *Cambiar contraseña* link | Opens a block `border border-line bg-surface p-3.5` with three fields. |

After a save, the tag *Guardado* appears next to the label in `text-xs text-muted2` and disappears after 2200ms.

Password block: the fields *Contraseña actual*, *Contraseña nueva*, and *Confirmar contraseña nueva*, plus the buttons *Guardar contraseña* and *Cancelar*. Errors, in check order:

1. *La contraseña actual no es correcta.* — the prototype expects `nom2012`.
2. *La contraseña nueva necesita al menos 8 caracteres e incluir un número.*
3. *Las contraseñas nuevas no coinciden.*

### Uso

Two lines:

- `{10 − quota} de 10 consultas usadas hoy` — `text-[14px] text-ink`.
- *El contador se reinicia a las 00:00, hora de Ciudad de México.* — `text-sm text-faint`.

### Datos

Panel `border border-lineFirm` with two rows separated by `border-b border-line`. Each row has three states.

**Eliminar historial de consultas** — subtitle *Borra tus conversaciones. La cuenta se conserva.*, ghost button *Eliminar historial*.

- Confirmation: *Se eliminarán todas tus conversaciones y sus citas guardadas. Tu cuenta y tu acceso no se ven afectados.* plus *Confirmar eliminación* and *Cancelar*.
- Done: *Historial eliminado.*

**Eliminar cuenta** — subtitle *Borra tu cuenta, tu historial y tu acceso de forma permanente.*, ghost button *Eliminar cuenta*.

- Confirmation: *Esto borra tu cuenta, todas tus conversaciones y tu acceso. No se puede deshacer.* plus *Escribe **ELIMINAR** para confirmar.* and a 160px input.
- The *Eliminar cuenta permanentemente* button enables only on the exact text `ELIMINAR`. On confirmation, the session returns to the access screen and clears messages and history.

Save error band, when it applies: `border border-errBorder bg-errBg px-3 py-2.5 mt-4 text-[13px] text-errTitle`.

---

## 4. Operator role and Operations panel

### Access

Sign in decides the role. An email that starts with `ops@` (`/^ops@/i`) enters as `ops`. Any other email enters as `user`.

With the `ops` role, the sidebar navigation adds an **Operación** item with the glyph `◫` in mono and, on the right, a pending counter in mono `text-[10px] bg-line px-[5px]`. The counter hides when nothing is pending.

### Panel shell

Its own screen, with no sidebar: `h-screen flex flex-col overflow-hidden bg-canvas`.

- Topbar `h-12 shrink-0 border-b border-line bg-muted flex items-center gap-[18px] px-[18px]`: the brand (two 8px squares plus *NOM Helper*), a separator `border-l border-lineDash pl-[9px]`, and the label *Operación* in mono small caps.
- Tabs: *Revisión* (with the pending counter) and *Consumo*. Active: `bg-ink text-white`. Inactive: `text-muted2` with no fill.
- On the right, the ghost button *Volver a la consulta*.
- Content `flex-1 min-h-0 overflow-y-auto`, columns `max-w-[1180px] mx-auto px-[18px]`.
- The same footer strip as the rest of the product.

### Review queue

Title *Cola de revisión* (`text-xl font-semibold`) plus a count in mono: `N pendientes · M en total`. Subtitle: *Respuestas calificadas negativamente, de la más antigua a la más reciente.*

Filters in a row, separated from the content by `border-b border-line`:

- **Estado**: Pendientes · Revisadas · Descartadas · Todas.
- **Motivo**: Todos plus the six feedback reasons in their short form.

Filter chip:

```tsx
// active / inactive
"bg-ink text-white border border-ink px-2.5 py-1 font-mono text-mini tracking-[0.03em]"
"bg-surface text-muted2 border border-lineGhost px-2.5 py-1 font-mono text-mini tracking-[0.03em]"
```

The table sits in `overflow-x-auto`, panel `border border-line bg-surface min-w-[760px]`, grid `78px minmax(220px,1fr) 200px 78px 116px`. Header `bg-muted border-b border-line px-3.5 py-2`, cells in mono `text-[10px] tracking-label uppercase text-faint2`: **ID · Consulta · Motivo · Cuándo · Estado**. Every row is a button that opens the detail view.

Status mark, 7px:

| Status | Mark | Text |
|---|---|---|
| Pendiente | filled, amber `#C9A227` | `text-ink font-medium` |
| Revisada | filled, green `#2E7D5B` | `text-muted2` |
| Descartada | `border-[1.5px] border-faint3` | `text-faint` |

Empty state, a box `border border-dashed border-lineDash p-[22px]`:

- Default filter (Pendientes plus Todos): *Sin elementos pendientes.* / *Las respuestas calificadas negativamente entran aquí. Es el estado normal la mayor parte del tiempo.*
- Any other filter: *Ningún elemento con estos filtros.* / *Cambia el estado o el motivo para ver otros elementos.*

### Item detail

A back link `← Cola de revisión` in mono. Below it, chained blocks with no separation, each one carrying `border-top:none`:

1. **Header** — the ID in violet, the age in mono `text-faint`, and the mark plus status on the right. Body: the label *Consulta* and the text in `text-[16px] font-medium border-l-2 border-ink pl-3`.
2. **Two-column grid**, one column below 860px:
   - *Respuesta del sistema* — the summary and, at the top right, three 12×6px confidence bars plus the rating.
   - *Citas recuperadas* — the count on the right and the list of marks, references, and titles. There is no literal text here: citations do not expand in this view.
3. **Reporte del usuario** — *Motivo marcado* and *Identidad*, with a *Revelar identidad* / *Ocultar identidad* button. An optional *Comentario* in a blockquote `bg-muted border-l-2 border-violet`.
4. **Two-column grid**:
   - *Causa* — five single-select causes (see [03](03-content-and-data.md#8-classification-causes-operations)).
   - *Destino* — three buttons in a column: *Agregar al conjunto de evaluación* (primary, enabled only once a cause is selected), *Marcar como revisada*, and *Descartar* (secondary). Below them, a note in mono `text-mini text-faint2`:

     | Situation | Note |
     |---|---|
     | Already in the evaluation set | En el conjunto de evaluación. Sigue consultable desde la cola. |
     | Cause selected, not sent | Clasifica la causa antes de agregarla al conjunto de evaluación. |
     | No cause | Selecciona una causa para habilitar el envío al conjunto de evaluación. |

*Agregar al conjunto de evaluación* and *Marcar como revisada* both leave the item in the `revisada` state. *Descartar* leaves it in `descartada`.

### Usage

Title *Consumo* and, on the right, period chips: **7 días · 30 días · 90 días**, defaulting to 30.

Three KPI cells in a `repeat(3, 1fr)` grid, one column below 860px, cells `bg-surface p-[14px_16px]`: the label in mono small caps, the value in mono `text-3xl`, and the note in `text-[12px] text-faint`.

| KPI | Note |
|---|---|
| Consultas | the period range, for example `últimos 30 días` |
| Tokens procesados | entrada + salida |
| Costo estimado | tarifa vigente del proveedor |

Below them, the label *Consumo por usuario* and, next to it, `Umbral: N consultas por usuario en el periodo`.

The table sits in `overflow-x-auto`, grid `minmax(190px,1fr) 90px 110px 110px 118px`, `min-w-[720px]`. Columns: **Usuario · Consultas · Tokens · Costo · Estado**. The last four align right. The status reads *Excede* with a filled amber mark when the query count passes the threshold, and *Normal* with an empty mark otherwise.

Every row carries a mono *Revelar* / *Ocultar* link that swaps the pseudonymized identifier for the real name.

Footnote below the table, mono `text-mini text-faint2`:

- No one over the threshold: *Ningún usuario excede el umbral en este periodo. Identidades seudonimizadas: revelar es una acción por fila.*
- One or more over it: *N usuario(s) excede(n) el umbral. Identidades seudonimizadas: revelar es una acción por fila.*

**Privacy rule:** identities show pseudonymized by default, both in the usage table and in the queue detail. Revealing is always an explicit action, per row or per item.

---

## 5. Minor changes against the handoff

- The composer carries `pb-[52px]` in the prototype, to clear the floating scaffolding bar. In production, use the handoff value (`pb-4`).
- A standard status accepts three values: `vigente`, `transición` (label *En transición*), and `sustituida`. Only the first two use a white background; `sustituida` sits on `bg-subtle`. Neither loaded standard uses `transición`.
- Prototype scaffolding bar, which you do not implement: Acceso · Registro · Chat · Con respuesta · Error · Sin cupo · Acerca · Operación.
- The prototype component exposes two demo props: `screen` (`login` | `register` | `chat`) and `startPopulated`, a boolean that loads the sample thread.
- Application state adds these fields to the handoff `AppState` type: `quota`, `feedback`, `role`, `settingsOpen` with the modal fields, and the operations block (`opsView`, `opsItems`, `opsOpen`, `opsStatus`, `opsReason`, `opsPeriod`, `revealed`).
