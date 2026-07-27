import { testNoProfileSeed as test, expect } from './fixtures/authenticated'
import './debug-failure-hooks'

const PERSIST_LEVEL = 7

const progressSchema = {
  version: 1 as const,
  activeProfileId: 'api_profile',
  profiles: [
    {
      id: 'api_profile',
      name: 'E2E Persist',
      avatarId: 'default' as const,
      maatjeId: 'wolkje' as const,
      progress: {
        bestScore: 0,
        levelProgress: { 1: { stars: 3 }, 6: { stars: 2 } },
        currentLevel: PERSIST_LEVEL,
      },
      prefs: {
        lastMode: 'classic' as const,
        lastSkin: 'classic' as const,
        difficultyCeiling: 'upTo10' as const,
        hintsOn: true,
        soundOn: true,
        timersDisabled: true,
      },
      telemetryOptOut: true,
    },
  ],
}

test.describe('progress persist across refresh', () => {
  test('reload keeps currentLevel from API', async ({ page }) => {
    await page.goto('/map', { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.evaluate(() => localStorage.removeItem('rekenreis_profiles_v1'))

    const putDone = page.waitForResponse(
      (r) =>
        r.url().includes('/api/progress') &&
        r.request().method() === 'PUT' &&
        r.ok(),
      { timeout: 15000 }
    )

    await page.evaluate(async (schema) => {
      const res = await fetch('/api/progress', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(
            document.cookie
              .split('; ')
              .find((c) => c.startsWith('XSRF-TOKEN='))
              ?.split('=')
              .slice(1)
              .join('=') ?? ''
          ),
        },
        body: JSON.stringify({ progress: schema }),
      })
      if (!res.ok) {
        throw new Error(`PUT /api/progress failed: ${res.status}`)
      }
    }, progressSchema)

    await putDone

    const getAfterReload = page.waitForResponse(
      (r) =>
        r.url().includes('/api/progress') &&
        r.request().method() === 'GET' &&
        r.ok(),
      { timeout: 15000 }
    )
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 })
    await getAfterReload

    await expect(page.locator('.play-current-cta')).toHaveText(`Speel level ${PERSIST_LEVEL}`, {
      timeout: 15000,
    })
  })
})
