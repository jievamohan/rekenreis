import { test, expect } from '@playwright/test'

test.describe('sorting mechanic (SubmarineSort)', () => {
  test('completes one round via keyboard: select item, then sort into bin', async ({ page }) => {
    // Level 5 maps to submarine-sort
    await page.goto('/play?level=5')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    // Select the correct item via keyboard
    const items = page.locator('[data-testid="minigame-submarine-sort"] .sort-item')
    const itemCount = await items.count()
    for (let i = 0; i < itemCount; i++) {
      const text = (await items.nth(i).innerText()).trim()
      if (text === String(correctAnswer)) {
        await items.nth(i).focus()
        await page.keyboard.press('Enter')
        break
      }
    }

    // Find the correct bin and activate via keyboard
    const bins = page.locator('[data-testid="minigame-submarine-sort"] .sort-bin')
    const binCount = await bins.count()
    for (let i = 0; i < binCount; i++) {
      const label = await bins.nth(i).locator('.bin-label').textContent()
      if (label?.trim() === String(correctAnswer)) {
        await bins.nth(i).focus()
        await page.keyboard.press('Enter')
        break
      }
    }

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })

  test('wrong bin shows gentle feedback without punishment', async ({ page }) => {
    await page.goto('/play?level=5')

    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    // Select the correct item
    const items = page.locator('[data-testid="minigame-submarine-sort"] .sort-item')
    const itemCount = await items.count()
    for (let i = 0; i < itemCount; i++) {
      const text = (await items.nth(i).innerText()).trim()
      if (text === String(correctAnswer)) {
        await items.nth(i).click()
        break
      }
    }

    // Click the WRONG bin
    const bins = page.locator('[data-testid="minigame-submarine-sort"] .sort-bin')
    const binCount = await bins.count()
    for (let i = 0; i < binCount; i++) {
      const label = await bins.nth(i).locator('.bin-label').textContent()
      if (label?.trim() !== String(correctAnswer)) {
        await bins.nth(i).click()
        break
      }
    }

    // Round should NOT advance
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '0')
  })
})

test.describe('sequence/spatial mechanic (CoralBuilder)', () => {
  test('completes one round by selecting position on number track', async ({ page }) => {
    // Level 4 maps to coral-builder
    await page.goto('/play?level=4')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-coral-builder"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    // Find the correct position on the number track
    const positions = page.locator('[data-testid="minigame-coral-builder"] .track-position.is-choice')
    const posCount = await positions.count()
    for (let i = 0; i < posCount; i++) {
      const marker = positions.nth(i).locator('.track-marker')
      const text = (await marker.textContent())?.trim()
      if (text === String(correctAnswer)) {
        await positions.nth(i).click()
        break
      }
    }

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})
