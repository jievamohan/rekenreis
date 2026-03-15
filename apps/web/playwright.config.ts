import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, devices } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_STATE_PATH = path.join(__dirname, 'playwright-report', '.auth.json')

// Quickfail: E2E_QUICKFAIL=N runs subset (5→7→11→20→50→all). Scale up as auth stabilizes.
const QUICKFAIL = process.env.E2E_QUICKFAIL ? parseInt(process.env.E2E_QUICKFAIL, 10) : 0

const QUICKFAIL_PROJECTS: Record<number, { name: string; testMatch: string[]; storageState?: string }[]> = {
  5: [{ name: 'smoke', testMatch: ['**/e2e/smoke.spec.ts'] }],
  7: [
    { name: 'smoke', testMatch: ['**/e2e/smoke.spec.ts'] },
    { name: 'quickfail-auth', testMatch: ['**/e2e/map.spec.ts'], storageState: AUTH_STATE_PATH },
  ],
  11: [
    { name: 'smoke', testMatch: ['**/e2e/smoke.spec.ts'] },
    { name: 'quickfail-auth', testMatch: ['**/e2e/map.spec.ts', '**/e2e/navigation.spec.ts'], storageState: AUTH_STATE_PATH },
  ],
  20: [
    { name: 'smoke', testMatch: ['**/e2e/smoke.spec.ts'] },
    { name: 'quickfail-auth', testMatch: ['**/e2e/map.spec.ts', '**/e2e/navigation.spec.ts', '**/e2e/play.spec.ts', '**/e2e/level-complete.spec.ts'], storageState: AUTH_STATE_PATH },
  ],
  50: [
    { name: 'smoke', testMatch: ['**/e2e/smoke.spec.ts'] },
    { name: 'quickfail-auth', testMatch: ['**/e2e/map.spec.ts', '**/e2e/navigation.spec.ts', '**/e2e/play.spec.ts', '**/e2e/level-complete.spec.ts', '**/e2e/minigame.spec.ts', '**/e2e/app-flow.spec.ts', '**/e2e/mechanic-upgrades.spec.ts', '**/e2e/result-score-zero.spec.ts'], storageState: AUTH_STATE_PATH },
  ],
}

const quickfailConfig =
  QUICKFAIL > 0 && QUICKFAIL_PROJECTS[QUICKFAIL]
    ? QUICKFAIL_PROJECTS[QUICKFAIL].map((p) => ({
        name: p.name,
        use: {
          ...devices['Desktop Chrome'],
          ...(p.storageState ? { storageState: p.storageState } : {}),
        },
        testMatch: p.testMatch,
      }))
    : null

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? (QUICKFAIL <= 11 ? 1 : 4) : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects:
    quickfailConfig ?? [
      { name: 'smoke', use: { ...devices['Desktop Chrome'] }, testMatch: ['**/e2e/smoke.spec.ts'] },
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], storageState: AUTH_STATE_PATH },
        testIgnore: [
          '**/e2e/smoke.spec.ts',
          '**/e2e/visual/**',
          ...(process.env.CI ? ['**/e2e/profile-maatje.spec.ts'] : []),
        ],
      },
      {
        name: 'visual',
        use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, storageState: AUTH_STATE_PATH },
        testMatch: ['**/e2e/visual/**/*.spec.ts'],
      },
    ],
})
