import { test, expect } from '@playwright/test'
import './debug-failure-hooks'

test.describe('auth', () => {
  test('login flow succeeds and redirects', async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000'
    const email = `auth-login-${Date.now()}@test.local`
    const password = 'e2e-password-123'

    await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForResponse((r) => r.url().includes('/sanctum/csrf-cookie'), { timeout: 15000 })

    await page.getByLabel(/kindnaam/i).fill('Auth Test')
    await page.getByLabel(/e-mail/i).fill(email)
    await page.getByLabel(/wachtwoord/i).first().fill(password)
    await page.getByLabel(/wachtwoord bevestigen/i).fill(password)
    await page.getByRole('button', { name: /registreren/i }).click()

    const registered = await page
      .waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 })
      .then(() => true)
      .catch(() => false)

    if (!registered) {
      await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForResponse((r) => r.url().includes('/sanctum/csrf-cookie'), { timeout: 15000 })
      await page.getByLabel(/e-mail/i).fill(email)
      await page.getByLabel(/wachtwoord/i).fill(password)
      await page.getByRole('button', { name: /inloggen/i }).click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
    }

    await page.goto(`${baseURL}/map`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expect(page).toHaveURL(/\/map/)
  })

  test('register flow succeeds', async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000'
    const email = `auth-reg-${Date.now()}@test.local`
    const password = 'e2e-password-123'

    await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForResponse((r) => r.url().includes('/sanctum/csrf-cookie'), { timeout: 15000 })

    await page.getByLabel(/kindnaam/i).fill('Register Test')
    await page.getByLabel(/e-mail/i).fill(email)
    await page.getByLabel(/wachtwoord/i).first().fill(password)
    await page.getByLabel(/wachtwoord bevestigen/i).fill(password)
    await page.getByRole('button', { name: /registreren/i }).click()

    await page.waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/register/)
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/map')
    await expect(page).toHaveURL(/\/login/)
  })

  test('forgot-password request shows success', async ({ page }) => {
    test.skip(!!process.env.CI, 'forgot-password API may fail in CI (mail/config)')
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForResponse((r) => r.url().includes('/sanctum/csrf-cookie'), { timeout: 15000 })

    const forgotResponse = page.waitForResponse(
      (r) => r.url().includes('/api/forgot-password') && r.request().method() === 'POST',
      { timeout: 15000 }
    )
    await page.getByLabel(/e-mail/i).fill('test@example.com')
    await page.getByRole('button', { name: /verstuur link/i }).click()
    await forgotResponse

    await expect(page.locator('.auth-success')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/als dit e-mailadres bij ons bekend is/i)).toBeVisible()
  })

  test('reset-password without token shows invalid link message', async ({ page }) => {
    await page.goto('/reset-password', { waitUntil: 'domcontentloaded', timeout: 15000 })

    await expect(page.getByText(/ongeldige of ontbrekende resetlink/i)).toBeVisible()
  })

  test('reset-password form with token param shows form', async ({ page }) => {
    await page.goto('/reset-password?token=test-token-123&email=test@test.local', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    })

    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/nieuw wachtwoord/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /wachtwoord opslaan/i })).toBeVisible()
  })
})
