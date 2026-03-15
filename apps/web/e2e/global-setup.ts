/**
 * Global setup: wait for web/sanctum, then run auth and save storage state.
 * With 1 worker (quickfail), shared auth works. Scale workers only when auth is stable.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium, type FullConfig } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLAYWRIGHT_REPORT_DIR = path.join(__dirname, '..', 'playwright-report')
const STORAGE_PATH = path.join(PLAYWRIGHT_REPORT_DIR, '.auth.json')

const E2E_USER = {
  email: `e2e-${Date.now()}@test.local`,
  password: 'e2e-password-123',
  name: 'E2E Test',
}

const LOG_PREFIX = '[e2e-global-setup]'

function log(msg: string, data?: Record<string, unknown>) {
  const line = data ? `${LOG_PREFIX} ${msg} ${JSON.stringify(data)}` : `${LOG_PREFIX} ${msg}`
  console.log(line)
}

async function waitForWeb(baseURL: string, maxAttempts = 6): Promise<void> {
  log('Waiting for web', { baseURL, maxAttempts })
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseURL}/start`, { redirect: 'manual' })
      if (res.status < 500) {
        log('Web ready', { attempt: i + 1, status: res.status })
        return
      }
      log('Web not ready', { attempt: i + 1, status: res.status })
    } catch (e) {
      log('Web fetch error', { attempt: i + 1, error: String(e) })
    }
    await new Promise((r) => setTimeout(r, 5000))
  }
  throw new Error(`${LOG_PREFIX} web not ready after ${maxAttempts} attempts`)
}

async function waitForSanctum(baseURL: string, maxAttempts = 5): Promise<void> {
  const url = `${baseURL.replace(/\/$/, '')}/sanctum/csrf-cookie`
  log('Waiting for sanctum', { url, maxAttempts })
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { method: 'GET', credentials: 'include' })
      if (res.status === 204) {
        log('Sanctum ready', { attempt: i + 1, status: res.status })
        return
      }
      const body = await res.text().catch(() => '')
      log('Sanctum not ready', { attempt: i + 1, status: res.status, body: body.slice(0, 200) })
    } catch (e) {
      log('Sanctum fetch error', { attempt: i + 1, error: String(e) })
    }
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error(`${LOG_PREFIX} sanctum/csrf-cookie not ready after ${maxAttempts} attempts`)
}

export default async function globalSetup(config: FullConfig) {
  const baseURL =
    process.env.BASE_URL ||
    (config.projects[0]?.use as { baseURL?: string })?.baseURL ||
    'http://localhost:3000'
  await waitForWeb(baseURL)
  await waitForSanctum(baseURL)

  // Run auth and save storage state (used by projects with storageState)
  const browser = await chromium.launch()
  const context = await browser.newContext({ baseURL })
  try {
    const page = await context.newPage()
    const csrfPromise = page.waitForResponse(
      (res) => res.url().includes('/sanctum/csrf-cookie'),
      { timeout: 15000 }
    )
    await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await csrfPromise

    await page.getByLabel(/kindnaam/i).fill(E2E_USER.name)
    await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
    await page.getByLabel(/wachtwoord/i).first().fill(E2E_USER.password)
    await page.getByLabel(/wachtwoord bevestigen/i).fill(E2E_USER.password)
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
      await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
      await page.getByLabel(/wachtwoord/i).fill(E2E_USER.password)
      await page.getByRole('button', { name: /inloggen/i }).click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
    }

    await page.goto(`${baseURL}/map`, { waitUntil: 'domcontentloaded', timeout: 10000 })
    const onMap = await page.evaluate(() => !window.location.pathname.includes('/login'))
    if (!onMap) {
      throw new Error(`${LOG_PREFIX} auth failed — still on login`)
    }

    await page.evaluate((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
    fs.mkdirSync(PLAYWRIGHT_REPORT_DIR, { recursive: true })
    await context.storageState({ path: STORAGE_PATH })
    log('Storage state saved', { path: STORAGE_PATH })
  } finally {
    await browser.close()
  }
}
