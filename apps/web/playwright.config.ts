import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, devices } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// playwright-report is writable in CI (e2e/ is read-only when mounted)
// CI e2e container uses /app; explicit path avoids resolution issues across workers
const AUTH_STATE_PATH =
  process.env.CI && process.env.BASE_URL?.includes('web:3000')
    ? '/app/playwright-report/.auth.json'
    : path.join(__dirname, 'playwright-report', '.auth.json')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/e2e/smoke.spec.ts'],
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_PATH,
      },
      testIgnore: [
        '**/e2e/smoke.spec.ts',
        '**/e2e/visual/**',
        ...(process.env.CI ? ['**/e2e/profile-maatje.spec.ts'] : []),
      ],
    },
    {
      name: 'visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        storageState: AUTH_STATE_PATH,
      },
      testMatch: ['**/e2e/visual/**/*.spec.ts'],
    },
  ],
})
