import { test, expect } from '@playwright/test'
import { E2E_PROFILE } from '../fixtures/authenticated'

test.describe('map page visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
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
