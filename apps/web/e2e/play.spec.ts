import { test, expect } from '@playwright/test'
import { E2E_PROFILE } from './fixtures/authenticated'
import { diagnoseOnFailure } from './helpers/diagnose-failure'

test.describe('play page — level minigame mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
  })
  test('shows ProblemCard and minigame when ?level=1', async ({ page }) => {
    await page.goto('/play?level=1')

    try {
      await expect(page.locator('.problem-card')).toBeVisible()
    } catch (e) {
      const diag = await diagnoseOnFailure(page, 'play-problem-card')
      const msg = `E2E DIAGNOSE (play-problem-card): ${JSON.stringify(diag, null, 2)}`
      console.error(msg)
      throw new Error(`${(e as Error).message}\n\n${msg}`)
    }
    await expect(page.locator('.minigame-renderer')).toBeVisible()
    await expect(page.locator('.keypad')).toHaveCount(0)
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '0')
  })

  test('can answer in minigame and progress advances', async ({ page }) => {
    await page.goto('/play?level=1')

    await expect(page.locator('.problem-card')).toBeVisible()

    const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
    const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
    const correctAnswer = a + b

    const correctButton = page.locator(
      `[data-testid^="minigame-"] button:has-text("${correctAnswer}")`
    ).first()
    await expect(correctButton).toBeVisible()
    await correctButton.click({ force: true })

    const chestZone = page.locator('.chest-zone')
    if (await chestZone.isVisible()) {
      await chestZone.click({ force: true })
    }

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
    await expect(page.locator('.keypad-feedback')).toHaveCount(0)
  })

  test('exit to map button remains available', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('.exit-to-map-btn')).toBeVisible()
  })
})
