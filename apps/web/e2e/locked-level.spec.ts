import { testLockedLevel as test, expect } from './fixtures/authenticated'

test.describe('locked level screen', () => {
  test('navigating to locked level shows maatje, message, and back-to-map button', async ({
    page,
  }) => {
    // testLockedLevel fixture injects E2E_PROFILE_LOCKED (currentLevel: 1) so level 50 is locked
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

    // Button to go back to map (use locator for reliability; accessible name comes from aria-label)
    const backButton = page.locator('.locked-level-cta')
    await expect(backButton).toBeVisible({ timeout: 10000 })
    await backButton.click()

    // Should navigate to map
    await expect(page).toHaveURL(/\/map/)
  })
})
