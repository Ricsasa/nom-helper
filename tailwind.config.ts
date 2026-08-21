import type { Config } from 'tailwindcss';

/**
 * Tokens transcribed from the design handoff bundle
 * (docs/design/NOM-helper-1/design_handoff_nom_helper/README.md, section 4.2).
 * The fractional font sizes are intentional: they are the real values of the
 * design, not a rounding accident.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // The design has a single breakpoint: below it the sidebar leaves the
      // flow and becomes a drawer (design 7.2). The thread column is already
      // capped at 720px, so no other cut point is needed.
      screens: {
        shell: '860px',
      },
      colors: {
        canvas: '#FBFBFA',
        surface: '#FFFFFF',
        muted: '#F7F7F4',
        subtle: '#FAFAF8',
        hover: '#F1F1EE',
        hoverAlt: '#F4F4F1',
        selected: '#EAEAE5',

        line: '#E4E4E1',
        lineSoft: '#EDEDEA',
        lineInput: '#D8D8D4',
        lineDash: '#DCDCD8',
        lineGhost: '#E0E0DC',
        lineFirm: '#D6D6D2',

        ink: '#16181A',
        body: '#2A2D30',
        muted2: '#55595E',
        faint: '#8A8F95',
        faint2: '#A2A6AA',
        faint3: '#B6B9BC',

        green: '#2E7D5B',
        greenDeep: '#1F5A41',
        violet: '#6B5BA6',

        noticeBg: '#FDFAEC',
        noticeBgHov: '#FAF5DE',
        noticeBorder: '#E7DCB4',
        noticeRule: '#C9A227',
        noticeText: '#4A4127',
        noticeLink: '#6B5312',

        errBg: '#FCF6F4',
        errBorder: '#D9C9C4',
        errTitle: '#7A3520',
        errBody: '#6B4A3E',
        errMark: '#8C3A24',

        barEmpty: '#C9C9C4',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro: ['10.5px', { lineHeight: '1.4' }],
        mini: ['11px', { lineHeight: '1.4' }],
        xs: ['11.5px', { lineHeight: '1.45' }],
        sm: ['12.5px', { lineHeight: '1.5' }],
        base: ['13.5px', { lineHeight: '1.55' }],
        md: ['14.5px', { lineHeight: '1.55' }],
        lg: ['15px', { lineHeight: '1.6' }],
        xl: ['17px', { lineHeight: '1.5' }],
        '2xl': ['19px', { lineHeight: '1.4' }],
        '3xl': ['23px', { lineHeight: '1.35' }],
        '4xl': ['24px', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        label: '0.09em',
        ref: '0.01em',
        tight: '-0.015em',
      },
      maxWidth: {
        thread: '720px',
        doc: '760px',
        auth: '396px',
        modal: '520px',
      },
      spacing: {
        sidebar: '274px',
        drawer: '300px',
        topbar: '53px',
      },
      boxShadow: {
        drawer: '0 0 0 100vw rgba(22,24,26,.28)',
      },
    },
  },
  plugins: [],
};

export default config;
