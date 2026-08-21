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

  'rating.label': 'Valoración',
  'rating.up': 'Respuesta útil',
  'rating.down': 'Respuesta no útil',
  'rating.saved': 'Registrada',
  'rating.reasonSaved': 'Motivo registrado',
  'rating.error': 'No se registró la valoración. Vuelve a intentarlo.',
  'rating.reasonTitle': 'Qué falló (opcional)',
  'rating.send': 'Enviar',
  'rating.skip': 'Omitir',

  'settings.open': 'Configuración',
  'settings.title': 'Configuración de la cuenta',
  'settings.close': 'Cerrar',

  'settings.account': 'Cuenta',
  'settings.name': 'Nombre',
  'settings.email': 'Correo electrónico',
  'settings.language': 'Idioma',
  'settings.password': 'Contraseña',
  'settings.password.action': 'Cambiar contraseña',
  'settings.password.title': 'Cambiar contraseña',
  'settings.password.current': 'Contraseña actual',
  'settings.password.new': 'Contraseña nueva',
  'settings.password.confirm': 'Confirmar contraseña nueva',
  'settings.password.hint': '8 caracteres o más, con al menos un número',
  'settings.password.saved': 'Contraseña actualizada',
  'settings.back': 'Volver',
  'settings.save': 'Guardar',
  'settings.cancel': 'Cancelar',
  'settings.edit': 'Editar',
  'settings.saved': 'Guardado',

  'settings.delete': 'Eliminar',

  'settings.usage': 'Uso',
  'settings.usage.today': 'Consultas de hoy',
  'settings.usage.count': '{used} de {limit}',
  'settings.usage.reset': 'El contador vuelve a cero a las 00:00, hora del centro de México.',
  'settings.usage.loading': 'Leyendo el consumo',

  'settings.data': 'Datos',
  'settings.data.history': 'Eliminar historial de consultas',
  'settings.data.historyBody': 'Se eliminan todas las conversaciones y sus respuestas. La cuenta y las preferencias se conservan.',
  'settings.data.historyConfirm': 'Eliminar historial',
  'settings.data.historyDone': 'Historial eliminado',
  'settings.data.account': 'Eliminar cuenta',
  'settings.data.accountBody': 'Se elimina la cuenta, el historial de consultas y las preferencias. La acción es permanente y no se puede revertir.',
  'settings.data.accountPrompt': 'Escribe ELIMINAR para confirmar.',
  'settings.data.accountWord': 'ELIMINAR',
  'settings.data.accountConfirm': 'Eliminar cuenta de forma permanente',

  'settings.error.saveFailed.title': 'No se guardó el cambio',
  'settings.error.saveFailed.help': 'Revisa tu conexión y vuelve a intentarlo.',
  'settings.error.emailTaken.title': 'Ese correo ya tiene una cuenta',
  'settings.error.emailTaken.help': 'Usa otra dirección o inicia sesión con esa cuenta.',
  'settings.error.invalidCredentials.title': 'La contraseña actual no es correcta',
  'settings.error.invalidCredentials.help': 'Escribe la contraseña con la que iniciaste sesión.',
  'settings.error.weakPassword.title': 'La contraseña nueva no cumple los requisitos',
  'settings.error.weakPassword.help': 'Usa 8 caracteres o más e incluye al menos un número.',
  'settings.error.missingFields.title': 'Faltan datos',
  'settings.error.missingFields.help': 'Completa el campo antes de guardar.',
  'settings.error.passwordMismatch.title': 'Las contraseñas nuevas no coinciden',
  'settings.error.passwordMismatch.help': 'Escribe la misma contraseña en los dos campos.',

  'footer.madeWith': 'Made with',
  'footer.by': 'by',
} as const;

export default esMX;
