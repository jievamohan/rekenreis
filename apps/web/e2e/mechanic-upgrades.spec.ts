import { test, expect } from '@playwright/test'

test.describe('drag/drop mechanic (TreasureDive)', () => {
  test('completes one round via click-select + chest click', async ({ page }) => {
    // Level 2 maps to treasure-dive
    await page.goto('/play?level=2')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    // Click the gem with the correct answer
    const gems = page.locator('[data-testid="minigame-treasure-dive"] .gem')
    const gemCount = await gems.count()
    for (let i = 0; i < gemCount; i++) {
      const text = (await gems.nth(i).innerText()).trim()
      if (text === String(correctAnswer)) {
        await gems.nth(i).click()
        break
      }
    }

    // Click the chest to submit
    const chest = page.locator('.chest-zone')
    await expect(chest).toBeVisible()
    await chest.click()

    // Round advances
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })

  test('keyboard fallback: Tab to gem, Enter, Tab to chest, Enter', async ({ page }) => {
    await page.goto('/play?level=2')

    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    // Tab through gems to find the correct one
    const gems = page.locator('[data-testid="minigame-treasure-dive"] .gem')
    const gemCount = await gems.count()
    for (let i = 0; i < gemCount; i++) {
      const text = (await gems.nth(i).innerText()).trim()
      if (text === String(correctAnswer)) {
        await gems.nth(i).focus()
        await page.keyboard.press('Enter')
        break
      }
    }

    // Focus and activate the chest
    const chest = page.locator('.chest-zone')
    await chest.focus()
    await page.keyboard.press('Enter')

    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})

test.describe('timed-kind mechanic (FishFeed)', () => {
  test('timeout shows hint and continues without punishment', async ({ page }) => {
    // Level 3 maps to fish-feed
    await page.goto('/play?level=3')

    await expect(page.locator('.problem-card')).toBeVisible()
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })

    // Wait for the timer to expire (default ~15s, but difficulty may vary)
    // The hint overlay should appear
    await expect(page.locator('.hint-overlay')).toBeVisible({ timeout: 25000 })

    // Verify hint card content
    await expect(page.locator('.hint-card')).toBeVisible()
    await expect(page.locator('.hint-text')).toBeVisible()

    // After ~2.5s, the round should auto-advance
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1', { timeout: 5000 })
  })

  test('selecting a pellet before timeout works normally', async ({ page }) => {
    await page.goto('/play?level=3')

    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })

    const operandEls = page.locator('.problem-card .operand')
    const a = Number(await operandEls.nth(0).textContent())
    const b = Number(await operandEls.nth(1).textContent())
    const correctAnswer = a + b

    const pellets = page.locator('[data-testid="minigame-fish-feed"] .pellet')
    const pelletCount = await pellets.count()
    for (let i = 0; i < pelletCount; i++) {
      const text = (await pellets.nth(i).innerText()).trim()
      if (text === String(correctAnswer)) {
        await pellets.nth(i).click()
        break
      }
    }

    // No hint shown — direct answer
    await expect(page.locator('.hint-overlay')).toHaveCount(0)
    await expect(page.locator('.round-progress')).toHaveAttribute('aria-valuenow', '1')
  })
})
