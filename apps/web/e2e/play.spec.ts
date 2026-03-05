import { test, expect } from '@playwright/test'

test.describe('play page — keypad mode', () => {
  test('shows ProblemCard and Keypad when ?level=1', async ({ page }) => {
    await page.goto('/play?level=1')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.keypad')).toBeVisible()

    await expect(page.locator('.progress-indicator')).toContainText('1 / 5')
  })

  test('can enter answer via keypad and get feedback', async ({ page }) => {
    await page.goto('/play?level=1')

    await expect(page.locator('.problem-card')).toBeVisible()

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    const digits = String(correctAnswer).split('')
    for (const d of digits) {
      await page.locator(`.key.digit:has-text("${d}")`).click()
    }

    await page.locator('.check-key').click()

    await expect(page.locator('.keypad-feedback')).toBeVisible()
    await expect(page.locator('.keypad-feedback')).toContainText('Correct')
  })

  test('keyboard number entry works', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    for (const d of String(correctAnswer).split('')) {
      await page.keyboard.press(d)
    }
    await page.keyboard.press('Enter')

    await expect(page.locator('.keypad-feedback')).toBeVisible()
  })
})
