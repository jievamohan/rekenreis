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

const NUMBER_SPAN_SELECTOR =
  '[data-testid^="minigame-"] .bubble-number, [data-testid^="minigame-"] .gem-number, [data-testid^="minigame-"] .pellet-number, [data-testid^="minigame-"] .item-number, [data-testid^="minigame-"] .star-number'

async function answerWrong(page: import('@playwright/test').Page) {
  await expect(page.locator(NUMBER_SPAN_SELECTOR).first()).toBeVisible({ timeout: 5000 })
  const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
  const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
  const correct = a + b
  const numberSpans = page.locator(NUMBER_SPAN_SELECTOR)
  const count = await numberSpans.count()
  for (let i = 0; i < count; i++) {
    const span = numberSpans.nth(i)
    const text = await span.textContent()
    const val = Number(text?.trim())
    if (Number.isFinite(val) && val !== correct) {
      await span.click({ force: true })
      const chestZone = page.locator('.chest-zone')
      if (await chestZone.isVisible()) await chestZone.click({ force: true })
      return
    }
  }
  throw new Error('No wrong answer button found')
}

test.describe('level complete modal', () => {
  test.describe.configure({ retries: 2 })
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
    await expect(page.locator('.modal-title')).toContainText('Level Voltooid!')
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

  test('modal is not dismissable via Escape or overlay click', async ({ page }) => {
    await page.goto('/play?level=1')

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('.modal-dialog')).toBeVisible()
  })

  test('0 stars shows Probeer opnieuw when below threshold', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      await answerWrong(page)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    await expect(page.locator('.performance-bar')).toContainText('Probeer opnieuw')
    const earnedStars = await page.locator('.star-svg.earned').count()
    expect(earnedStars).toBe(0)
  })

  test('replay improves score when player does better', async ({ page }) => {
    await page.goto('/play?level=1')
    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) await answerWrong(page)
    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Bekijk foutjes' }).click()
    await expect(page.locator('.mistakes-review')).toBeVisible()
    await page.getByRole('button', { name: 'Opnieuw proberen' }).click()
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }
    await expect(page.locator('.modal-dialog')).toBeVisible()
    const earnedStars = await page.locator('.star-svg.earned').count()
    expect(earnedStars).toBe(3)
  })

  test.skip('replay does not decrease stored score', async ({ page }) => {
    await page.goto('/play?level=1')
    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }
    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Naar de kaart' }).click()
    await expect(page).toHaveURL('/map')
    await page.waitForLoadState('domcontentloaded')

    await page.goto('/play?level=1')
    await expect(page.locator(NUMBER_SPAN_SELECTOR).first()).toBeVisible({ timeout: 5000 })
    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) await answerWrong(page)
    await expect(page.locator('.modal-dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Naar de kaart' }).click()
    await expect(page).toHaveURL('/map')
    await page.waitForLoadState('domcontentloaded')

    const node1 = page.getByRole('button', { name: /^Level 1(?:,|\s|$)/ })
    await expect(node1).toHaveClass(/completed/, { timeout: 10000 })
    const starsInNode = await node1.locator('.star-icon').count()
    expect(starsInNode).toBe(3)
  })
})
