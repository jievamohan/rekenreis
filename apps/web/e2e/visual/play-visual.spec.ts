import { test, expect } from '@playwright/test'

test.describe('play page visual', () => {
  test('level minigame screenshot', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.minigame-renderer')).toBeVisible()

    await expect(page).toHaveScreenshot('play-minigame.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
