import { test, expect } from './fixtures/authenticated'

test.describe('map page', () => {
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
