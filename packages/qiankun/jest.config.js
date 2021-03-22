module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '/dist/'],
};
