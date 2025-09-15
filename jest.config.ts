// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // for @ alias support
  },
  testMatch: ['**/__test__/**/*.test.ts'], // or *.spec.ts
  moduleFileExtensions: ['ts', 'js'],
};

export default config;
