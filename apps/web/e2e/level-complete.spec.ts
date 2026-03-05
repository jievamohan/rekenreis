import { test, expect } from '@playwright/test'

test.describe('level complete modal', () => {
  test('modal appears after completing all rounds', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < 5; round++) {
      const operandEls = page.locator('.problem-card .operand')
      const a = Number(await operandEls.nth(0).textContent())
      const b = Number(await operandEls.nth(1).textContent())
      const answer = String(a + b)

      for (const d of answer.split('')) {
        await page.keyboard.press(d)
      }
      await page.keyboard.press('Enter')

      await expect(page.locator('.keypad-feedback, .modal-dialog')).toBeVisible()

      const modalVisible = await page.locator('.modal-dialog').isVisible()
      if (modalVisible) break

      await page.locator('.next-btn').click()
      await expect(page.locator('.problem-card')).toBeVisible()
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await expect(page.locator('.mascot')).toBeVisible()
    await expect(page.locator('.star-svg')).toHaveCount(3)
    await expect(page.locator('.modal-title')).toContainText('Level 1 voltooid!')
  })

  test('Next Level button navigates to next level', async ({ page }) => {
    await page.goto('/play?level=1')

    for (let round = 0; round < 5; round++) {
      const operandEls = page.locator('.problem-card .operand')
      const a = Number(await operandEls.nth(0).textContent())
      const b = Number(await operandEls.nth(1).textContent())

      for (const d of String(a + b).split('')) {
        await page.keyboard.press(d)
      }
      await page.keyboard.press('Enter')

      const modalVisible = await page.locator('.modal-dialog').isVisible()
      if (modalVisible) break

      await page.locator('.next-btn').click()
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Volgend level' }).click()

    await expect(page).toHaveURL(/level=2/)
  })
})
