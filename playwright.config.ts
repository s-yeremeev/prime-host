import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const STORAGE_STATE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  // All tests share one real dev-environment account (one cart, one contact
  // list), so they must not run concurrently against it.
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://mcp.pananames-dev.com',
    actionTimeout: Number(process.env.ACTION_TIMEOUT_MS ?? 4_000),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
