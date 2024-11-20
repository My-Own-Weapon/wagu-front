import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**',
      '**/tests-examples/**',
    ],
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
