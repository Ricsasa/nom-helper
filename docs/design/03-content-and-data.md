# Prototype content and data

Exact copy and data structures extracted from `NOM Helper.dc.html`. Copy from this document, not from the prototype. All technical content is real: do not replace it with filler.

Every string here ships to the user in Spanish. Do not translate it.

---

## 1. Session constants

```ts
const SESSION_NORM = "NOM-001-SEDE-2018";
const SESSION_DATE = "29 nov 2018";
const QUOTA_TOTAL  = 10;
```

---

## 2. Loaded standards

```ts
const SOURCES = [
  {
    clave: "NOM-001-SEDE-2018",
    nombre: "Instalaciones eléctricas (utilización)",
    version: "2018",
    publicacion: "29 nov 2018 · DOF",
    estado: "vigente",
    incorporada: "12 mar 2026",
    nota: ""
  },
  {
    clave: "NOM-001-SEDE-2012",
    nombre: "Instalaciones eléctricas (utilización)",
    version: "2012",
    publicacion: "27 nov 2012 · DOF",
    estado: "sustituida",
    incorporada: "12 mar 2026",
    nota: "Se conserva como referencia histórica: sirve para consultar instalaciones proyectadas o verificadas bajo esa edición. No se cita en respuestas salvo que la consulta la pida de forma explícita."
  }
];
```

Status labels: `vigente` renders *Vigente*, `transición` renders *En transición*, `sustituida` renders *Sustituida*.

Panel footnote: `{n} documentos incorporados · última actualización del índice: 12 mar 2026`.

---

## 3. Example queries and history

```ts
const EXAMPLES = [
  "¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?",
  "Requisitos de puesta a tierra en instalación residencial",
  "Distancia mínima entre tablero y muro",
  "Protección requerida en circuitos de alumbrado comercial",
  "Cálculo de factor de demanda para vivienda unifamiliar"
];

const HISTORY_SEED = [
  "Calibre para circuito derivado de 30 A",
  "Puesta a tierra en instalación residencial",
  "Alumbrado comercial — protección",
  "Factor de demanda, vivienda unifamiliar",
  "Canalización en área clasificada"
];
```

### How the prototype picks the answer and the topic

These are demo rules. The backend replaces them in production.

```ts
key(q) {                                  // which answer to return
  const s = q.toLowerCase();
  if (s.includes("simular error")) return "error";
  if (s.includes("muro") || s.includes("tablero y")) return "insuficiente";
  if (s.includes("tierra")) return "tierra";
  return "calibre";
}

topic(q) {                                // thread title and history entry
  const s = q.toLowerCase();
  if (s.includes("muro")) return "Distancia tablero – muro";
  if (s.includes("tierra")) return "Puesta a tierra residencial";
  if (s.includes("calibre") || s.includes("30 a")) return "Calibre para circuito de 30 A";
  return q.length > 38 ? q.slice(0, 38) + "…" : q;
}
```

---

## 4. Citations of the main answer

```ts
const CITES = [
  {
    mark: "[1]",
    ref: "Cap. 2 · Art. 210-19(a)(1)",
    title: "Ampacidad mínima de conductores en circuitos derivados",
    quote: "Los conductores de circuitos derivados deben tener una ampacidad no menor que la carga máxima a servir, y en ningún caso menor que la capacidad nominal del dispositivo de protección contra sobrecorriente del circuito.",
    page: "p. 148 · NOM-001-SEDE-2018"
  },
  {
    mark: "[2]",
    ref: "Cap. 3 · Tabla 310-15(b)(16)",
    title: "Ampacidad de conductores aislados, no más de tres portadores",
    quote: "Cobre, aislamiento 60 °C (TW, UF): calibre 10 AWG — 30 A. Con aislamiento de 75 °C (THW, THHW, XHHW): 35 A. El valor aplicable queda limitado por la temperatura del terminal del equipo.",
    page: "p. 214 · NOM-001-SEDE-2018"
  },
  {
    mark: "[3]",
    ref: "Cap. 2 · Art. 240-4(D)(7)",
    title: "Protección contra sobrecorriente de conductores pequeños",
    quote: "Para conductor de cobre calibre 10 AWG, la protección contra sobrecorriente no debe exceder de 30 A, salvo lo permitido en 240-4(E) a 240-4(G).",
    page: "p. 172 · NOM-001-SEDE-2018"
  }
];
```

---

## 5. Answers

### 5.1 Conductor size (confidence Alta)

```ts
{
  kind: "answer",
  summary: "Usa conductor de cobre calibre 10 AWG. Es el mínimo que soporta 30 A y el máximo que admite protección de 30 A sin excepciones.",
  paragraphs: [
    "El calibre se determina por la ampacidad requerida: el conductor no puede tener una capacidad menor que la del dispositivo de protección del circuito derivado. Para 30 A, el cobre 10 AWG con aislamiento de 60 °C entrega exactamente 30 A según la tabla de ampacidades.",
    "Si el circuito lleva más de tres conductores portadores en la misma canalización, o la temperatura ambiente supera los 30 °C, aplica los factores de ajuste y corrección antes de cerrar el calibre: con seis conductores portadores el 10 AWG cae a 24 A y ya no cumple, y debes subir a 8 AWG.",
    "La temperatura del terminal del equipo también limita: aunque el aislamiento sea de 90 °C, si el interruptor está marcado para 60 °C, el cálculo se hace en la columna de 60 °C."
  ],
  citations: CITES,
  confidence: 3,
  confidenceLabel: "Alta",
  confidenceNote: "3 de 3 citas concuerdan"
}
```

### 5.2 Grounding (confidence Media)

```ts
{
  kind: "answer",
  summary: "El electrodo de puesta a tierra en vivienda debe conectarse con conductor de cobre no menor a 8 AWG, y todo el sistema debe quedar unido a un solo punto de tierra.",
  paragraphs: [
    "La norma exige un sistema de electrodos único: varilla, tubería metálica de agua enterrada y acero estructural, cuando existan, deben unirse entre sí. El conductor del electrodo se dimensiona por el calibre del conductor de acometida.",
    "En instalación residencial típica con acometida de 2/0 AWG cobre, el conductor del electrodo resulta 4 AWG cobre."
  ],
  citations: [
    {
      mark: "[1]",
      ref: "Cap. 2 · Art. 250-50",
      title: "Sistema de electrodos de puesta a tierra",
      quote: "Todos los electrodos descritos en 250-52(A)(1) a (A)(7) que estén presentes en cada edificio o estructura servida deben unirse entre sí para formar el sistema de electrodos de puesta a tierra.",
      page: "p. 186 · NOM-001-SEDE-2018"
    },
    {
      mark: "[2]",
      ref: "Cap. 2 · Tabla 250-66",
      title: "Conductor del electrodo de puesta a tierra",
      quote: "Conductor de acometida 2/0 o 1/0 AWG cobre: conductor del electrodo de puesta a tierra 4 AWG cobre.",
      page: "p. 191 · NOM-001-SEDE-2018"
    }
  ],
  confidence: 2,
  confidenceLabel: "Media",
  confidenceNote: "2 citas · depende de la acometida"
}
```

### 5.3 Insufficient information

```ts
{
  kind: "insufficient",
  summary: "La norma no fija una distancia entre tablero y muro en esos términos.",
  detail: "Lo que sí regula es el espacio de trabajo frente al equipo eléctrico: profundidad libre, ancho y altura del espacio de acceso, medidos desde las partes vivas. No encontré ningún artículo que establezca una separación posterior o lateral del tablero respecto al muro para instalaciones de menos de 600 V.",
  suggestions: [
    "¿Qué espacio de trabajo se requiere frente a un tablero de 240 V?",
    "¿Cuál es la altura mínima del espacio de acceso a un tablero?"
  ]
}
```

---

## 6. About and sources page

### Introduction

- *Herramienta de consulta sobre normatividad eléctrica mexicana. Se pregunta en lenguaje natural y la respuesta se construye a partir del texto de la norma, con la cita al capítulo, artículo y página de donde salió cada afirmación.*
- *No consulta internet ni fuentes secundarias: solo los documentos normativos incorporados al sistema, listados abajo con su versión y fecha.*

### Responde bien

1. Qué exige la norma sobre un caso concreto: calibres, protecciones, puesta a tierra, canalizaciones, espacios de trabajo.
2. Localizar el artículo o la tabla aplicable y leer su texto literal.
3. Comparar requisitos entre secciones y entender de qué depende un valor.
4. Verificar si un criterio que ya traías está respaldado por el texto normativo.

### Queda fuera

1. Cálculos de proyecto: memorias, cuadros de carga, dimensionamiento completo de una instalación.
2. Dictámenes, aprobaciones o cualquier documento con validez ante una unidad de verificación.
3. Verificación de instalaciones existentes: eso requiere inspección física.
4. Normas no incorporadas al sistema, reglamentos locales y criterios de la compañía suministradora.

### Cómo leer una respuesta

| # | Block | Text |
|---|---|---|
| 01 | Resumen | La respuesta directa, en una o dos frases. Si solo lees una parte, lee esta. |
| 02 | Explicación | El desarrollo técnico: de qué depende el valor, qué factores lo modifican y cuándo deja de aplicar. |
| 03 | Citas | Capítulo, artículo y página de donde salió cada afirmación. Se abren en línea para leer el texto literal sin salir de la conversación. |
| 04 | Confianza | Qué tan sustentada está la respuesta en el texto recuperado. No mide qué tan correcta es la instalación que estás proyectando. |

### Niveles de confianza

| Bars | Label | Text |
|---|---|---|
| 3 | Alta | Varias citas concordantes que responden directamente la consulta. Verifica las citas y aplica. |
| 2 | Media | El texto responde, pero el valor depende de condiciones que la consulta no especificó. Lee la explicación completa antes de aplicar. |
| 1 | Baja | El respaldo es parcial o indirecto. Trátala como punto de partida: abre las citas, verifica en el documento oficial y consulta a un profesional responsable. |

### Complete notice

**Qué hace el sistema** — Recupera fragmentos del texto normativo incorporado y redacta una respuesta a partir de ellos. Todo lo que afirma debe poder rastrearse a una cita; si no hay respaldo suficiente, lo declara en lugar de completar el hueco.

**Qué no hace** — No emite criterio profesional ni dictamen técnico, no aprueba ni rechaza instalaciones, y no sustituye al perito o al responsable de la obra. Tampoco considera reglamentos locales ni requisitos de la compañía suministradora.

**Errores posibles** — La redacción automática puede citar un artículo que no aplica al caso, omitir una excepción o arrastrar un valor de una tabla equivocada. Por eso cada respuesta trae la referencia: verifica siempre contra el texto oficial publicado antes de aplicar cualquier resultado.

**Responsabilidad** — La decisión técnica y su ejecución son del profesional que las firma. El uso de esta herramienta no transfiere esa responsabilidad.

---

## 7. Feedback reasons

```ts
const REASONS = [
  { id: "cita",   label: "La cita no corresponde a lo que dice la respuesta", short: "cita no corresponde" },
  { id: "off",    label: "La respuesta no contesta lo que pregunté",          short: "no contesta la pregunta" },
  { id: "falta",  label: "Falta información relevante de la norma",           short: "falta información" },
  { id: "interp", label: "La interpretación es incorrecta",                   short: "interpretación incorrecta" },
  { id: "ref",    label: "La referencia (capítulo, artículo o página) está mal", short: "referencia incorrecta" },
  { id: "otro",   label: "Otro",                                              short: "otro" }
];
```

The `short` form appears in the *Registrado · {short}* status and in the filter chips of the review queue.

---

## 8. Classification causes (Operations)

```ts
const CAUSES = [
  { id: "recuperacion", label: "El texto recuperado no era el pertinente" },
  { id: "uso",          label: "El texto era correcto pero la respuesta lo usó mal" },
  { id: "corpus",       label: "La información no está en el corpus cargado" },
  { id: "atribucion",   label: "La referencia quedó mal atribuida" },
  { id: "nada",         label: "Sin problema real — la queja no procede" }
];
```

---

## 9. Review queue (sample data)

| ID | Query | Reason | When | User | Status | Cause |
|---|---|---|---|---|---|---|
| RV-0004 | ¿Qué protección requiere un circuito de alumbrado en local comercial de 480 V? | cita | hace 6 d | U-1042 | pendiente | — |
| RV-0006 | ¿Cuál es el factor de demanda para vivienda unifamiliar de 180 m²? | falta | hace 2 d | U-1108 | pendiente | — |
| RV-0002 | ¿Puedo usar canalización de PVC en área clasificada Clase I División 2? | interp | hace 11 d | U-1042 | revisada | uso |
| RV-0001 | ¿Cada cuánto se debe hacer mantenimiento a un tablero? | corpus | hace 14 d | U-1108 | descartada | nada |

Detail of each item:

**RV-0004** — confidence Media (2). Summary: *El circuito de alumbrado requiere protección contra sobrecorriente dimensionada por la carga continua al 125 %, con interruptor de 20 A para conductor 12 AWG.* Citations: `[1] Cap. 2 · Art. 210-20(a)` — Protección de circuitos derivados con carga continua; `[2] Cap. 3 · Tabla 310-15(b)(16)` — Ampacidad de conductores aislados. Real identity: Ing. R. Martínez · rmartinez@iepsa.mx. No comment.

**RV-0006** — confidence Alta (3). Summary: *Para vivienda unifamiliar se aplican 3 000 VA por los primeros 3 000 VA al 100 % y el resto al 35 % según la tabla de factores de demanda para alumbrado general.* Citations: `[1] Cap. 2 · Tabla 220-42` — Factores de demanda para alumbrado general; `[2] Cap. 2 · Art. 220-12` — Carga de alumbrado general por tipo de ocupación. Real identity: Arq. L. Fuentes · lfuentes@iepsa.mx. Comment: *Contestó solo la parte de alumbrado; no dijo nada de cargas de aparatos ni del cálculo por el método estándar.*

**RV-0002** — confidence Media (2). Summary: *Se permite canalización no metálica en Clase I División 2 cuando queda enterrada bajo 600 mm de relleno y los últimos 600 mm de la corrida son metálicos.* Citation: `[1] Cap. 5 · Art. 501-10(b)(1)` — Métodos de alambrado en Clase I División 2. Real identity: Ing. R. Martínez · rmartinez@iepsa.mx.

**RV-0001** — confidence Baja (1). Summary: *La norma no fija periodicidad de mantenimiento; regula condiciones de instalación y espacios de trabajo.* Citation: `[1] Cap. 1 · Art. 110-26` — Espacios de trabajo alrededor de equipo eléctrico. Real identity: Arq. L. Fuentes · lfuentes@iepsa.mx.

---

## 10. Usage (sample data)

```ts
const USAGE = {
  "7":  { consultas: "31",  tokens: "0.42 M", costo: "$310",   rango: "últimos 7 días",
          rows: [["U-1042", 18, "0.24 M", "$178"], ["U-1108", 9, "0.12 M", "$92"], ["U-1203", 4, "0.06 M", "$40"]] },
  "30": { consultas: "148", tokens: "2.41 M", costo: "$1,780", rango: "últimos 30 días",
          rows: [["U-1042", 71, "1.14 M", "$842"], ["U-1108", 38, "0.63 M", "$465"], ["U-1203", 22, "0.36 M", "$266"], ["U-1311", 12, "0.19 M", "$140"], ["U-1402", 5, "0.09 M", "$67"]] },
  "90": { consultas: "296", tokens: "4.88 M", costo: "$3,604", rango: "últimos 90 días",
          rows: [["U-1042", 134, "2.21 M", "$1,632"], ["U-1108", 77, "1.27 M", "$938"], ["U-1203", 44, "0.72 M", "$532"], ["U-1311", 28, "0.46 M", "$340"], ["U-1402", 13, "0.22 M", "$162"]] }
};

const THRESHOLD  = { "7": 15, "30": 60, "90": 150 };

const REAL_NAMES = {
  "U-1042": "Ing. R. Martínez",
  "U-1108": "Arq. L. Fuentes",
  "U-1203": "Ing. D. Salas",
  "U-1311": "Ing. M. Peña",
  "U-1402": "C. Ordóñez"
};
```

Amounts are in MXN. The column and the KPI append the suffix ` MXN`.

---

## 11. Interface strings

### Access

| Element | Sign in | Registration |
|---|---|---|
| Title | Iniciar sesión | Crear cuenta |
| Subtitle | Consulta técnica sobre la NOM-001-SEDE. | Acceso a la consulta técnica de la NOM-001-SEDE. |
| Button | Entrar | Crear cuenta |
| Mode switch | ¿No tienes cuenta? / Crea una | ¿Ya tienes cuenta? / Inicia sesión |

Placeholders: `Ing. Ramiro Martínez` (name), `nombre@empresa.mx` (email), `••••••••` (password). Registration help: *Mínimo 8 caracteres, 1 número*. Sign-in link: *Recuperar acceso*.

Form errors:

| Condition | Title | Help |
|---|---|---|
| Sign in with no email or no password | Faltan credenciales | Escribe tu correo y contraseña para entrar. |
| Sign in with a wrong password | Correo o contraseña incorrectos | Revisa la contraseña; si no la recuerdas, usa Recuperar acceso. En esta demo la contraseña es nom2012. |
| Registration, email already exists | Ese correo ya tiene cuenta | Inicia sesión con él o usa otro correo para registrarte. |
| Registration, weak password | La contraseña no cumple los requisitos | Necesita al menos 8 caracteres e incluir un número. |
| Registration, empty fields | Faltan datos para crear la cuenta | Completa nombre y correo antes de continuar. |

The sentence *En esta demo la contraseña es nom2012* belongs to the prototype. Remove it in production.

### Sidebar

- Brand: **NOM Helper**
- Items: *Nueva consulta*, the *Calculadoras* label with *Calculadora 1/2/3*, *Acerca y fuentes*, and *Operación* for the `ops` role only.
- The *Historial* label. Empty: *Aquí se guardan tus consultas.* / *Cada una queda identificada por su tema.*
- Demo account: `Ing. R. Martínez` · `rmartinez@iepsa.mx`. Button *Salir*.

### Thread

- Default title: *Nueva consulta*. Standard mark in the topbar: `NOM-001-SEDE-2018`.
- Empty state: *¿Qué necesitas verificar?* / *Pregunta en lenguaje natural. Cada respuesta viene con la referencia exacta al texto de la norma: capítulo, artículo y página.* / the label *Consultas de ejemplo*.
- Block labels: *Resumen*, *Explicación*, *Citas de la norma*, *Confianza*, *Información insuficiente*, *Reformula así*.
- Citation count: `1 referencia` or `N referencias`. Citation toggle: *Ver texto* / *Ocultar*.
- Generating: *Buscando en el texto de la norma…* (0–700ms), then *Redactando respuesta y verificando citas…*
- Error: *No se pudo procesar la consulta* / *Se perdió la conexión con el índice de la norma. Tu texto no se borró: vuelve a enviarlo.* / button *Reintentar*.
- Composer: placeholder *Pregunta sobre la NOM-001-SEDE…*, button *Consultar*.

### Notice (three layers)

- Permanent: *Las respuestas pueden contener errores. Verifica siempre contra el texto oficial de la norma.* plus the link *Fuentes y alcance*.
- Thread start: the title *Antes de comenzar*, the *Contraer* button, and the link *Fuentes y alcance completo*. Paragraphs:
  - *Esta sesión consulta la NOM-001-SEDE-2018, vigente desde el 29 nov 2018.*
  - *Las respuestas se construyen a partir del texto de la norma y siempre incluyen la cita correspondiente. Verifica cada cita contra el texto oficial antes de aplicarla.*
  - *No sustituye el criterio de un profesional responsable ni constituye un dictamen técnico.*
- Collapsed: `NOM-001-SEDE-2018 · vigente desde 29 nov 2018` plus *Ver aviso*.

### Footer

*Made with* 🖤 *by* [rs-studio.dev](https://rs-studio.dev) — the only emoji in the product.
