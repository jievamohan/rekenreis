import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('unauthenticated visit to / redirects to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
    await expect(page).toHaveTitle(/rekenreis/i)
  })

  test('/login loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('.auth-page')).toBeVisible()
    await expect(page.getByRole('heading', { name: /inloggen/i })).toBeVisible()
  })

  test('/register loads', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('.auth-page')).toBeVisible()
    await expect(page.getByRole('heading', { name: /account aanmaken/i })).toBeVisible()
  })

  test('/forgot-password loads', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.locator('.auth-page')).toBeVisible()
    await expect(page.getByRole('heading', { name: /wachtwoord vergeten/i })).toBeVisible()
  })

  test('/play redirects to /login when unauthenticated', async ({ page }) => {
    await page.goto('/play')
    await expect(page).toHaveURL(/\/login/)
  })
})
