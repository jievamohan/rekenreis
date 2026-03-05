import { test, expect } from '@playwright/test'

test.describe('mistakes review', () => {
  test('review shows after completing level with wrong answers', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < 5; round++) {
      const operandEls = page.locator('.problem-card .operand')
      const a = Number(await operandEls.nth(0).textContent())
      const b = Number(await operandEls.nth(1).textContent())

      if (round === 0) {
        const wrongAnswer = a + b + 1
        for (const d of String(wrongAnswer).split('')) {
          await page.keyboard.press(d)
        }
      } else {
        for (const d of String(a + b).split('')) {
          await page.keyboard.press(d)
        }
      }
      await page.keyboard.press('Enter')

      const modalVisible = await page.locator('.modal-dialog').isVisible()
      if (modalVisible) break

      await page.locator('.next-btn').click()
      await expect(page.locator('.problem-card')).toBeVisible()
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()

    const reviewBtn = page.locator('.cta-secondary:has-text("Fouten bekijken")')
    await expect(reviewBtn).toBeVisible()
    await reviewBtn.click()

    await expect(page.locator('.mistakes-review')).toBeVisible()
    await expect(page.locator('.review-title')).toContainText('Laten we deze nog eens bekijken')
    await expect(page.locator('.mistake-card')).toHaveCount(1)

    await expect(page.locator('.cta-primary:has-text("Opnieuw proberen")')).toBeVisible()
    await expect(page.locator('.cta-secondary:has-text("Naar de kaart")')).toBeVisible()
  })
})
