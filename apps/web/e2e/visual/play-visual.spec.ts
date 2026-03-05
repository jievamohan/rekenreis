import { test, expect } from '@playwright/test'

test.describe('play page visual', () => {
  test('keypad mode screenshot', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.keypad')).toBeVisible()

    await expect(page).toHaveScreenshot('play-keypad.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
