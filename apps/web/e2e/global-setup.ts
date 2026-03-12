import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium, type FullConfig } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STORAGE_PATH = path.join(__dirname, '.auth.json')

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

const PLAYWRIGHT_REPORT_DIR = path.join(__dirname, '..', 'playwright-report')

/** Write diagnostic to file for CI artifact (exposed when tests fail). Uses playwright-report so pwuser can write. */
function writeDiagnostic(diag: Record<string, unknown>) {
  const outPath = path.join(PLAYWRIGHT_REPORT_DIR, 'global-setup-diagnostic.json')
  try {
    fs.mkdirSync(PLAYWRIGHT_REPORT_DIR, { recursive: true })
    fs.writeFileSync(outPath, JSON.stringify(diag, null, 2), 'utf-8')
    log('Diagnostic written', { path: outPath })
  } catch (e) {
    log('Failed to write diagnostic', { error: String(e) })
  }
}

/** Extract exception type and message from Laravel error HTML for diagnostic. */
function extractSanctumErrorSummary(body: string): { exception?: string; message?: string } {
  if (!body || body.length < 100) return {}
  const exception = body.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]?.trim()
  const message = body.match(/<p class="text-xl font-light[^"]*">([^<]+)<\/p>/)?.[1]?.trim()
  return { exception, message }
}

/** Write full sanctum error response HTML to a separate file for downloadable CI artifact. No truncation. */
function writeSanctumErrorHtml(body: string) {
  if (!body) return
  const outPath = path.join(PLAYWRIGHT_REPORT_DIR, 'sanctum-error-response.html')
  try {
    fs.mkdirSync(PLAYWRIGHT_REPORT_DIR, { recursive: true })
    fs.writeFileSync(outPath, body, 'utf-8')
    log('Sanctum error HTML written', { path: outPath, length: body.length })
  } catch (e) {
    log('Failed to write sanctum error HTML', { error: String(e) })
  }
}

/** Wait for web to be ready (CI: web may still be starting after healthcheck). */
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
}

/** Wait for sanctum CSRF endpoint to return 204 (CI: API session may lag behind healthcheck). */
async function waitForSanctum(
  baseURL: string,
  maxAttempts = 5,
  diag?: Record<string, unknown>
): Promise<void> {
  const url = `${baseURL.replace(/\/$/, '')}/sanctum/csrf-cookie`
  log('Waiting for sanctum', { url, maxAttempts })
  let lastStatus = 0
  let lastBody = ''
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { method: 'GET', credentials: 'include' })
      lastStatus = res.status
      if (res.status === 204) {
        log('Sanctum ready', { attempt: i + 1, status: res.status })
        return
      }
      lastBody = await res.text().catch(() => '')
      log('Sanctum not ready', { attempt: i + 1, status: res.status, body: lastBody.slice(0, 500) })
      if (diag) {
        diag.waitForSanctumLastStatus = res.status
        diag.waitForSanctumLastBody = lastBody.slice(0, 6000)
      }
    } catch (e) {
      log('Sanctum fetch error', { attempt: i + 1, error: String(e) })
      if (diag) diag.waitForSanctumError = String(e)
    }
    await new Promise((r) => setTimeout(r, 3000))
  }
  if (diag) {
    diag.waitForSanctumLastStatus = lastStatus
    diag.waitForSanctumLastBody = lastBody.slice(0, 6000)
    diag.sanctumErrorSummary = extractSanctumErrorSummary(lastBody)
  }
  writeSanctumErrorHtml(lastBody)
  throw new Error(`${LOG_PREFIX} sanctum/csrf-cookie did not return 204 after ${maxAttempts} attempts (last: ${lastStatus})`)
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  const diag: Record<string, unknown> = { baseURL, user: E2E_USER.email, steps: [] as string[] }

  try {
    await waitForWeb(baseURL)
    diag.steps.push('waitForWeb done')
    await waitForSanctum(baseURL, 5, diag)
    diag.steps.push('waitForSanctum done')

    const browser = await chromium.launch()
    const storage = await browser.newContext({ baseURL })

    try {
      const page = await storage.newPage()

      // Register: capture CSRF response and any API errors
      log('Navigating to register', { url: `${baseURL}/register` })
      const csrfPromise = page.waitForResponse(
        (res) => res.url().includes('/sanctum/csrf-cookie'),
        { timeout: 15000 }
      ).then(async (res) => {
        const status = res.status()
        log('CSRF cookie response', { url: res.url(), status })
        diag.csrfStatus = status
        diag.csrfUrl = res.url()
        if (status !== 204) {
          diag.csrfError = `Expected 204, got ${status}`
          throw new Error(`${LOG_PREFIX} CSRF cookie failed: status ${status}`)
        }
        return res
      }).catch((e) => {
        log('CSRF wait failed', { error: String(e) })
        diag.csrfError = String(e)
        throw e
      })

      await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await csrfPromise

      // Check XSRF token in cookies
      const hasXsrf = await page.evaluate(() => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
        return !!match
      })
      log('XSRF token in cookies after CSRF fetch', { hasXsrf, cookies: await page.evaluate(() => document.cookie) })
      diag.hasXsrfAfterCsrf = hasXsrf

      log('Filling register form', { email: E2E_USER.email })
      await page.getByLabel(/kindnaam/i).fill(E2E_USER.name)
      await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
      await page.getByLabel(/wachtwoord/i).first().fill(E2E_USER.password)
      await page.getByLabel(/wachtwoord bevestigen/i).fill(E2E_USER.password)
      await page.getByRole('button', { name: /registreren/i }).click()

      const registered = await page
        .waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 })
        .then(() => true)
        .catch(() => false)

      const urlAfterRegister = page.url()
      log('After register submit', { registered, url: urlAfterRegister })
      diag.registered = registered
      diag.urlAfterRegister = urlAfterRegister

      if (!registered) {
        diag.steps.push('register failed, trying login')
        log('Register failed, attempting login')
        const loginCsrfPromise = page.waitForResponse(
          (res) => res.url().includes('/sanctum/csrf-cookie'),
          { timeout: 15000 }
        ).then(async (res) => {
          log('Login CSRF response', { status: res.status() })
          return res
        })
        await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
        await loginCsrfPromise
        await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
        await page.getByLabel(/wachtwoord/i).fill(E2E_USER.password)
        await page.getByRole('button', { name: /inloggen/i }).click()
        await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
        diag.urlAfterLogin = page.url()
      }

      await page.goto(`${baseURL}/map`, { waitUntil: 'domcontentloaded', timeout: 10000 })
      const onMap = await page.evaluate(() => !window.location.pathname.includes('/login'))
      const currentUrl = page.url()
      const cookies = await page.context().cookies()
      log('Before save', { onMap, url: currentUrl, cookieCount: cookies.length, cookieNames: cookies.map((c) => c.name) })
      diag.onMap = onMap
      diag.urlBeforeSave = currentUrl
      diag.cookieCount = cookies.length
      diag.cookieNames = cookies.map((c) => c.name)

      if (!onMap) {
        diag.error = 'auth failed — still on login after register/login flow'
        writeDiagnostic(diag)
        throw new Error(`${LOG_PREFIX} auth failed — still on login after register/login flow. url=${currentUrl} cookies=${cookies.length}`)
      }

      await page.evaluate((schema: string) => {
        localStorage.setItem('rekenreis_profiles_v1', schema)
      }, JSON.stringify(E2E_PROFILE))
      await storage.storageState({ path: STORAGE_PATH })
      diag.storageStatePath = STORAGE_PATH
      diag.storageStateExists = fs.existsSync(STORAGE_PATH)
      log('Storage state saved', { path: STORAGE_PATH, exists: diag.storageStateExists })
    } finally {
      await browser.close()
    }
  } catch (e) {
    diag.finalError = String(e)
    const body = diag.waitForSanctumLastBody as string | undefined
    if (body) {
      const summary = extractSanctumErrorSummary(body)
      if (summary) diag.sanctumErrorSummary = summary
    }
    writeDiagnostic(diag)
    throw e
  }
}
