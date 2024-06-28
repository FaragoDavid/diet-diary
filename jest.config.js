/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./src/test-setup.ts'],
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          noImplicitAny: false,
          isolatedModules: true,
        },
        diagnostics: {
          exclude: ['src/test-setup.ts', '**/*.(spec|test).ts'],
        },
      },
    ],
  },
};
