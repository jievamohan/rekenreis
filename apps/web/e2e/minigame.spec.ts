import { test, expect } from './fixtures/authenticated'

async function findAnswerButtonByExactLabel(
  page: import('@playwright/test').Page,
  answer: number
) {
  const buttons = page.locator('[data-testid^="minigame-"] button')
  await expect.poll(async () => await buttons.count()).toBeGreaterThan(0)
  const total = await buttons.count()
  const target = String(answer)
  for (let i = 0; i < total; i++) {
    const text = (await buttons.nth(i).innerText()).trim()
    if (text === target) return buttons.nth(i)
  }
  return null
}

test.describe('minigame mode', () => {
  test('renders minigame component on level play', async ({ page }) => {
    await page.goto('/play?level=1')
    // Wait for game to load (ProblemCard or minigame; play-loading disappears)
    await expect(
      page.locator('.problem-card, [data-testid^="minigame-"]').first()
    ).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.minigame-renderer')).toBeVisible()
    await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible()
  })

  test('minigame buttons submit answer and advance progress', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(
      page.locator('.problem-card, [data-testid^="minigame-"]').first()
    ).toBeVisible({ timeout: 15000 })

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid^="minigame-"]')).toBeVisible()
    await expect(page.locator('.round-progress')).toBeVisible()
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '0')
    await expect(page.locator('.round-progress-node-current')).toHaveText('1')

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
    const correctAnswer = a + b

    const correctButton = await findAnswerButtonByExactLabel(page, correctAnswer)
    expect(correctButton).not.toBeNull()
    await expect(correctButton!).toBeVisible()
    await correctButton!.click({ force: true })

    const dropZone = page.locator('.chest-zone').first()
    if (await dropZone.isVisible()) {
      await dropZone.click({ force: true })
    }

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
    await expect(page.locator('.round-progress-node-current')).toHaveText('2')
    await expect(page.locator('.keypad-feedback')).toHaveCount(0)
  })

  test('numeric keypad is not shown on level play', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(
      page.locator('.problem-card, [data-testid^="minigame-"]').first()
    ).toBeVisible({ timeout: 15000 })

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.minigame-renderer')).toBeVisible()
    await expect(page.locator('.keypad')).toHaveCount(0)
  })
})
