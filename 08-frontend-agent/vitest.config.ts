import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Allow tests to import from src directory
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      // Help resolve imports from outputs/tests/ to src/
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});