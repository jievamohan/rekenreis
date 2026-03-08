import { test, expect } from '@playwright/test'

test.describe('sorting mechanic (SubmarineSort)', () => {
  test('completes one round via keyboard: select item, then sort into bin', async ({ page }) => {
    // Level 5 maps to submarine-sort
    await page.goto('/play?level=5')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
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

  test('wrong bin advances round without punishment', async ({ page }) => {
    await page.goto('/play?level=5')

    await expect(page.locator('[data-testid="minigame-submarine-sort"]')).toBeVisible({ timeout: 10000 })

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
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

    // Click the WRONG bin — round advances (no blocking punishment)
    const bins = page.locator('[data-testid="minigame-submarine-sort"] .sort-bin')
    const binCount = await bins.count()
    for (let i = 0; i < binCount; i++) {
      const label = await bins.nth(i).locator('.bin-label').textContent()
      if (label?.trim() !== String(correctAnswer)) {
        await bins.nth(i).click()
        break
      }
    }

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})

test.describe('sequence/spatial mechanic (CoralBuilder)', () => {
  test('completes one round by selecting piece and placing on reef', async ({ page }) => {
    // Level 4 maps to coral-builder
    await page.goto('/play?level=4')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-coral-builder"]')).toBeVisible({ timeout: 10000 })

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
    const correctAnswer = a + b

    // Find the correct coral piece and click it, then click reef zone to place
    const pieces = page.locator('[data-testid="minigame-coral-builder"] .coral-piece')
    const pieceCount = await pieces.count()
    for (let i = 0; i < pieceCount; i++) {
      const text = (await pieces.nth(i).locator('.coral-number').textContent())?.trim()
      if (text === String(correctAnswer)) {
        await pieces.nth(i).click()
        break
      }
    }
    await page.locator('[data-testid="minigame-coral-builder"] .reef-zone').click()

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})
