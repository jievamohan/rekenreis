import { test, expect } from '@playwright/test'

const ROUNDS_PER_LEVEL = 10

async function answerCurrentQuestion(page: import('@playwright/test').Page, answer: number) {
  const correctButton = page.locator(
    `[data-testid^="minigame-"] button:has-text("${answer}")`
  ).first()
  await expect(correctButton).toBeVisible()
  await correctButton.click({ force: true })

  const chestZone = page.locator('.chest-zone')
  if (await chestZone.isVisible()) {
    await chestZone.click({ force: true })
  }
}

test.describe('level complete modal', () => {
  test('modal appears after completing all rounds', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await expect(page.locator('.mascot')).toBeVisible()
    await expect(page.locator('.star-svg')).toHaveCount(3)
    await expect(page.locator('.modal-title')).toContainText('Level 1 voltooid!')
  })

  test('Next Level button navigates to next level', async ({ page }) => {
    await page.goto('/play?level=1')

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Volgend level' }).click()

    await expect(page).toHaveURL(/level=2/)
  })
})
