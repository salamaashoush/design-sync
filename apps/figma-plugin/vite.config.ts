import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  plugins: [preact()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test-setup.ts'],
    includeSource: ['src/**/*.{ts,tsx}'],
    coverage: {
      reporter: ['text-summary', 'text'],
    },
    mockReset: true,
    restoreMocks: true,
  },
});
