import { test, expect } from '@playwright/test'

async function completeLevel(page: import('@playwright/test').Page) {
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
}

test.describe('app flow: map → play → complete → map', () => {
  test('complete level and return to map with progress', async ({ page }) => {
    await page.goto('/play?level=1')

    await completeLevel(page)

    await page.getByRole('button', { name: 'Back to Map' }).click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.map-page')).toBeVisible()

    const completedNode = page.locator('.map-node.completed').first()
    await expect(completedNode).toBeVisible()
  })

  test('exit to map button navigates back', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.map-page')).toBeVisible()
  })

  test('map shows choose level header and play CTA', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.exit-to-map-btn')).toBeVisible()

    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)

    await expect(page.locator('.map-title')).toContainText('Choose Level')
    await expect(page.locator('.play-current-cta')).toBeVisible()
    await expect(page.locator('.map-progress')).toBeVisible()
  })
})
