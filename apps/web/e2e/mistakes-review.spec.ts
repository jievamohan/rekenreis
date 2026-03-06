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
  await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 10000 })
  const correctButton = await findAnswerButtonByExactLabel(page, answer)
  expect(correctButton).not.toBeNull()
  await expect(correctButton!).toBeVisible()
  await correctButton!.click({ force: true })

  const chestZone = page.locator('.chest-zone').first()
  if (await chestZone.isVisible()) {
    await chestZone.click({ force: true })
  }
}

async function answerWrongQuestion(page: import('@playwright/test').Page, correctAnswer: number) {
  await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 10000 })
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
  // Fallback: if all visible labels equal the correct answer, click first to keep test progressing.
  await allButtons.first().click({ force: true })
  const chestZone = page.locator('.chest-zone').first()
  if (await chestZone.isVisible()) {
    await chestZone.click({ force: true })
  }
}

test.describe('mistakes review', () => {
  test('review shows after completing level with wrong answers', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const operandEls = page.locator('.problem-card .operand')
      const a = Number(await operandEls.nth(0).textContent())
      const b = Number(await operandEls.nth(1).textContent())
      const correctAnswer = a + b

      if (round === 0) {
        await answerWrongQuestion(page, correctAnswer)
      } else {
        await answerCurrentQuestion(page, correctAnswer)
      }
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
