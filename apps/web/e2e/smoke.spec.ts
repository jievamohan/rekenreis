import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/rekenreis/i)
  })

  test('index shows maatje when asset available', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.home')).toBeVisible()
    const maatje = page.locator('.home-maatje, .maatje-avatar').first()
    await expect(maatje).toBeVisible({ timeout: 5000 })
  })

  test('/start loads with maatje', async ({ page }) => {
    await page.goto('/start')
    await expect(page.locator('.start-page')).toBeVisible()
    const maatje = page.locator('.start-maatje, .maatje-avatar').first()
    await expect(maatje).toBeVisible({ timeout: 5000 })
  })

  test('/play loads', async ({ page }) => {
    await page.goto('/play')
    await expect(page.locator('body')).toBeVisible()
  })
})
