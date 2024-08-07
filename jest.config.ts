/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 10000,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['./jest.setup.ts']
}
