import { test, expect } from '@playwright/test'

test.describe('drag-drop tower (Bouw de Toren)', () => {
  test('completes one round via drag blocks to dropzones', async ({ page }) => {
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

    const zone1 = page.locator('[data-drop-zone="1"]')
    const zone2 = page.locator('[data-drop-zone="2"]')
    const blockAEl = blocks.nth(idxA)
    const boxA = await blockAEl.boundingBox()
    const boxZ1 = await zone1.boundingBox()
    if (boxA && boxZ1) {
      await page.mouse.move(boxA.x + boxA.width / 2, boxA.y + boxA.height / 2)
      await page.mouse.down()
      await page.mouse.move(boxZ1.x + boxZ1.width / 2, boxZ1.y + boxZ1.height / 2, { steps: 5 })
      await page.mouse.up()
    }
    await page.waitForTimeout(300)
    const blockB = page.locator('[data-testid="tower-puzzle"] .block').filter({ hasText: String(valB) }).first()
    const boxB = await blockB.boundingBox()
    const boxZ2 = await zone2.boundingBox()
    if (boxB && boxZ2) {
      await page.mouse.move(boxB.x + boxB.width / 2, boxB.y + boxB.height / 2)
      await page.mouse.down()
      await page.mouse.move(boxZ2.x + boxZ2.width / 2, boxZ2.y + boxZ2.height / 2, { steps: 5 })
      await page.mouse.up()
    }

    await expect(page.locator('text=Volgende ronde').or(page.locator('[data-testid="level-complete-modal"]'))).toBeVisible({ timeout: 5000 })
  })

  test.skip('completes one round via keyboard (focus block + zone, Enter)', async ({ page }) => {
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
