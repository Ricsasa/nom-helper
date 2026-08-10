module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'app/api/**/*.ts',
    'components/**/*.tsx',
    '!lib/translations/**',
    '!**/*.d.ts',
  ],
}
