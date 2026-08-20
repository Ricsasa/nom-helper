import { defineConfig } from 'vitest/config';

/**
 * Covers the data access layer only. The component and API tests of the
 * boilerplate stay on Jest, which already runs them in jsdom.
 */
export default defineConfig({
  test: {
    include: ['src/lib/db/__tests__/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    // The suites share one local database. Running the files one at a time is
    // what keeps a summary assertion from counting another file's rows.
    fileParallelism: false,
  },
});
