import { test, expect } from '../fixtures/authenticated'

test.describe('fish-feed visual', () => {

  test('fish-feed aquarium shows multiple swimming fish', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })

    const ambientFish = page.locator('[data-testid="minigame-fish-feed"] .ambient-fish')
    await expect(ambientFish.first()).toBeVisible({ timeout: 5000 })
    const count = await ambientFish.count()
    expect(count).toBeGreaterThanOrEqual(2)

    await expect(page.locator('[data-testid="minigame-fish-feed"] .aquarium')).toHaveScreenshot(
      'fish-feed-aquarium.png',
      { maxDiffPixelRatio: 0.12 }
    )
  })
})
