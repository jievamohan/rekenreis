import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Rekenreis/i)
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
  })
})
