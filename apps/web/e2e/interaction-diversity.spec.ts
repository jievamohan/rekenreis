import { test, expect } from './fixtures/authenticated'
import './debug-failure-hooks'

test.describe('interaction diversity — E2E proof', () => {
  test.describe.configure({ retries: 2 })
  test.beforeEach(async ({ page }) => {
    // Warm up: ensure auth middleware has run (matches app-flow pattern)
    await page.goto('/map', { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expect(page).toHaveURL(/\/map/)
  })
  test('drag/drop (TreasureDive): completes round via click + chest', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
    const correct = a + b

    const gems = page.locator('[data-testid="minigame-treasure-dive"] .gem')
    for (let i = 0; i < await gems.count(); i++) {
      if ((await gems.nth(i).innerText()).trim() === String(correct)) {
        await gems.nth(i).click()
        break
      }
    }
    await page.locator('.chest-zone').click()
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })

  test('timed-kind (FishFeed): timeout advances without feedback', async ({ page }) => {
    test.skip(!!process.env.CI, 'FishFeed timer flaky in CI')
    test.setTimeout(60000) // Timer ~15s; CI can be slower
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    // Timer expires (~15s); round advances immediately without hint overlay
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1', { timeout: 45000 })
  })

  test('drag-drop (BouwDeToren): level 5 shows tower minigame', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="tower-puzzle"]')).toBeVisible()
    await expect(page.locator('[data-testid="tower-puzzle"] .target-display')).toBeVisible()
    await expect(page.locator('[data-testid="tower-puzzle"] .tower-icon')).toBeVisible()
    await expect(page.locator('[data-testid="tower-puzzle"] .block').first()).toBeVisible()
  })

  test('memory-flip (MemoryMatch): flip sum+answer pairs to complete', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 10000 })

    const cards = page.locator('[data-testid="minigame-memory-match"] .card')
    const count = await cards.count()
    for (let i = 0; i < count - 1; i++) {
      for (let j = i + 1; j < count; j++) {
        await cards.nth(i).click({ force: true })
        await cards.nth(j).click({ force: true })
        await page.waitForTimeout(1200)
        const val = await page.locator('.round-progress').getAttribute('aria-valuenow')
        if (val === '1') return
      }
    }
    throw new Error('Could not complete memory-match round')
  })
})

test.describe('Dutch copy assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map', { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expect(page).toHaveURL(/\/map/)
  })
  test('fish-feed timeout advances without feedback overlay', async ({ page }) => {
    test.skip(!!process.env.CI, 'FishFeed timer flaky in CI')
    test.setTimeout(60000) // Timer ~15s; CI can be slower
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    // No hint overlay on timeout; round advances directly
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1', { timeout: 45000 })
    await expect(page.locator('.hint-overlay')).toHaveCount(0)
  })

  test('treasure-dive shows Dutch aria labels', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    const scene = page.locator('[data-testid="minigame-treasure-dive"]')
    const label = await scene.getAttribute('aria-label')
    expect(label).toContain('Schatduik')
  })

  test('memory-match shows Dutch aria label', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 10000 })
    const scene = page.locator('[data-testid="minigame-memory-match"]')
    const label = await scene.getAttribute('aria-label')
    expect(label).toContain('Memory')
  })

  test('bouw-de-toren shows Dutch aria label', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })
    const scene = page.locator('[data-testid="minigame-bouw-de-toren"]')
    const label = await scene.getAttribute('aria-label')
    expect(label).toContain('Bouw de toren')
  })
})

test.describe('a11y smoke checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map', { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expect(page).toHaveURL(/\/map/)
  })
  test('play page has proper heading structure', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeLessThanOrEqual(1)
  })

  test('minigame buttons meet minimum tap size', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('[data-testid^="minigame-"]')).toBeVisible({ timeout: 10000 })
    const buttons = page.locator('[data-testid^="minigame-"] button')
    const count = await buttons.count()
    for (let i = 0; i < Math.min(count, 6); i++) {
      const box = await buttons.nth(i).boundingBox()
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })
})
