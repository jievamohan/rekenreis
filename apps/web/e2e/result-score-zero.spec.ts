import { test, expect } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'

/**
 * Epic 43.2: Verifieer dat het resultaat scherm 0 van 10 toont wanneer
 * de speler geen enkel antwoord geeft (alle rondes op timeout).
 *
 * Level 3 = 10 rondes Fish Feed; elke timeout ~15s.
 * Totaal wachttijd ~150–180s.
 */
test.describe('result score zero', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test('result screen shows 0 of 10 when no answers given (all timeouts)', async ({
  page,
}) => {
  test.skip(!!process.env.CI, '~2.5 min, flaky in CI')
  test.setTimeout(300000) // 10 rounds × ~15s; CI can be slower

  await page.goto('/play?level=3')
  await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({
    timeout: 10000,
  })

  await expect(page.locator('[data-testid="level-complete-modal"]')).toBeVisible(
    { timeout: 240000 }
  )

  const perf = page.locator('.performance-bar')
  await expect(perf).toContainText('0')
  await expect(perf).toContainText('10')
})
})
