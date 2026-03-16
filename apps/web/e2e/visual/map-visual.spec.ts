import { test, expect, E2E_PROFILE_LEVEL_1 } from '../fixtures/authenticated'

test.describe('map page visual', () => {
  test.beforeEach(async ({ page }) => {
    // Use currentLevel: 1 so map shows start position (matches baseline)
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE_LEVEL_1))
  })
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
