import { test, expect } from '../fixtures/authenticated'

test.describe('map page visual', () => {
  test('map screenshot baseline', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('.map-page')).toBeVisible()
    await expect(page.locator('.map-avatar')).toBeVisible()
    await expect(page.locator('.map-path-svg')).toBeVisible()

    await expect(page).toHaveScreenshot('map.png', {
      maxDiffPixelRatio: 0.10,
    })
  })
})
