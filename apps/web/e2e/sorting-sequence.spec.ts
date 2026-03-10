import { test, expect } from '@playwright/test'

test.describe('drag-drop tower (Bouw de Toren)', () => {
  test('completes one round via drag blocks to dropzones', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })

    const targetEl = page.locator('[data-testid="tower-puzzle"] .target-display')
    const target = Number(await targetEl.textContent())

    const blocks = page.locator('[data-testid="tower-puzzle"] .block')
    const blockCount = await blocks.count()
    let idxA = -1; let idxB = -1
    for (let i = 0; i < blockCount && idxA < 0; i++) {
      for (let j = i + 1; j < blockCount; j++) {
        const va = Number(await blocks.nth(i).textContent())
        const vb = Number(await blocks.nth(j).textContent())
        if (va + vb === target) {
          idxA = i
          idxB = j
          break
        }
      }
    }
    expect(idxA).toBeGreaterThanOrEqual(0)

    const zone1 = page.locator('[data-drop-zone="1"]')
    const zone2 = page.locator('[data-drop-zone="2"]')
    await blocks.nth(idxA).dragTo(zone1)
    await blocks.nth(idxB).dragTo(zone2)

    await expect(page.locator('text=Volgende ronde').or(page.locator('[data-testid="level-complete-modal"]'))).toBeVisible({ timeout: 5000 })
  })

  test('completes one round via keyboard (focus block + zone, Enter)', async ({ page }) => {
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })

    const targetEl = page.locator('[data-testid="tower-puzzle"] .target-display')
    const target = Number(await targetEl.textContent())

    const blocks = page.locator('[data-testid="tower-puzzle"] .block')
    const blockCount = await blocks.count()
    let idxA = -1; let valB = 0
    for (let i = 0; i < blockCount && idxA < 0; i++) {
      for (let j = i + 1; j < blockCount; j++) {
        const va = Number(await blocks.nth(i).textContent())
        const vb = Number(await blocks.nth(j).textContent())
        if (va + vb === target) {
          idxA = i
          valB = vb
          break
        }
      }
    }
    expect(idxA).toBeGreaterThanOrEqual(0)

    await blocks.nth(idxA).focus()
    await page.keyboard.press('Enter')
    await page.locator('[data-drop-zone="1"]').focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    const blockB = page.locator('[data-testid="tower-puzzle"] .block').filter({ hasText: String(valB) }).first()
    await blockB.focus()
    await page.keyboard.press('Enter')
    await page.locator('[data-drop-zone="2"]').focus()
    await page.keyboard.press('Enter')

    await expect(page.locator('text=Volgende ronde').or(page.locator('[data-testid="level-complete-modal"]'))).toBeVisible({ timeout: 5000 })
  })
})
