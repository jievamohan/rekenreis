import { test as base } from '@playwright/test'
import { diagnoseOnFailure } from './helpers/diagnose-failure'

export const E2E_PROFILE = {
  version: 1 as const,
  activeProfileId: 'p_e2e_auth',
  profiles: [
    {
      id: 'p_e2e_auth',
      name: 'E2E Test',
      avatarId: 'default' as const,
      maatjeId: 'wolkje' as const,
      progress: { bestScore: 0, levelProgress: {}, currentLevel: 1 },
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

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await page.addInitScript((schema: string) => {
      localStorage.setItem('rekenreis_profiles_v1', schema)
    }, JSON.stringify(E2E_PROFILE))
    await use(page)
    // On any failure, capture diagnostic for CI (url, hasAuthPage, etc.)
    if (testInfo.status !== 'passed' && testInfo.status !== 'skipped') {
      try {
        const slug = testInfo.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 40)
        const diag = await diagnoseOnFailure(page, `fail-${slug}`)
        console.error(`E2E DIAGNOSE [${testInfo.title}]: ${JSON.stringify(diag)}`)
      } catch {
        // ignore
      }
    }
  },
})

export { expect } from '@playwright/test'
