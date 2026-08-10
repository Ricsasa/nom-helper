import type { Config } from 'tailwindcss';

// Deliberately empty of design tokens: every project on top of this boilerplate
// defines its own colours, spacing and type scale under theme.extend.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
