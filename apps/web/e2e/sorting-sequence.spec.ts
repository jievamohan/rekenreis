import { test, expect } from '@playwright/test'

test.describe('tap-to-increment mechanic (ShellCollector)', () => {
  test('completes one round via tap add-shell button', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-shell-collector"]')).toBeVisible({ timeout: 10000 })

    const countDisplay = page.locator('[data-testid="minigame-shell-collector"] .count-display')
    await expect(countDisplay).toBeVisible()
    const text = await countDisplay.textContent()
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/)
    expect(match).toBeTruthy()
    const current = Number(match![1])
    const target = Number(match![2])
    const tapsNeeded = target - current

    const addBtn = page.locator('[data-testid="minigame-shell-collector"] .add-shell-btn')
    for (let i = 0; i < tapsNeeded; i++) {
      await addBtn.click()
      await page.waitForTimeout(80)
    }
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })

  test('completes one round via keyboard (focus + Enter)', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-shell-collector"]')).toBeVisible({ timeout: 10000 })

    const countDisplay = page.locator('[data-testid="minigame-shell-collector"] .count-display')
    const text = await countDisplay.textContent()
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/)
    expect(match).toBeTruthy()
    const tapsNeeded = Number(match![2]) - Number(match![1])

    const addBtn = page.locator('[data-testid="minigame-shell-collector"] .add-shell-btn')
    await addBtn.focus()
    for (let i = 0; i < tapsNeeded; i++) {
      await page.keyboard.press('Enter')
      await page.waitForTimeout(80)
    }
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})
