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

  'footer.madeWith': 'Made with',
  'footer.by': 'by',
};

export default enUS;
