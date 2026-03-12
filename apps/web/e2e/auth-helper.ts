/**
 * Per-worker auth flow: register/login and save storage state.
 * Each worker gets its own user/session to avoid Laravel session conflicts.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Browser } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLAYWRIGHT_REPORT_DIR = path.join(__dirname, '..', 'playwright-report')

export function authStoragePath(workerIndex: number): string {
  const safeIndex = Math.max(0, Math.min(99, Math.floor(Number(workerIndex)) || 0))
  return path.join(PLAYWRIGHT_REPORT_DIR, `auth-worker-${safeIndex}.json`)
}

export function e2eUserForWorker(workerIndex: number) {
  return {
    email: `e2e-w${workerIndex}-${Date.now()}@test.local`,
    password: 'e2e-password-123',
    name: `E2E Worker ${workerIndex}`,
  }
}

export async function runAuthFlow(
  browser: Browser,
  baseURL: string,
  storagePath: string,
  workerIndex: number
): Promise<void> {
  fs.mkdirSync(path.dirname(storagePath), { recursive: true })
  const user = e2eUserForWorker(workerIndex)
  const context = await browser.newContext({ baseURL })
  try {
    const page = await context.newPage()
    const csrfPromise = page.waitForResponse(
      (res) => res.url().includes('/sanctum/csrf-cookie'),
      { timeout: 15000 }
    )
    await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await csrfPromise

    await page.getByLabel(/kindnaam/i).fill(user.name)
    await page.getByLabel(/e-mail/i).fill(user.email)
    await page.getByLabel(/wachtwoord/i).first().fill(user.password)
    await page.getByLabel(/wachtwoord bevestigen/i).fill(user.password)
    await page.getByRole('button', { name: /registreren/i }).click()

    const registered = await page
      .waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 })
      .then(() => true)
      .catch(() => false)

    if (!registered) {
      const loginCsrfPromise = page.waitForResponse(
        (res) => res.url().includes('/sanctum/csrf-cookie'),
        { timeout: 15000 }
      )
      await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await loginCsrfPromise
      await page.getByLabel(/e-mail/i).fill(user.email)
      await page.getByLabel(/wachtwoord/i).fill(user.password)
      await page.getByRole('button', { name: /inloggen/i }).click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
    }

    await page.goto(`${baseURL}/map`, { waitUntil: 'domcontentloaded', timeout: 10000 })
    const onMap = await page.evaluate(() => !window.location.pathname.includes('/login'))
    if (!onMap) {
      throw new Error(`auth failed for worker ${workerIndex} — still on login`)
    }

    await page.evaluate((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
    await context.storageState({ path: storagePath })
  } finally {
    await context.close()
  }
}
