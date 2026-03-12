import { test as base } from '@playwright/test'
import { diagnoseOnFailure } from '../helpers/diagnose-failure'

export const E2E_PROFILE = {
  version: 1 as const,
  activeProfileId: 'p_e2e_auth',
  profiles: [
    {
      id: 'p_e2e_auth',
      name: 'E2E Test',
      avatarId: 'default' as const,
      maatjeId: 'wolkje' as const,
      progress: { bestScore: 0, levelProgress: {}, currentLevel: 1 },
      prefs: {
        lastMode: 'classic' as const,
        lastSkin: 'classic' as const,
        difficultyCeiling: 'upTo10' as const,
        hintsOn: true,
        soundOn: true,
        timersDisabled: true,
      },
      telemetryOptOut: true,
    },
  ],
}

export const test = base.extend<
  Record<string, never>,
  { authenticatedContext: import('@playwright/test').BrowserContext }
>({
  // Worker-scoped: run auth in same context (no storage save/load - avoids cookie persistence bugs)
  authenticatedContext: [
    async ({ browser }, use, testInfo) => {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000'
      const ctx = await browser.newContext({ baseURL })
      const page = await ctx.newPage()
      const csrfPromise = page.waitForResponse(
        (r) => r.url().includes('/sanctum/csrf-cookie'),
        { timeout: 15000 }
      )
      await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await csrfPromise
      const user = {
        email: `e2e-w${testInfo.workerIndex}-${Date.now()}@test.local`,
        password: 'e2e-password-123',
        name: `E2E W${testInfo.workerIndex}`,
      }
      await page.getByLabel(/kindnaam/i).fill(user.name)
      await page.getByLabel(/e-mail/i).fill(user.email)
      await page.getByLabel(/wachtwoord/i).first().fill(user.password)
      await page.getByLabel(/wachtwoord bevestigen/i).fill(user.password)
      await page.getByRole('button', { name: /registreren/i }).click()
      const registered = await page.waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 }).then(() => true).catch(() => false)
      if (!registered) {
        const loginCsrf = page.waitForResponse((r) => r.url().includes('/sanctum/csrf-cookie'), { timeout: 15000 })
        await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
        await loginCsrf
        await page.getByLabel(/e-mail/i).fill(user.email)
        await page.getByLabel(/wachtwoord/i).fill(user.password)
        await page.getByRole('button', { name: /inloggen/i }).click()
        await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
      }
      await page.goto(`${baseURL}/map`, { waitUntil: 'networkidle', timeout: 15000 })
      await page.evaluate((s) => localStorage.setItem('rekenreis_profiles_v1', s), JSON.stringify(E2E_PROFILE))
      await page.close()
      await use(ctx)
    },
    { scope: 'worker' },
  ],
  page: async ({ authenticatedContext }, use, testInfo) => {
    const page = await authenticatedContext.newPage()
    // Forward [xsrf-client] console messages to stderr for CI logging
    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('[xsrf-client]')) {
        process.stderr.write(`[e2e-console] ${text}\n`)
      }
    })
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
    await use(page)
    // On any failure, capture diagnostic for CI (url, hasAuthPage, etc.)
    if (testInfo.status !== 'passed' && testInfo.status !== 'skipped') {
      try {
        const slug = testInfo.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 40)
        const diag = await diagnoseOnFailure(page, `fail-${slug}`)
        console.error(`E2E DIAGNOSE [${testInfo.title}]: ${JSON.stringify(diag)}`)
      } catch {
        // ignore
      }
    }
  },
})

export { expect } from '@playwright/test'
