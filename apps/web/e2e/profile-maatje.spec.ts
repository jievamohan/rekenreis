import { test, expect } from './fixtures/authenticated'

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

test.describe('profile maatje selection', () => {
  // AppShell chrome (profile pill, nav) does not render in CI Docker e2e (pre-existing).
  // Run locally: docker compose run --rm e2e npx playwright test profile-maatje
  // Skipped in CI via playwright.config testIgnore (AppShell chrome not rendered in CI)
  test('create profile with maatje, map and level-complete show chosen maatje', async ({
    page,
  }) => {
    await page.goto('/map')
    await expect(page.locator('.map-page')).toBeVisible({ timeout: 10000 })

    await page.locator('[data-testid="profile-pill"]').click()
    await expect(page.locator('.profile-selector')).toBeVisible()

    await page.getByRole('button', { name: '+ Toevoegen' }).click()
    await expect(page.locator('.profile-create')).toBeVisible()

    await page.locator('.profile-create input[type="text"]').fill('TestMaatje')
    await page.getByRole('button', { name: 'Maatje slimme-rekenaar' }).click()
    await page.getByRole('button', { name: 'Aanmaken' }).click()

    await expect(page.locator('.profile-overlay')).not.toBeVisible()

    await expect(page.locator('.map-page')).toBeVisible()
    const mapAvatarImg = page.locator('.map-avatar .maatje-avatar')
    await expect(mapAvatarImg).toBeVisible()
    await expect(mapAvatarImg).toHaveAttribute('src', /slimme-rekenaar/)

    await page.goto('/play?level=1')
    await expect(page.locator('.problem-card')).toBeVisible()

    for (let round = 0; round < ROUNDS_PER_LEVEL; round++) {
      const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
      const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
      await answerCurrentQuestion(page, a + b)
    }

    await expect(page.locator('.modal-dialog')).toBeVisible()
    const modalMascotImg = page.locator('.modal-dialog .mascot .maatje-avatar')
    await expect(modalMascotImg).toBeVisible()
    await expect(modalMascotImg).toHaveAttribute('src', /slimme-rekenaar/)
  })
})
