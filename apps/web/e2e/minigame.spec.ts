import { test, expect } from '@playwright/test'

test.describe('minigame mode', () => {
  test('renders minigame component when ?minigame=1', async ({ page }) => {
    await page.goto('/play?level=1&minigame=1')

    await expect(page.locator('.problem-card')).toBeVisible()

    const minigame = page.locator('.minigame-renderer')
    await expect(minigame).toBeVisible()

    const hasMinigameComponent = await page.locator(
      '[data-testid^="minigame-"]'
    ).isVisible()
    expect(hasMinigameComponent).toBe(true)
  })

  test('minigame buttons submit answer and show feedback', async ({ page }) => {
    await page.goto('/play?level=1&minigame=1')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid^="minigame-"]')).toBeVisible()

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    const correctButton = page.locator(
      `[data-testid^="minigame-"] button:has-text("${correctAnswer}")`
    ).first()

    if (await correctButton.isVisible()) {
      await correctButton.click()
      await expect(page.locator('.keypad-feedback')).toBeVisible()
    }
  })

  test('without ?minigame=1 shows keypad', async ({ page }) => {
    await page.goto('/play?level=1')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.keypad')).toBeVisible()
    await expect(page.locator('.minigame-renderer')).toHaveCount(0)
  })
})
