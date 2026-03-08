import { test, expect } from '@playwright/test'

test.describe('memory-match minigame visual', () => {
  test('memory match initial state', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 10000 })

    await expect(page).toHaveScreenshot('memory-match.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
