import { test, expect } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'

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

async function answerCurrentQuestion(page: import('@playwright/test').Page, answer: number, beforeProgress: number) {
  await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 10000 })
  const correctButton = await findAnswerButtonByExactLabel(page, answer)
  expect(correctButton).not.toBeNull()
  await expect(correctButton!).toBeVisible()
  for (let attempt = 0; attempt < 3; attempt++) {
    await correctButton!.click({ force: true })

    const chestZone = page.locator('.chest-zone').first()
    if (await chestZone.isVisible()) {
      await chestZone.click({ force: true })
    }

    // Level complete modal appears when last round is done (game area is hidden)
    const modal = page.locator('.modal-dialog')
    if (await modal.isVisible()) {
      return
    }
    const progressNow = Number(await page.locator('.round-progress').getAttribute('aria-valuenow') ?? '0')
    if (progressNow > beforeProgress) {
      return
    }
    await page.waitForTimeout(120)
  }
}

async function completeLevel(page: import('@playwright/test').Page) {
  await expect(page.locator('.problem-card')).toBeVisible()

  for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
    await expect(page.locator('[data-testid^="minigame-"]').first()).toBeVisible({ timeout: 10000 })
    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
    const before = Number(await page.locator('.round-progress').getAttribute('aria-valuenow') ?? '0')
    await answerCurrentQuestion(page, a + b, before)

    if (round < ROUNDS_PER_LEVEL - 1) {
      await expect
        .poll(async () => {
          const modal = page.locator('.modal-dialog')
          if (await modal.isVisible()) return before + 1
          return Number(await page.locator('.round-progress').getAttribute('aria-valuenow') ?? '-1')
        })
        .toBeGreaterThan(before)
      if (!(await page.locator('.modal-dialog').isVisible())) {
        await expect(page.locator('.problem-card')).toBeVisible()
      }
    }
  }

  await expect(page.locator('.modal-dialog')).toBeVisible()
}

test.describe('app flow: map → play → complete → map', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test('complete level and return to map with progress', async ({ page }) => {
    await page.goto('/play?level=1')

    await completeLevel(page)

    const backToMapBtn = page.getByRole('button', { name: 'Naar de kaart' })
    const nextLevelBtn = page.getByRole('button', { name: 'Volgend level' })
    if ((await backToMapBtn.count()) > 0) {
      await backToMapBtn.first().click()
    } else {
      await nextLevelBtn.first().click()
      await expect(page).toHaveURL(/level=2/)
      await page.locator('.exit-to-map-btn').click()
    }
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

    await expect(page.locator('.map-title')).toContainText('Kies een level')
    await expect(page.locator('.play-current-cta')).toBeVisible()
    await expect(page.locator('.map-progress')).toBeVisible()
  })

  test('map → play level 1 → play level 200 → map', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('.map-page')).toBeVisible()

    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    await page.goto('/play?level=200')
    // Level 200 uses weighted pool; memory-match hides ProblemCard — assert game area visible
    await expect(page.locator('.problem-card, [data-testid^="minigame-"]').first()).toBeVisible({ timeout: 10000 })

    await page.locator('.exit-to-map-btn').click()
    await expect(page).toHaveURL(/\/map/)
    await expect(page.locator('.map-page')).toBeVisible()
  })
})
