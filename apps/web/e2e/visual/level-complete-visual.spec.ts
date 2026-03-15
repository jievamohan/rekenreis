import { test, expect, E2E_PROFILE } from '../fixtures/authenticated'

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

test.describe('level complete modal visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test.skip('level complete 3 stars screenshot baseline', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('[data-testid="operand-a"]')).toBeVisible({ timeout: 15000 })

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await expect(page.locator('.mascot')).toBeVisible()

    await expect(page.locator('.modal-dialog')).toHaveScreenshot('level-complete-3stars.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
