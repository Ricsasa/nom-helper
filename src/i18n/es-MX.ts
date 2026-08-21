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

  'about.title': 'Acerca del proyecto y las fuentes',
  'about.back': 'Volver a la consulta',
  'about.p1':
    'Herramienta de consulta sobre normatividad eléctrica mexicana. Se pregunta en lenguaje natural y la respuesta se construye a partir del texto de la norma, con la cita al capítulo, artículo y página de donde salió cada afirmación.',
  'about.p2':
    'No consulta internet ni fuentes secundarias: solo los documentos normativos incorporados al sistema, listados abajo con su versión y fecha.',

  'about.standards.label': 'Normas incorporadas',
  'about.standards.status.current': 'Vigente',
  'about.standards.status.inTransition': 'En transición',
  'about.standards.status.superseded': 'Sustituida',
  'about.standards.field.version': 'Versión',
  'about.standards.field.publication': 'Publicación oficial',
  'about.standards.field.loaded': 'Incorporada al sistema',
  'about.standards.footnote': ' documentos incorporados · última actualización del índice: ',
  'about.standards.note.historical':
    'Se conserva como referencia histórica: sirve para consultar instalaciones proyectadas o verificadas bajo esa edición. No se cita en respuestas salvo que la consulta la pida de forma explícita.',

  'about.coverage.label': 'Qué cubre y qué no',
  'about.coverage.yes': 'Responde bien',
  'about.coverage.no': 'Queda fuera',
  'about.coverage.yes1':
    'Qué exige la norma sobre un caso concreto: calibres, protecciones, puesta a tierra, canalizaciones, espacios de trabajo.',
  'about.coverage.yes2': 'Localizar el artículo o la tabla aplicable y leer su texto literal.',
  'about.coverage.yes3':
    'Comparar requisitos entre secciones y entender de qué depende un valor.',
  'about.coverage.yes4':
    'Verificar si un criterio que ya traías está respaldado por el texto normativo.',
  'about.coverage.no1':
    'Cálculos de proyecto: memorias, cuadros de carga, dimensionamiento completo de una instalación.',
  'about.coverage.no2':
    'Dictámenes, aprobaciones o cualquier documento con validez ante una unidad de verificación.',
  'about.coverage.no3':
    'Verificación de instalaciones existentes: eso requiere inspección física.',
  'about.coverage.no4':
    'Normas no incorporadas al sistema, reglamentos locales y criterios de la compañía suministradora.',

  'about.anatomy.label': 'Cómo leer una respuesta',
  'about.anatomy.summary':
    'La respuesta directa, en una o dos frases. Si solo lees una parte, lee esta.',
  'about.anatomy.explanation':
    'El desarrollo técnico: de qué depende el valor, qué factores lo modifican y cuándo deja de aplicar.',
  'about.anatomy.citations':
    'Capítulo, artículo y página de donde salió cada afirmación. Se abren en línea para leer el texto literal sin salir de la conversación.',
  'about.anatomy.confidence':
    'Qué tan sustentada está la respuesta en el texto recuperado. No mide qué tan correcta es la instalación que estás proyectando.',
  'about.anatomy.insufficient':
    'Cuando el texto recuperado no alcanza para responder, el sistema lo declara en lugar de completar el hueco. Es el resultado correcto cuando la norma no cubre el caso como fue preguntado.',

  'about.confidence.label': 'Niveles de confianza',
  'about.confidence.high':
    'Varias citas concordantes que responden directamente la consulta. Verifica las citas y aplica.',
  'about.confidence.medium':
    'El texto responde, pero el valor depende de condiciones que la consulta no especificó. Lee la explicación completa antes de aplicar.',
  'about.confidence.low':
    'El respaldo es parcial o indirecto. Trátala como punto de partida: abre las citas, verifica en el documento oficial y consulta a un profesional responsable.',

  'about.disclaimer.label': 'Aviso completo',
  'about.disclaimer.does.title': 'Qué hace el sistema',
  'about.disclaimer.does.text':
    'Recupera fragmentos del texto normativo incorporado y redacta una respuesta a partir de ellos. Todo lo que afirma debe poder rastrearse a una cita; si no hay respaldo suficiente, lo declara en lugar de completar el hueco.',
  'about.disclaimer.doesNot.title': 'Qué no hace',
  'about.disclaimer.doesNot.text':
    'No emite criterio profesional ni dictamen técnico, no aprueba ni rechaza instalaciones, y no sustituye al perito o al responsable de la obra. Tampoco considera reglamentos locales ni requisitos de la compañía suministradora.',
  'about.disclaimer.errors.title': 'Errores posibles',
  'about.disclaimer.errors.text':
    'La redacción automática puede citar un artículo que no aplica al caso, omitir una excepción o arrastrar un valor de una tabla equivocada. Por eso cada respuesta trae la referencia: verifica siempre contra el texto oficial publicado antes de aplicar cualquier resultado.',
  'about.disclaimer.liability.title': 'Responsabilidad',
  'about.disclaimer.liability.text':
    'La decisión técnica y su ejecución son del profesional que las firma. El uso de esta herramienta no transfiere esa responsabilidad.',

  'footer.madeWith': 'Made with',
  'footer.by': 'by',

  'operator.nav.title': 'Operación',
  'operator.nav.subtitle': 'Revisión de respuestas y consumo del sistema.',
  'operator.nav.backToApp': 'Volver a la consulta',
  'operator.entry': 'Operación',

  'operator.queue.label': 'Cola de revisión',
  'operator.queue.count': '{count} en la lista',
  'operator.queue.filter.category': 'Motivo',
  'operator.queue.filter.status': 'Estado',
  'operator.filter.all': 'Todos',
  'operator.queue.column.query': 'Consulta',
  'operator.queue.column.reason': 'Motivo',
  'operator.queue.column.when': 'Fecha',
  'operator.queue.column.status': 'Estado',
  'operator.queue.open': 'Abrir',
  'operator.queue.close': 'Cerrar',
  'operator.queue.empty.title': 'No hay respuestas pendientes de revisión.',
  'operator.queue.empty.body':
    'La cola se llena cuando un usuario califica una respuesta como incorrecta. Vacía es el estado normal la mayor parte del tiempo.',
  'operator.queue.emptyFiltered.title': 'Ningún registro coincide con el filtro.',
  'operator.queue.emptyFiltered.body': 'Cambia el motivo o el estado para ver el resto de la lista.',

  'operator.status.pending': 'Sin revisar',
  'operator.status.reviewed': 'Revisado',
  'operator.status.discarded': 'Descartado',
  'operator.status.not_applicable': 'No aplica',

  'operator.card.query': 'Consulta completa',
  'operator.card.response': 'Respuesta entregada',
  'operator.card.citations': 'Citas recuperadas',
  'operator.card.confidence': 'Confianza',
  'operator.card.reason': 'Motivo reportado',
  'operator.card.comment': 'Comentario del usuario',
  'operator.card.noComment': 'Sin comentario.',
  'operator.card.loading': 'Cargando el detalle.',
  'operator.card.loadFailed': 'No se pudo leer el mensaje. Vuelve a abrir el registro.',

  'operator.cause.label': 'Causa técnica',
  'operator.cause.wrong_chunk_retrieved': 'El texto recuperado no era relevante para la consulta',
  'operator.cause.correct_chunk_wrong_response': 'El texto era correcto pero la respuesta lo usó mal',
  'operator.cause.content_not_in_corpus': 'La información no está en el corpus cargado',
  'operator.cause.wrong_citation_attribution': 'La referencia de la cita quedó mal atribuida',
  'operator.cause.no_issue': 'Sin problema real: la queja no procede',

  'operator.destination.label': 'Destino',
  'operator.destination.add_to_eval_set': 'Agregar al set de evaluación',
  'operator.destination.marked_reviewed': 'Marcar como revisado',
  'operator.destination.discarded': 'Descartar',

  'operator.card.submit': 'Registrar revisión',
  'operator.card.submitting': 'Registrando',
  'operator.card.submitError': 'No se registró la revisión. Intenta de nuevo.',
  'operator.card.submitted': 'Revisión registrada.',

  'operator.consumption.label': 'Consumo',
  'operator.consumption.period': 'Últimos 30 días',
  'operator.consumption.totalQueries': 'Consultas',
  'operator.consumption.totalTokens': 'Tokens',
  'operator.consumption.totalCost': 'Costo estimado',
  'operator.consumption.column.user': 'Usuario',
  'operator.consumption.column.queries': 'Consultas',
  'operator.consumption.column.tokens': 'Tokens',
  'operator.consumption.column.cost': 'Costo (USD)',
  'operator.consumption.column.range': 'Rango',
  'operator.consumption.threshold': 'Normal: hasta {threshold} por usuario en el periodo.',
  'operator.consumption.above': 'Fuera de rango',
  'operator.consumption.within': 'Dentro de rango',
  'operator.consumption.empty': 'No hay consumo registrado en el periodo.',
  'operator.consumption.reveal': 'Ver identidad',
  'operator.consumption.revealing': 'Consultando',
  'operator.consumption.revealFailed': 'No se pudo leer el perfil.',
  'operator.consumption.pseudonymNote':
    'La identidad se muestra seudonimizada. Revélala solo cuando la revisión lo requiera.',

  'operator.reason.citation_mismatch': 'La cita no corresponde a lo que dice la respuesta',
  'operator.reason.off_topic': 'La respuesta no contesta lo que pregunté',
  'operator.reason.missing_info': 'Falta información relevante de la norma',
  'operator.reason.wrong_interpretation': 'La interpretación es incorrecta',
  'operator.reason.wrong_reference': 'La referencia (capítulo, artículo o página) está mal',
  'operator.reason.other': 'Otro',
  'operator.reason.none': 'Sin motivo',

} as const;

export default esMX;
