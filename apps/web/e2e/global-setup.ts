import { chromium, type FullConfig } from '@playwright/test'

const E2E_USER = { email: 'e2e@test.local', password: 'e2e-password-123', name: 'E2E Test' }
const STORAGE_PATH = 'e2e/.auth.json'

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  const browser = await chromium.launch()
  const storage = await browser.newContext()

  try {
    const page = await storage.newPage()
    await page.goto(`${baseURL}/register`)
    await page.getByLabel(/kindnaam/i).fill(E2E_USER.name)
    await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
    await page.getByLabel(/wachtwoord/i).first().fill(E2E_USER.password)
    await page.getByLabel(/wachtwoord bevestigen/i).fill(E2E_USER.password)
    await page.getByRole('button', { name: /registreren/i }).click()
    const registered = await page
      .waitForURL((url) => !url.pathname.includes('/register'), { timeout: 8000 })
      .then(() => true)
      .catch(() => false)
    if (!registered) {
      await page.goto(`${baseURL}/login`)
      await page.getByLabel(/e-mail/i).fill(E2E_USER.email)
      await page.getByLabel(/wachtwoord/i).fill(E2E_USER.password)
      await page.getByRole('button', { name: /inloggen/i }).click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 8000 })
    }
    await storage.storageState({ path: STORAGE_PATH })
  } finally {
    await browser.close()
  }
}
