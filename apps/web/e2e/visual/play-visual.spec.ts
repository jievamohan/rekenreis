import { test, expect, E2E_PROFILE } from '../fixtures/authenticated'

test.describe('play page visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test('level minigame screenshot', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.minigame-renderer')).toBeVisible()

    await expect(page).toHaveScreenshot('play-minigame.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
