import { test, expect } from '@playwright/test'

const ROUNDS_PER_LEVEL = 10

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

async function answerCurrentQuestion(page: import('@playwright/test').Page, answer: number) {
  await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 8000 })
  const correctButton = await findAnswerButtonByExactLabel(page, answer)
  expect(correctButton).not.toBeNull()
  await correctButton!.click({ force: true })
  const chestZone = page.locator('.chest-zone').first()
  if (await chestZone.isVisible()) {
    await chestZone.click({ force: true })
  }
}

async function answerWrongQuestion(page: import('@playwright/test').Page, correctAnswer: number) {
  await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 8000 })
  const allButtons = page.locator('[data-testid^="minigame-"] button')
  await expect.poll(async () => await allButtons.count()).toBeGreaterThan(0)
  const total = await allButtons.count()
  for (let i = 0; i < total; i++) {
    const text = (await allButtons.nth(i).innerText()).trim()
    if (text !== String(correctAnswer)) {
      await allButtons.nth(i).click({ force: true })
      const chestZone = page.locator('.chest-zone').first()
      if (await chestZone.isVisible()) {
        await chestZone.click({ force: true })
      }
      return
    }
  }
  await allButtons.first().click({ force: true })
  const chestZone = page.locator('.chest-zone').first()
  if (await chestZone.isVisible()) {
    await chestZone.click({ force: true })
  }
}

test.describe('mistakes review visual', () => {
  test.skip('mistakes review screenshot baseline', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('[data-testid="operand-a"]')).toBeVisible({ timeout: 15000 })

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      const correctAnswer = a + b
      if (round === 0) {
        await answerWrongQuestion(page, correctAnswer)
      } else {
        await answerCurrentQuestion(page, correctAnswer)
      }
    }

    await expect(page.locator('.modal-dialog')).toBeVisible({ timeout: 5000 })
    const reviewBtn = page.locator('.cta-secondary:has-text("Fouten bekijken")')
    await expect(reviewBtn).toBeVisible({ timeout: 3000 })
    await reviewBtn.click()

    await expect(page.locator('.mistakes-review')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('.review-header .review-mascot')).toBeVisible()

    await expect(page.locator('.mistakes-review')).toHaveScreenshot('mistakes-review.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
