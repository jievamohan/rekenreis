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

test.describe('memory-flip mechanic (MemoryMatch)', () => {
  test('completes one round by flipping sum+answer pairs', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/play?level=4')

    await expect(page.locator('[data-testid="minigame-memory-match"]')).toBeVisible({ timeout: 10000 })

    const cards = page.locator('[data-testid="minigame-memory-match"] .card')
    const count = await cards.count()
    for (let i = 0; i < count - 1; i++) {
      for (let j = i + 1; j < count; j++) {
        await cards.nth(i).evaluate((el: HTMLElement) => el.click())
        await cards.nth(j).evaluate((el: HTMLElement) => el.click())
        await page.waitForTimeout(900)
        const val = await page.locator('.round-progress').getAttribute('aria-valuenow')
        if (val === '1') return
      }
    }
    throw new Error('Could not complete memory-match round')
  })
})
