/**
 * Spanish (es-MX) is the default language of the product. Keys are flat: a
 * nested tree buys nothing here and makes a missing key harder to spot.
 *
 * What never appears in this file, by spec section 5: the text of the standard,
 * citation content, and the standard codes themselves.
 */
const esMX = {
  'brand.name': 'NOM Helper',
  'brand.tagline': 'NOM-001-SEDE · Instalaciones eléctricas',

  'language.es': 'Español',
  'language.en': 'English',
  'language.selector': 'Idioma',

  'auth.login.title': 'Iniciar sesión',
  'auth.login.subtitle': 'Consulta técnica sobre la NOM-001-SEDE.',
  'auth.login.submit': 'Entrar',
  'auth.login.switchPrompt': '¿No tienes cuenta?',
  'auth.login.switchAction': 'Crea una',

  'auth.register.title': 'Crear cuenta',
  'auth.register.subtitle': 'Acceso a la consulta técnica de la NOM-001-SEDE.',
  'auth.register.submit': 'Crear cuenta',
  'auth.register.switchPrompt': '¿Ya tienes cuenta?',
  'auth.register.switchAction': 'Inicia sesión',

  'auth.field.name': 'Nombre',
  'auth.field.namePlaceholder': 'Ing. Ramiro Martínez',
  'auth.field.email': 'Correo',
  'auth.field.emailPlaceholder': 'nombre@empresa.mx',
  'auth.field.password': 'Contraseña',
  'auth.field.passwordPlaceholder': '••••••••',
  'auth.field.passwordHint': 'Mínimo 8 caracteres, 1 número',
  'auth.field.recover': 'Recuperar acceso',

  'auth.error.missingCredentials.title': 'Faltan credenciales',
  'auth.error.missingCredentials.help': 'Escribe tu correo y contraseña para entrar.',
  'auth.error.invalidCredentials.title': 'Correo o contraseña incorrectos',
  'auth.error.invalidCredentials.help':
    'Revisa la contraseña; si no la recuerdas, usa Recuperar acceso.',
  'auth.error.emailTaken.title': 'Ese correo ya tiene cuenta',
  'auth.error.emailTaken.help': 'Inicia sesión con él o usa otro correo para registrarte.',
  'auth.error.weakPassword.title': 'La contraseña no cumple los requisitos',
  'auth.error.weakPassword.help': 'Necesita al menos 8 caracteres e incluir un número.',
  'auth.error.missingFields.title': 'Faltan datos para crear la cuenta',
  'auth.error.missingFields.help': 'Completa nombre y correo antes de continuar.',

  'nav.newQuery': 'Nueva consulta',
  'nav.calculators': 'Calculadoras',
  'nav.calculator1': 'Calculadora 1',
  'nav.calculator2': 'Calculadora 2',
  'nav.calculator3': 'Calculadora 3',
  'nav.about': 'Acerca y fuentes',
  'nav.signOut': 'Salir',
  'nav.openSidebar': 'Abrir navegación',
  'nav.closeSidebar': 'Cerrar navegación',

  'history.label': 'Historial',
  'history.emptyTitle': 'Aquí se guardan tus consultas.',
  'history.emptyBody': 'Cada una queda identificada por su tema.',

  'thread.defaultTitle': 'Nueva consulta',

  'empty.title': '¿Qué necesitas verificar?',
  'empty.body':
    'Pregunta en lenguaje natural. Cada respuesta viene con la referencia exacta al texto de la norma: capítulo, artículo y página.',
  'empty.examplesLabel': 'Consultas de ejemplo',
  'empty.example1': '¿Qué calibre de conductor debo usar para un circuito derivado de 30 A?',
  'empty.example2': 'Requisitos de puesta a tierra en instalación residencial',
  'empty.example3': 'Distancia mínima entre tablero y muro',
  'empty.example4': 'Protección requerida en circuitos de alumbrado comercial',
  'empty.example5': 'Cálculo de factor de demanda para vivienda unifamiliar',

  'composer.placeholder': 'Pregunta sobre la NOM-001-SEDE…',
  'composer.submit': 'Consultar',

  'notice.permanent.text':
    'Las respuestas pueden contener errores. Verifica siempre contra el texto oficial de la norma.',
  'notice.permanent.link': 'Fuentes y alcance',
  'notice.thread.title': 'Antes de comenzar',
  'notice.thread.collapse': 'Contraer',
  'notice.thread.expand': 'Ver aviso',
  'notice.thread.p1': 'Esta sesión consulta la NOM-001-SEDE-2018, vigente desde el 29 nov 2018.',
  'notice.thread.p2':
    'Las respuestas se construyen a partir del texto de la norma y siempre incluyen la cita correspondiente. Verifica cada cita contra el texto oficial antes de aplicarla.',
  'notice.thread.p3':
    'No sustituye el criterio de un profesional responsable ni constituye un dictamen técnico.',
  'notice.thread.link': 'Fuentes y alcance completo',
  'notice.thread.collapsedRef': 'NOM-001-SEDE-2018 · vigente desde 29 nov 2018',

  'response.summary': 'Resumen',
  'response.explanation': 'Explicación',
  'response.citations': 'Citas de la norma',
  'response.citation': 'cita',
  'response.citationsCount': 'citas',
  'response.seeText': 'Ver texto',
  'response.hideText': 'Ocultar',
  'response.confidence': 'Confianza',
  'response.confidence.high': 'Alta',
  'response.confidence.medium': 'Media',
  'response.confidence.low': 'Baja',
  'response.insufficient': 'Información insuficiente',

  'footer.madeWith': 'Made with',
  'footer.by': 'by',
} as const;

export default esMX;
