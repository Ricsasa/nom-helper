# NOM Helper — Brief de diseño (primera versión de interfaz)

## Qué es

Asistente de consulta técnica sobre la NOM-001-SEDE (Instalaciones eléctricas – Utilización). El usuario pregunta en lenguaje natural y recibe una respuesta fundamentada con citas verificables al texto de la norma: capítulo, artículo y página.

No es un chatbot de propósito general. Es una herramienta de trabajo donde la trazabilidad de la fuente vale tanto como la respuesta.

## Para quién

Electricistas, proyectistas, ingenieros eléctricos, peritos y contratistas en México. Perfil técnico, poco tolerante a la ambigüedad, acostumbrado a manuales y tablas.

Se usa en escritorio la mayor parte del tiempo, pero también en celular a pie de obra. La interfaz debe funcionar bien en ambos.

## Alcance de este pase

Diseñar tres pantallas:

1. Inicio de sesión
2. Registro de cuenta
3. Chat con barra lateral

**Fuera de alcance:** la pantalla de calculadoras (solo debe existir su lugar en la navegación), modo oscuro, configuración de cuenta.

---

## Idioma

La aplicación soporta español (es-MX) e inglés (en-US). El idioma predeterminado es español.

El selector de idioma aparece en las pantallas de inicio de sesión y registro, antes de que el usuario se autentique. Es discreto — convención: esquina superior derecha — y cambia la pantalla inmediatamente al seleccionar. No interrumpe el flujo de acceso.

Muestra dos opciones únicamente: **Español** y **English**. Sin banderas. El nombre de cada idioma aparece en su propio idioma.

La preferencia de idioma persistente se guarda en el modal de configuración de cuenta, una vez autenticado. Ver addendum de soporte bilingüe para el detalle completo de qué se traduce y qué no.

---

## Pantalla 1 y 2 — Acceso

Inicio de sesión y registro. Sobrias, sin ilustraciones decorativas ni argumentos de venta: quien llega aquí ya sabe qué es el producto.

Inicio de sesión y registro. Sobrias, sin ilustraciones decorativas ni argumentos de venta: quien llega aquí ya sabe qué es el producto.

- **Inicio de sesión:** correo, contraseña, entrar, recuperar contraseña, enlace a registro, selector de idioma.
- **Registro:** nombre, correo, contraseña, crear cuenta, enlace a inicio de sesión, selector de idioma.

Ambas necesitan estados de error visibles y específicos: credenciales incorrectas, correo ya registrado, contraseña que no cumple requisitos. El error dice qué pasó y cómo resolverlo, no se disculpa.

---

## Pantalla 3 — Chat

### Barra lateral

Dos zonas claramente separadas. Esta separación es un requisito, no una sugerencia.

**Zona superior — herramientas.** Fija, no crece. Contiene:
- Nueva consulta
- Calculadoras (entrada de navegación; su pantalla no se diseña aún)

**Zona inferior — historial.** Lista cronológica de consultas previas, con scroll propio. Cada elemento se identifica por el tema de la consulta, no por una fecha genérica. Debe existir un estado vacío para el usuario nuevo.

**Pie:** identidad del usuario y salir.

En móvil la barra lateral se repliega.

### Área de conversación

Referencia de interacción: Claude y ChatGPT. Lo distintivo está en cómo se presenta la respuesta, no en reinventar el patrón de chat.

**Anatomía de una respuesta.** Cada respuesta del asistente tiene esta estructura, y el diseño debe hacer las partes distinguibles de un vistazo:

1. **Resumen** — la respuesta directa, en una o dos frases.
2. **Explicación** — el desarrollo técnico.
3. **Citas** — referencias al texto normativo, cada una con capítulo, artículo y página. Son el elemento de mayor valor de la pantalla: deben poder consultarse sin perder el hilo de la conversación.
4. **Nivel de confianza** — qué tan sustentada está la respuesta en el texto recuperado.

**Sobre el nivel de confianza:** no debe comunicarse únicamente por color. La paleta usa verde y morado como acentos decorativos de marca, así que el color ya está ocupado y leerlo como semáforo sería ambiguo. Resuélvelo con tipografía, peso, rótulo o iconografía.

### Estados que hay que diseñar

- **Vacío:** primera visita, sin consultas. Es una invitación a preguntar, no un cartel de bienvenida. Ayuda mostrar ejemplos reales de consultas.
- **Generando:** la respuesta llega progresivamente.
- **Información insuficiente:** el asistente no encontró respaldo suficiente en la norma. Este estado es importante y debe verse distinto de una respuesta normal — es una función del producto, no una falla.
- **Error:** no se pudo procesar la consulta.

### Contenido real para maquetar

Usa contenido técnico verdadero, no texto de relleno.

Consulta de ejemplo:

> ¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?

Otras consultas para poblar el historial y los ejemplos del estado vacío:

- Requisitos de puesta a tierra en instalación residencial
- Distancia mínima entre tablero y muro
- Protección requerida en circuitos de alumbrado comercial
- Cálculo de factor de demanda para vivienda unifamiliar
- Canalización permitida en área clasificada

Las citas deben verse como citas normativas reales (referencia a capítulo, artículo y página de la NOM-001-SEDE), no como enlaces web.

---

## Dirección visual

**Requisitos firmes:**

- Sin gradientes.
- Colores sólidos y sobrios. Registro enterprise, herramienta profesional.
- Acentos en verde y morado. Son decorativos, de identidad — no codifican estado ni significado.
- Tipografía sobria, con pocos pesos. La variedad tipográfica no es donde vive la personalidad aquí.
- Sin modo oscuro en este pase.
- Animación mínima. Solo donde comunique algo.

**Espíritu:** minimalista, técnico, atemporal. Debe envejecer bien y verse creíble frente a alguien que trabaja con normas y tablas todo el día. La precisión en espaciado, jerarquía y detalle es lo que sostiene una dirección así.

**Nombre provisional:** NOM Helper.

---

## Criterio de éxito

Un electricista abre la pantalla, hace una pregunta, y puede verificar en la propia interfaz de qué artículo de la norma salió la respuesta — sin dudar de si el sistema se lo inventó.
