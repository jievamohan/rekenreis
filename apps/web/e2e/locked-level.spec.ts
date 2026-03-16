import { test, expect, E2E_PROFILE_LOCKED } from './fixtures/authenticated'

test.describe('locked level screen', () => {
  test('navigating to locked level shows maatje, message, and back-to-map button', async ({
    page,
  }) => {
    // Load map first, then set locked profile (currentLevel: 1) so level 50 is locked
    await page.goto('/map', { waitUntil: 'domcontentloaded' })
    await page.evaluate(
      (s) => localStorage.setItem('rekenreis_profiles_v1', s),
      JSON.stringify(E2E_PROFILE_LOCKED)
    )
    await page.goto('/play?level=50')

    // Locked level screen should be visible
    await expect(page.getByText('Dit level heb je nog niet vrijgespeeld!')).toBeVisible({
      timeout: 10000,
    })
    await expect(
      page.getByText('Speel eerst de eerdere levels om dit level te ontgrendelen.')
    ).toBeVisible()

    // Maatje should be present (avatar image)
    await expect(page.locator('.locked-level-screen .maatje-avatar')).toBeVisible()

    // Button to go back to map
    const backButton = page.getByRole('button', { name: /terug naar de kaart/i })
    await expect(backButton).toBeVisible()
    await backButton.click()

    // Should navigate to map
    await expect(page).toHaveURL(/\/map/)
  })
})
