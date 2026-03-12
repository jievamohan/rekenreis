import { test, expect } from './fixtures/authenticated'

/**
 * Epic 43.2: Verifieer dat het resultaat scherm 0 van 10 toont wanneer
 * de speler geen enkel antwoord geeft (alle rondes op timeout).
 *
 * Level 3 = 10 rondes Fish Feed; elke timeout ~15s.
 * Totaal wachttijd ~150–180s.
 */
test('result screen shows 0 of 10 when no answers given (all timeouts)', async ({
  page,
}) => {
  test.setTimeout(200000)

  await page.goto('/play?level=3')
  await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({
    timeout: 10000,
  })

  await expect(page.locator('[data-testid="level-complete-modal"]')).toBeVisible(
    { timeout: 180000 }
  )

  const perf = page.locator('.performance-bar')
  await expect(perf).toContainText('0')
  await expect(perf).toContainText('10')
})
