import { test, expect } from '@playwright/test'

test.describe('coral minigame visual', () => {
  test('coral builder initial state', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-coral-builder"]')).toBeVisible({ timeout: 10000 })

    await expect(page).toHaveScreenshot('coral-builder.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
