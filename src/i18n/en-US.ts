import type esMX from './es-MX';

/**
 * English (en-US). Typed against the Spanish file so a key added there and
 * forgotten here fails the type check instead of falling back at runtime.
 *
 * Untranslated by spec section 5: the text of the standard, citation content,
 * and standard codes. "NOM-001-SEDE" stays verbatim in both languages.
 */
const enUS: Record<keyof typeof esMX, string> = {
  'brand.name': 'NOM Helper',
  'brand.tagline': 'NOM-001-SEDE · Electrical installations',

  'language.es': 'Español',
  'language.en': 'English',
  'language.selector': 'Language',

  'auth.login.title': 'Sign in',
  'auth.login.subtitle': 'Technical reference for NOM-001-SEDE.',
  'auth.login.submit': 'Enter',
  'auth.login.switchPrompt': 'No account yet?',
  'auth.login.switchAction': 'Create one',

  'auth.register.title': 'Create account',
  'auth.register.subtitle': 'Access to the NOM-001-SEDE technical reference.',
  'auth.register.submit': 'Create account',
  'auth.register.switchPrompt': 'Already have an account?',
  'auth.register.switchAction': 'Sign in',

  'auth.field.name': 'Name',
  'auth.field.namePlaceholder': 'Ing. Ramiro Martínez',
  'auth.field.email': 'Email',
  'auth.field.emailPlaceholder': 'name@company.mx',
  'auth.field.password': 'Password',
  'auth.field.passwordPlaceholder': '••••••••',
  'auth.field.passwordHint': 'At least 8 characters, 1 number',
  'auth.field.recover': 'Recover access',

  'auth.error.missingCredentials.title': 'Missing credentials',
  'auth.error.missingCredentials.help': 'Enter your email and password to continue.',
  'auth.error.invalidCredentials.title': 'Incorrect email or password',
  'auth.error.invalidCredentials.help':
    'Check the password; if you do not remember it, use Recover access.',
  'auth.error.emailTaken.title': 'That email already has an account',
  'auth.error.emailTaken.help': 'Sign in with it, or use a different email to register.',
  'auth.error.weakPassword.title': 'The password does not meet the requirements',
  'auth.error.weakPassword.help': 'It needs at least 8 characters and must include a number.',
  'auth.error.missingFields.title': 'Missing details to create the account',
  'auth.error.missingFields.help': 'Fill in name and email before continuing.',

  'nav.newQuery': 'New query',
  'nav.calculators': 'Calculators',
  'nav.calculator1': 'Calculator 1',
  'nav.calculator2': 'Calculator 2',
  'nav.calculator3': 'Calculator 3',
  'nav.about': 'About and sources',
  'nav.signOut': 'Sign out',
  'nav.openSidebar': 'Open navigation',
  'nav.closeSidebar': 'Close navigation',

  'history.label': 'History',
  'history.emptyTitle': 'Your queries are saved here.',
  'history.emptyBody': 'Each one is identified by its topic.',

  'thread.defaultTitle': 'New query',

  'empty.title': 'What do you need to verify?',
  'empty.body':
    'Ask in natural language. Every answer comes with the exact reference to the text of the standard: chapter, article and page.',
  'empty.examplesLabel': 'Example queries',
  'empty.example1': 'What conductor gauge must I use for a 30 A branch circuit?',
  'empty.example2': 'Grounding requirements for a residential installation',
  'empty.example3': 'Minimum distance between a panelboard and a wall',
  'empty.example4': 'Protection required in commercial lighting circuits',
  'empty.example5': 'Demand factor calculation for a single-family dwelling',

  'composer.placeholder': 'Ask about NOM-001-SEDE…',
  'composer.submit': 'Query',

  'notice.permanent.text':
    'Answers may contain errors. Always verify against the official text of the standard.',
  'notice.permanent.link': 'Sources and scope',
  'notice.thread.title': 'Before you start',
  'notice.thread.collapse': 'Collapse',
  'notice.thread.expand': 'View notice',
  'notice.thread.p1': 'This session queries NOM-001-SEDE-2018, in force since 29 Nov 2018.',
  'notice.thread.p2':
    'Answers are built from the text of the standard and always include the corresponding citation. Verify every citation against the official text before applying it.',
  'notice.thread.p3':
    'It does not replace the judgement of a responsible professional, nor does it constitute a technical opinion.',
  'notice.thread.link': 'Full sources and scope',
  'notice.thread.collapsedRef': 'NOM-001-SEDE-2018 · in force since 29 Nov 2018',

  'response.summary': 'Summary',
  'response.explanation': 'Explanation',
  'response.citations': 'Citations from the standard',
  'response.citation': 'citation',
  'response.citationsCount': 'citations',
  'response.seeText': 'See text',
  'response.hideText': 'Hide',
  'response.confidence': 'Confidence',
  'response.confidence.high': 'High',
  'response.confidence.medium': 'Medium',
  'response.confidence.low': 'Low',
  'response.insufficient': 'Insufficient information',

  'rating.label': 'Rating',
  'rating.up': 'Helpful response',
  'rating.down': 'Unhelpful response',
  'rating.saved': 'Recorded',
  'rating.reasonSaved': 'Reason recorded',
  'rating.error': 'The rating was not recorded. Try again.',
  'rating.reasonTitle': 'What failed (optional)',
  'rating.send': 'Send',
  'rating.skip': 'Skip',

  'settings.open': 'Settings',
  'settings.title': 'Account settings',
  'settings.close': 'Close',

  'settings.account': 'Account',
  'settings.name': 'Name',
  'settings.email': 'Email address',
  'settings.language': 'Language',
  'settings.password': 'Password',
  'settings.password.action': 'Change password',
  'settings.password.title': 'Change password',
  'settings.password.current': 'Current password',
  'settings.password.new': 'New password',
  'settings.password.confirm': 'Confirm new password',
  'settings.password.hint': '8 characters or more, with at least one digit',
  'settings.password.saved': 'Password updated',
  'settings.back': 'Back',
  'settings.save': 'Save',
  'settings.cancel': 'Cancel',
  'settings.edit': 'Edit',
  'settings.saved': 'Saved',

  'settings.delete': 'Delete',

  'settings.usage': 'Usage',
  'settings.usage.today': 'Queries today',
  'settings.usage.count': '{used} of {limit}',
  'settings.usage.reset': 'The counter returns to zero at 00:00, Central Mexico time.',
  'settings.usage.loading': 'Reading usage',

  'settings.data': 'Data',
  'settings.data.history': 'Delete query history',
  'settings.data.historyBody': 'Every conversation and its responses are deleted. The account and the preferences stay.',
  'settings.data.historyConfirm': 'Delete history',
  'settings.data.historyDone': 'History deleted',
  'settings.data.account': 'Delete account',
  'settings.data.accountBody': 'The account, the query history and the preferences are deleted. The action is permanent and cannot be reversed.',
  'settings.data.accountPrompt': 'Type DELETE to confirm.',
  'settings.data.accountWord': 'DELETE',
  'settings.data.accountConfirm': 'Delete account permanently',

  'settings.error.saveFailed.title': 'The change was not saved',
  'settings.error.saveFailed.help': 'Check your connection and try again.',
  'settings.error.emailTaken.title': 'That email already has an account',
  'settings.error.emailTaken.help': 'Use another address, or sign in with that account.',
  'settings.error.invalidCredentials.title': 'The current password is not correct',
  'settings.error.invalidCredentials.help': 'Type the password you signed in with.',
  'settings.error.weakPassword.title': 'The new password does not meet the requirements',
  'settings.error.weakPassword.help': 'Use 8 characters or more and include at least one digit.',
  'settings.error.missingFields.title': 'Missing information',
  'settings.error.missingFields.help': 'Fill in the field before saving.',
  'settings.error.passwordMismatch.title': 'The new passwords do not match',
  'settings.error.passwordMismatch.help': 'Type the same password in both fields.',

  'about.title': 'About the project and its sources',
  'about.back': 'Back to queries',
  'about.p1':
    'A tool for querying Mexican electrical regulations. You ask in plain language and the answer is built from the text of the standard, citing the chapter, article and page each statement came from.',
  'about.p2':
    'It does not search the internet or secondary sources: only the normative documents loaded into the system, listed below with their version and date.',

  'about.standards.label': 'Standards loaded',
  'about.standards.status.current': 'In effect',
  'about.standards.status.inTransition': 'In transition',
  'about.standards.status.superseded': 'Superseded',
  'about.standards.field.version': 'Version',
  'about.standards.field.publication': 'Official publication',
  'about.standards.field.loaded': 'Loaded into the system',
  'about.standards.footnote': ' documents loaded · index last updated: ',
  'about.standards.note.historical':
    'Kept as a historical reference: use it for installations designed or verified under that edition. It is not cited in answers unless the query asks for it explicitly.',

  'about.coverage.label': "What it covers and what it doesn't",
  'about.coverage.yes': 'Answers well',
  'about.coverage.no': 'Out of scope',
  'about.coverage.yes1':
    'What the standard requires in a concrete case: conductor sizes, protection, grounding, raceways, working spaces.',
  'about.coverage.yes2': 'Locating the applicable article or table and reading its literal text.',
  'about.coverage.yes3':
    'Comparing requirements across sections and understanding what a value depends on.',
  'about.coverage.yes4':
    'Checking whether a criterion you already had is backed by the normative text.',
  'about.coverage.no1':
    'Project calculations: design reports, load schedules, full sizing of an installation.',
  'about.coverage.no2':
    'Rulings, approvals or any document with standing before a verification unit.',
  'about.coverage.no3':
    'Verification of existing installations: that requires a physical inspection.',
  'about.coverage.no4':
    'Standards not loaded into the system, local regulations and utility company criteria.',

  'about.anatomy.label': 'How to read an answer',
  'about.anatomy.summary':
    'The direct answer, in one or two sentences. If you read only one part, read this one.',
  'about.anatomy.explanation':
    'The technical development: what the value depends on, which factors modify it and when it stops applying.',
  'about.anatomy.citations':
    'The chapter, article and page each statement came from. They open inline, so you read the literal text without leaving the conversation.',
  'about.anatomy.confidence':
    'How well the answer is supported by the retrieved text. It does not measure how correct the installation you are designing is.',
  'about.anatomy.insufficient':
    'When the retrieved text is not enough to answer, the system says so instead of filling the gap. It is the correct result when the standard does not cover the case as it was asked.',

  'about.confidence.label': 'Confidence levels',
  'about.confidence.high':
    'Several agreeing citations that answer the query directly. Verify the citations and apply.',
  'about.confidence.medium':
    'The text answers, but the value depends on conditions the query did not state. Read the full explanation before applying.',
  'about.confidence.low':
    'The support is partial or indirect. Treat it as a starting point: open the citations, verify against the official document and consult a responsible professional.',

  'about.disclaimer.label': 'Full notice',
  'about.disclaimer.does.title': 'What the system does',
  'about.disclaimer.does.text':
    'It retrieves fragments of the loaded normative text and writes an answer from them. Everything it states must be traceable to a citation; when the support is not enough, it says so instead of filling the gap.',
  'about.disclaimer.doesNot.title': 'What it does not do',
  'about.disclaimer.doesNot.text':
    'It issues no professional judgment and no technical ruling, it approves or rejects no installation, and it does not replace the expert or the person responsible for the work. It also does not account for local regulations or utility company requirements.',
  'about.disclaimer.errors.title': 'Possible errors',
  'about.disclaimer.errors.text':
    'Automatic drafting can cite an article that does not apply to the case, omit an exception or carry a value over from the wrong table. That is why every answer carries its reference: always verify against the official published text before applying any result.',
  'about.disclaimer.liability.title': 'Liability',
  'about.disclaimer.liability.text':
    'The technical decision and its execution belong to the professional who signs them. Use of this tool does not transfer that responsibility.',

  'footer.madeWith': 'Made with',
  'footer.by': 'by',

  'operator.nav.title': 'Operations',
  'operator.nav.subtitle': 'Response review and system consumption.',
  'operator.nav.backToApp': 'Back to the query application',
  'operator.entry': 'Operations',

  'operator.queue.label': 'Review queue',
  'operator.queue.count': '{count} in the list',
  'operator.queue.filter.category': 'Reason',
  'operator.queue.filter.status': 'Status',
  'operator.filter.all': 'All',
  'operator.queue.column.query': 'Query',
  'operator.queue.column.reason': 'Reason',
  'operator.queue.column.when': 'Date',
  'operator.queue.column.status': 'Status',
  'operator.queue.open': 'Open',
  'operator.queue.close': 'Close',
  'operator.queue.empty.title': 'No responses are waiting for review.',
  'operator.queue.empty.body':
    'The queue fills when a user rates a response as incorrect. Empty is the normal state most of the time.',
  'operator.queue.emptyFiltered.title': 'No record matches the filter.',
  'operator.queue.emptyFiltered.body': 'Change the reason or the status to see the rest of the list.',

  'operator.status.pending': 'Unreviewed',
  'operator.status.reviewed': 'Reviewed',
  'operator.status.discarded': 'Discarded',
  'operator.status.not_applicable': 'Not applicable',

  'operator.card.query': 'Full query',
  'operator.card.response': 'Response delivered',
  'operator.card.citations': 'Retrieved citations',
  'operator.card.confidence': 'Confidence',
  'operator.card.reason': 'Reported reason',
  'operator.card.comment': 'User comment',
  'operator.card.noComment': 'No comment.',
  'operator.card.loading': 'Loading the detail.',
  'operator.card.loadFailed': 'The message could not be read. Open the record again.',

  'operator.cause.label': 'Technical cause',
  'operator.cause.wrong_chunk_retrieved': 'The retrieved text was not relevant to the query',
  'operator.cause.correct_chunk_wrong_response': 'The text was correct but the response used it incorrectly',
  'operator.cause.content_not_in_corpus': 'The information is not in the loaded corpus',
  'operator.cause.wrong_citation_attribution': 'The citation reference was incorrectly attributed',
  'operator.cause.no_issue': 'No real issue: the complaint is not warranted',

  'operator.destination.label': 'Destination',
  'operator.destination.add_to_eval_set': 'Add to evaluation set',
  'operator.destination.marked_reviewed': 'Mark as reviewed',
  'operator.destination.discarded': 'Discard',

  'operator.card.submit': 'Record review',
  'operator.card.submitting': 'Recording',
  'operator.card.submitError': 'The review was not recorded. Try again.',
  'operator.card.submitted': 'Review recorded.',

  'operator.consumption.label': 'Consumption',
  'operator.consumption.period': 'Last 30 days',
  'operator.consumption.totalQueries': 'Queries',
  'operator.consumption.totalTokens': 'Tokens',
  'operator.consumption.totalCost': 'Estimated cost',
  'operator.consumption.column.user': 'User',
  'operator.consumption.column.queries': 'Queries',
  'operator.consumption.column.tokens': 'Tokens',
  'operator.consumption.column.cost': 'Cost (USD)',
  'operator.consumption.column.range': 'Range',
  'operator.consumption.threshold': 'Normal: up to {threshold} per user in the period.',
  'operator.consumption.above': 'Above range',
  'operator.consumption.within': 'Within range',
  'operator.consumption.empty': 'No consumption recorded in the period.',
  'operator.consumption.reveal': 'Reveal identity',
  'operator.consumption.revealing': 'Reading',
  'operator.consumption.revealFailed': 'The profile could not be read.',
  'operator.consumption.pseudonymNote':
    'Identity is shown pseudonymized. Reveal it only when the review requires it.',

  'operator.reason.citation_mismatch': 'La cita no corresponde a lo que dice la respuesta',
  'operator.reason.off_topic': 'La respuesta no contesta lo que pregunté',
  'operator.reason.missing_info': 'Falta información relevante de la norma',
  'operator.reason.wrong_interpretation': 'La interpretación es incorrecta',
  'operator.reason.wrong_reference': 'La referencia (capítulo, artículo o página) está mal',
  'operator.reason.other': 'Otro',
  'operator.reason.none': 'Sin motivo',

};

export default enUS;
