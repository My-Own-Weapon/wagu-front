import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.ts?(x)'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
    '^.+\\.(css|scss|sass)$': 'jest-transform-stub',
    '^.+\\.(svg)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
