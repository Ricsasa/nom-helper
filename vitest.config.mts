import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));

/**
 * Two projects, because the two suites need different environments. The data
 * access tests talk to a local Supabase instance and run in node; the interface
 * tests render components and run in jsdom.
 */
export default defineConfig({
  resolve: {
    alias: { '@': src },
  },
  // tsconfig keeps jsx: "preserve" for Next, so the test transform has to do
  // the JSX conversion itself. Vite 8 does this through oxc.
  oxc: {
    jsx: { runtime: 'automatic' },
  },
  test: {
    projects: [
      {
        resolve: { alias: { '@': src } },
        test: {
          name: 'db',
          include: ['src/lib/db/__tests__/**/*.test.ts'],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
          // The suites share one local database. Running the files one at a
          // time is what keeps a summary assertion from counting another
          // file's rows.
          fileParallelism: false,
        },
      },
      {
        resolve: { alias: { '@': src } },
        oxc: { jsx: { runtime: 'automatic' } },
        test: {
          name: 'ui',
          include: ['src/__tests__/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ui.ts'],
        },
      },
    ],
  },
});
