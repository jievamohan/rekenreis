import { test, expect } from '@playwright/test'

const PROFILE_FISH_FEED = {
  version: 1 as const,
  activeProfileId: 'p_vis_fish',
  profiles: [
    {
      id: 'p_vis_fish',
      name: 'Fish Visual',
      avatarId: 'default' as const,
      maatjeId: 'wolkje' as const,
      progress: { bestScore: 0, levelProgress: {}, currentLevel: 3 },
      prefs: {
        lastMode: 'classic' as const,
        lastSkin: 'classic' as const,
        difficultyCeiling: 'upTo10' as const,
        hintsOn: true,
        soundOn: true,
        timersDisabled: true,
      },
      telemetryOptOut: true,
    },
  ],
}

test.describe('fish-feed visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(PROFILE_FISH_FEED))
  })

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
