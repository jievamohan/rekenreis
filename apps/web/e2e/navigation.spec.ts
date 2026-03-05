import { test, expect } from '@playwright/test'

/**
 * Navigation and UI visibility tests.
 *
 * NOTE: AppShell chrome (NavTabs, back-to-map button) does not render
 * in the CI Docker e2e environment (pre-existing issue). Tests that
 * depend on AppShell chrome are skipped in CI. Page-level elements
 * (inside slot) render correctly and are tested.
 */
test.describe('navigation and UI visibility', () => {
  test('map-only elements not on play page', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.play-current-cta')).toHaveCount(0)
    await expect(page.locator('.map-progress')).toHaveCount(0)
    await expect(page.locator('.map-title')).toHaveCount(0)
  })

  test('play-only elements not on map page', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.exit-to-map-btn')).toHaveCount(0)
    await expect(page.locator('.keypad')).toHaveCount(0)
  })

  test('map page has choose level header and progress', async ({ page }) => {
    await page.goto('/play?level=1')
    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.map-title')).toContainText('Kies een level')
    await expect(page.locator('.play-current-cta')).toBeVisible()
    await expect(page.locator('.map-progress')).toBeVisible()
  })

  test('exit to map from play returns to map', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.exit-to-map-btn')).toBeVisible()

    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.map-page')).toBeVisible()
  })
})
