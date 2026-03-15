import { test, expect, E2E_PROFILE } from './fixtures/authenticated'
import './debug-failure-hooks'

test.describe('map page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })

  test('map loads with current level in view and decoration visible', async ({ page }) => {
    await page.goto('/map')
    // Wait for real map content (ClientOnly fallback only has .map-page)
    await expect(page.locator('.map-path-svg')).toBeVisible({ timeout: 15000 })

    const currentNode = page.locator('.map-node.current').first()
    await expect(currentNode).toBeVisible()
    await expect(currentNode).toBeInViewport()

    await expect(page.locator('.map-avatar')).toBeVisible()

    const decorItems = page.locator('.decor-item')
    await expect(decorItems.first()).toBeVisible()
    expect(await decorItems.count()).toBeGreaterThan(0)
  })

  test('map shows path, 200 nodes, and play CTA', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('.map-path-svg')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.map-node')).toHaveCount(200)
    await expect(page.locator('.play-current-cta')).toBeVisible()
  })
})
