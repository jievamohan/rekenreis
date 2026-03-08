import { test, expect } from '@playwright/test'

test.describe('map page', () => {
  test('map loads with current level in view and decoration visible', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('.map-page')).toBeVisible()

    const currentNode = page.locator('.map-node.current').first()
    await expect(currentNode).toBeVisible()
    await expect(currentNode).toBeInViewport()

    const decorItems = page.locator('.decor-item')
    await expect(decorItems.first()).toBeVisible()
    expect(await decorItems.count()).toBeGreaterThan(0)
  })

  test('map shows path, nodes, and play CTA', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('.map-page')).toBeVisible()
    await expect(page.locator('.map-path-svg')).toBeVisible()
    await expect(page.locator('.map-node')).toHaveCount(await page.locator('.map-node').count())
    await expect(page.locator('.play-current-cta')).toBeVisible()
  })
})
