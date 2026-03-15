import { test, expect } from '@playwright/test'
import { E2E_PROFILE } from '../fixtures/authenticated'

test.describe('memory-match minigame visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test('memory match initial state', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 15000 })

    await expect(page).toHaveScreenshot('memory-match.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
