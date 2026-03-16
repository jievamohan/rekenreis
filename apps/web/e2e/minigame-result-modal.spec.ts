import { test, expect, E2E_PROFILE } from './fixtures/authenticated'
import './debug-failure-hooks'

test.beforeEach(async ({ page }) => {
  await page.addInitScript((schema: string) => {
    localStorage.setItem('rekenreis_profiles_v1', schema)
  }, JSON.stringify(E2E_PROFILE))
})

/** Tap correct or wrong answer in bubble-pop (level 1). */
async function answerBubblePop(
  page: import('@playwright/test').Page,
  correct: boolean
): Promise<void> {
  await expect(page.locator('[data-testid="minigame-bubble-pop"] .bubble-number').first()).toBeVisible()
  await page.waitForTimeout(100)
  const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
  const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
  const target = a + b
  const spans = page.locator('[data-testid="minigame-bubble-pop"] .bubble-number')
  const count = await spans.count()
  for (let i = 0; i < count; i++) {
    const text = await spans.nth(i).textContent()
    const val = Number(text?.trim())
    const isCorrect = val === target
    if (correct ? isCorrect : !isCorrect) {
      await spans.nth(i).click({ force: true })
      return
    }
  }
  throw new Error('No matching bubble found')
}

/** Pick correct/wrong gem, then click chest in treasure-dive (level 2). */
async function answerTreasureDive(
  page: import('@playwright/test').Page,
  correct: boolean
): Promise<void> {
  const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
  const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
  const target = a + b
  const gems = page.locator('[data-testid="minigame-treasure-dive"] .gem')
  const count = await gems.count()
  for (let i = 0; i < count; i++) {
    const text = await gems.nth(i).locator('.gem-number').textContent()
    const val = Number(text?.trim())
    const isCorrect = val === target
    if (correct ? isCorrect : !isCorrect) {
      await gems.nth(i).click({ force: true })
      await page.locator('.chest-zone').click({ force: true })
      return
    }
  }
  throw new Error('No matching gem found')
}

/** Tap correct/wrong pellet in fish-feed (level 3). Requires timersDisabled. */
async function answerFishFeed(
  page: import('@playwright/test').Page,
  correct: boolean
): Promise<void> {
  const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
  const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
  const target = a + b
  const pellets = page.locator('[data-testid="minigame-fish-feed"] .pellet-number')
  const count = await pellets.count()
  for (let i = 0; i < count; i++) {
    const text = await pellets.nth(i).textContent()
    const val = Number(text?.trim())
    const isCorrect = val === target
    if (correct ? isCorrect : !isCorrect) {
      await pellets.nth(i).click({ force: true })
      return
    }
  }
  throw new Error('No matching pellet found')
}

/** Flip matching pairs until round completes. Memory match has no wrong-answer path (0% not feasible).
 * Used when memory-match 100% test is enabled (Epic 36.3). */
async function answerMemoryMatch(
  page: import('@playwright/test').Page
): Promise<void> {
  const targetRound = Number(await page.locator('.round-progress').getAttribute('aria-valuenow') ?? '0')
  for (let attempts = 0; attempts < 30; attempts++) {
    const cards = page.locator('[data-testid="minigame-memory-match"] .card')
    const count = await cards.count()
    for (let i = 0; i < count - 1; i++) {
      for (let j = i + 1; j < count; j++) {
        await cards.nth(i).click({ force: true })
        await cards.nth(j).click({ force: true })
        await page.waitForTimeout(1200)
        const val = await page.locator('.round-progress').getAttribute('aria-valuenow')
        const now = val ? Number(val) : 0
        if (now > targetRound) return
      }
    }
  }
  throw new Error('Could not complete memory-match round')
}

/** Tap correct/wrong star value in starfish-match (level 6). Requires timersDisabled. */
async function answerStarfishMatch(
  page: import('@playwright/test').Page,
  correct: boolean
): Promise<void> {
  const a = Number(await page.locator('[data-testid="operand-a"]').textContent())
  const b = Number(await page.locator('[data-testid="operand-b"]').textContent())
  const target = a + b
  const stars = page.locator('[data-testid="minigame-starfish-match"] .starfish')
  const count = await stars.count()
  for (let i = 0; i < count; i++) {
    const text = await stars.nth(i).locator('.star-number').textContent()
    const val = Number(text?.trim())
    const isCorrect = val === target
    if (correct ? isCorrect : !isCorrect) {
      await stars.nth(i).click({ force: true })
      return
    }
  }
  throw new Error('No matching star found')
}

async function assertModalVisible(page: import('@playwright/test').Page) {
  await expect(page.locator('[data-testid="level-complete-modal"]').or(page.locator('.modal-dialog'))).toBeVisible({ timeout: 10000 })
  await expect(page.locator('.performance-bar')).toBeVisible()
  await expect(page.locator('.stat-item, .stat-capsule')).toHaveCount(4)
  await expect(page.locator('.modal-footer-stats')).toContainText(/score|score/i)
  await expect(page.locator('.modal-footer-stats')).toContainText(/tijd|time/i)
  await expect(page.locator('.modal-footer-stats')).toContainText(/combo/i)
  await expect(page.locator('.modal-footer-stats')).toContainText(/xp/i)
}

test.describe('minigame result modal — 100% and 0%', () => {
  test.describe.configure({ retries: 2 })


  test('bubble-pop (level 1) 100%: modal visible, 3 stars, stat-items', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('[data-testid="minigame-bubble-pop"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerBubblePop(page, true)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(3)
  })

  test('bubble-pop (level 1) 0%: modal visible, 0 stars', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('[data-testid="minigame-bubble-pop"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerBubblePop(page, false)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(0)
  })

  test('treasure-dive (level 2) 100%: modal visible, 3 stars', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerTreasureDive(page, true)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(3)
  })

  test('treasure-dive (level 2) 0%: modal visible, 0 stars', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerTreasureDive(page, false)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(0)
  })

  test('fish-feed (level 3) 100%: modal visible, 3 stars', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerFishFeed(page, true)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(3)
  })

  test('fish-feed (level 3) 0%: modal visible, 0 stars', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerFishFeed(page, false)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(0)
  })

  test.skip('memory-match (level 4) 100%: modal visible, 3 stars', async ({ page }) => {
    await page.goto('/play?level=4')
    for (let r = 0; r < 5; r++) await answerMemoryMatch(page)
    await assertModalVisible(page)
  })

  test.skip('memory-match (level 4) 0%: skip — no wrong-answer path in mechanic', async ({ page }) => {
    void page
  })

  test('starfish-match (level 6) 100%: modal visible, 3 stars', async ({ page }) => {
    await page.goto('/play?level=6')
    await expect(page.locator('[data-testid="minigame-starfish-match"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerStarfishMatch(page, true)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(3)
  })

  test('starfish-match (level 6) 0%: modal visible, 0 stars', async ({ page }) => {
    await page.goto('/play?level=6')
    await expect(page.locator('[data-testid="minigame-starfish-match"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerStarfishMatch(page, false)
    await assertModalVisible(page)
    await expect(page.locator('.star-svg.earned')).toHaveCount(0)
  })
})

test.describe('minigame result modal — 40% and 80%', () => {
  test.describe.configure({ retries: 2 })


  test('bubble-pop (level 1) 40%: 4/10, score 40%, 1 star', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('[data-testid="minigame-bubble-pop"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerBubblePop(page, r < 4)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('4')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('40')
    await expect(page.locator('.star-svg.earned')).toHaveCount(1)
  })

  test('bubble-pop (level 1) 80%: 8/10, score 80%, 2 stars', async ({ page }) => {
    await page.goto('/play?level=1')
    await expect(page.locator('[data-testid="minigame-bubble-pop"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerBubblePop(page, r < 8)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('8')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('80')
    await expect(page.locator('.star-svg.earned')).toHaveCount(2)
  })

  test('treasure-dive (level 2) 40%: 4/10, score 40%, 1 star', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerTreasureDive(page, r < 4)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('4')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('40')
    await expect(page.locator('.star-svg.earned')).toHaveCount(1)
  })

  test('treasure-dive (level 2) 80%: 8/10, score 80%, 2 stars', async ({ page }) => {
    await page.goto('/play?level=2')
    await expect(page.locator('[data-testid="minigame-treasure-dive"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerTreasureDive(page, r < 8)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('8')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('80')
    await expect(page.locator('.star-svg.earned')).toHaveCount(2)
  })

  test('fish-feed (level 3) 40%: 4/10, score 40%, 1 star', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerFishFeed(page, r < 4)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('4')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('40')
    await expect(page.locator('.star-svg.earned')).toHaveCount(1)
  })

  test('fish-feed (level 3) 80%: 8/10, score 80%, 2 stars', async ({ page }) => {
    await page.goto('/play?level=3')
    await expect(page.locator('[data-testid="minigame-fish-feed"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerFishFeed(page, r < 8)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('8')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('80')
    await expect(page.locator('.star-svg.earned')).toHaveCount(2)
  })

  test.skip('memory-match (level 4) 40%: 2/5 — no wrong-round path', async ({ page }) => {
    void page
  })

  test.skip('memory-match (level 4) 80%: 4/5 — no wrong-round path', async ({ page }) => {
    void page
  })

  test('starfish-match (level 6) 40%: 4/10, score 40%, 1 star', async ({ page }) => {
    await page.goto('/play?level=6')
    await expect(page.locator('[data-testid="minigame-starfish-match"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerStarfishMatch(page, r < 4)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('4')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('40')
    await expect(page.locator('.star-svg.earned')).toHaveCount(1)
  })

  test('starfish-match (level 6) 80%: 8/10, score 80%, 2 stars', async ({ page }) => {
    await page.goto('/play?level=6')
    await expect(page.locator('[data-testid="minigame-starfish-match"]')).toBeVisible({ timeout: 10000 })
    for (let r = 0; r < 10; r++) await answerStarfishMatch(page, r < 8)
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('8')
    await expect(page.locator('.performance-bar')).toContainText('10')
    await expect(page.locator('.stat-value').first()).toContainText('80')
    await expect(page.locator('.star-svg.earned')).toHaveCount(2)
  })
})

/** Complete one Bouw de Toren tower (correct or wrong). Uses keyboard: select block, zone, Enter. */
async function completeBouwDeToren(
  page: import('@playwright/test').Page,
  correct: boolean
): Promise<void> {
  const puzzle = page.locator('[data-testid="tower-puzzle"]')
  await expect(puzzle).toBeVisible()
  const target = Number(await puzzle.locator('.target-display').textContent())
  const blocks = puzzle.locator('button.block')
  const count = await blocks.count()
  let valA = 0
  let valB = 0
  for (let i = 0; i < count - 1; i++) {
    for (let j = i + 1; j < count; j++) {
      const va = Number(await blocks.nth(i).textContent())
      const vb = Number(await blocks.nth(j).textContent())
      const isCorrect = va + vb === target
      if (correct ? isCorrect : !isCorrect) {
        valA = va
        valB = vb
        break
      }
    }
    if (valA !== 0 || valB !== 0) break
  }
  if (valA === 0 && valB === 0) throw new Error('No matching block pair found')

  const blockA = blocks.filter({ hasText: String(valA) }).first()
  const blockB = blocks.filter({ hasText: String(valB) }).first()
  await blockA.focus()
  await page.keyboard.press('Enter')
  await puzzle.locator('[data-drop-zone="1"]').focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(100)
  await blockB.focus()
  await page.keyboard.press('Enter')
  await puzzle.locator('[data-drop-zone="2"]').focus()
  await page.keyboard.press('Enter')

  await expect(page.locator('text=Volgende ronde').or(page.locator('[data-testid="level-complete-modal"]'))).toBeVisible({ timeout: 5000 })
  const nextBtn = page.locator('[data-testid="tower-next-puzzle"]')
  if (await nextBtn.isVisible()) {
    await nextBtn.click()
    await page.waitForTimeout(300)
  }
}

test.describe('minigame result modal — Bouw de Toren', () => {
  test.describe.configure({ retries: 2 })


  async function getBouwDeTorenTotalRounds(puzzle: import('@playwright/test').Locator): Promise<number> {
    const slots = puzzle.locator('.tower-progress-slot')
    const slotCount = await slots.count()
    if (slotCount > 0) return slotCount
    const targetNode = puzzle.locator('.tower-round-progress-node-target')
    return Number(await targetNode.textContent()) || 0
  }

  test('bouw-de-toren (level 5) 0 stars: all wrong towers', async ({ page }) => {
    test.setTimeout(120000)
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })
    const puzzle = page.locator('[data-testid="tower-puzzle"]')
    await expect(puzzle).toBeVisible()
    const totalRounds = await getBouwDeTorenTotalRounds(puzzle)
    for (let r = 0; r < totalRounds; r++) {
      await completeBouwDeToren(page, false)
    }
    await assertModalVisible(page)
    await expect(page.locator('.performance-bar')).toContainText('0')
    await expect(page.locator('.star-svg.earned')).toHaveCount(0)
    await expect(page.locator('.stat-item').filter({ hasText: /combo/i }).locator('.stat-value')).toContainText('x0')
  })

  test('bouw-de-toren (level 5) 3 stars: all correct towers', async ({ page }) => {
    test.setTimeout(120000)
    await page.goto('/play?level=5')
    await expect(page.locator('[data-testid="minigame-bouw-de-toren"]')).toBeVisible({ timeout: 10000 })
    const puzzle = page.locator('[data-testid="tower-puzzle"]')
    await expect(puzzle).toBeVisible()
    const totalRounds = await getBouwDeTorenTotalRounds(puzzle)
    for (let r = 0; r < totalRounds; r++) {
      await completeBouwDeToren(page, true)
    }
    await assertModalVisible(page)
    const perfBar = page.locator('.performance-bar')
    await expect(perfBar).toContainText(String(totalRounds))
    await expect(page.locator('.star-svg.earned')).toHaveCount(3)
    await expect(page.locator('.stat-item').filter({ hasText: /combo/i }).locator('.stat-value')).toContainText('x0')
  })
})
