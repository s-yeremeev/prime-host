import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import type { QuizTestOptions } from './src/fixtures/quiz.fixture';

dotenv.config();

export default defineConfig<QuizTestOptions>({
  testDir: './tests',
  timeout: 180_000, // generous: a full A/B path can be long
  retries: 0, // a retry would create a second real user/booking — see docs/APPROACH.md
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://mcp.pananames-dev.com',
    maxSteps: Number(process.env.MAX_STEPS ?? 40),
    settleMs: Number(process.env.SETTLE_MS ?? 700),
    actionTimeout: Number(process.env.ACTION_TIMEOUT_MS ?? 4_000),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
