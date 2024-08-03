import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: ['**/domain/**/*.repository.ts', '**/domain/**/*.gateway.ts'],
      include: [
        '**/domain/**',
        '**/application/**',
        '**/infrastructure/http/modules/**',
      ],
      reporter: ['json-summary', 'json', 'html', 'text-summary'],
      reportOnFailure: true,
      thresholds: {
        lines: 80,
        branches: 50,
        functions: 80,
        statements: 80,
      },
    },
    include: ['**/*.spec.ts', '**/*.int-spec.ts', '**/*.e2e-spec.ts'],
    pool: 'forks',
    globals: true,
    dir: './src',
    root: './',
    hookTimeout: 60000,
    minWorkers: 1,
    maxWorkers: 1,
    env: {
      OTP_EXPIRATION: '300',
      JWT_EXPIRATION: '300',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@test': '/test',
    },
  },
  plugins: [
    tsConfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
