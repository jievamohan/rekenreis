import { test, expect } from '../fixtures/authenticated'

test.describe('memory-match minigame visual', () => {
  test('memory match initial state', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 15000 })

    await expect(page).toHaveScreenshot('memory-match.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
