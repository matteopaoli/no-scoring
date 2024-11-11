import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default defineConfig({
  test: {
    include: ['./tests/integration/**/*.test.ts'],
    // setupFiles: ['./vitest.setup.ts'],
  },
});
