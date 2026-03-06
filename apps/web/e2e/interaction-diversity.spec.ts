import { test, expect } from '@playwright/test'

test.describe('interaction diversity — E2E proof', () => {
  test('drag/drop (TreasureDive): completes round via click + chest', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
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

  test('timed-kind (FishFeed): timeout shows hint and continues', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.hint-overlay')).toBeVisible({ timeout: 25000 })
    await expect(page.locator('.hint-text')).toBeVisible()
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1', { timeout: 5000 })
  })

  test('sorting (SubmarineSort): keyboard select + sort into bin', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correct = a + b

    const items = page.locator('[data-testid="minigame-submarine-sort"] .sort-item')
    for (let i = 0; i < await items.count(); i++) {
      if ((await items.nth(i).innerText()).trim() === String(correct)) {
        await items.nth(i).focus()
        await page.keyboard.press('Enter')
        break
      }
    }

    const bins = page.locator('[data-testid="minigame-submarine-sort"] .sort-bin')
    for (let i = 0; i < await bins.count(); i++) {
      const label = await bins.nth(i).locator('.bin-label').textContent()
      if (label?.trim() === String(correct)) {
        await bins.nth(i).focus()
        await page.keyboard.press('Enter')
        break
      }
    }
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })

  test('sequence/spatial (CoralBuilder): select position on number track', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-coral-builder"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correct = a + b

    const positions = page.locator('[data-testid="minigame-coral-builder"] .track-position.is-choice')
    for (let i = 0; i < await positions.count(); i++) {
      const text = (await positions.nth(i).locator('.track-marker').textContent())?.trim()
      if (text === String(correct)) {
        await positions.nth(i).click()
        break
      }
    }
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})

test.describe('Dutch copy assertions', () => {
  test('hint overlay shows Dutch text on fish-feed timeout', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.hint-overlay')).toBeVisible({ timeout: 25000 })
    const hintText = await page.locator('.hint-text').textContent()
    expect(hintText).toContain('Het antwoord is')
    expect(hintText).toContain('Goed onthouden')
    const continueText = await page.locator('.hint-continue').textContent()
    expect(continueText).toContain('rustig verder')
  })

  test('treasure-dive shows Dutch aria labels', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    const scene = page.locator('[data-testid="minigame-treasure-dive"]')
    const label = await scene.getAttribute('aria-label')
    expect(label).toContain('Schatduik')
  })

  test('coral-builder shows Dutch sequence hint', async ({ page }) => {
    await page.goto('/play?level=4')
    await expect(page.locator('[data-testid="minigame-coral-builder"]')).toBeVisible({ timeout: 10000 })
    const instruction = await page.locator('.sequence-instruction').textContent()
    expect(instruction).toContain('juiste plek')
  })

  test('submarine-sort shows Dutch aria label', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })
    const scene = page.locator('[data-testid="minigame-submarine-sort"]')
    const label = await scene.getAttribute('aria-label')
    expect(label).toContain('Onderzeeër')
  })
})

test.describe('a11y smoke checks', () => {
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
