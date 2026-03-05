import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/rekenreis/i)
  })

  test('/play loads', async ({ page }) => {
    await page.goto('/play')
    await expect(page.locator('body')).toBeVisible()
  })
})
