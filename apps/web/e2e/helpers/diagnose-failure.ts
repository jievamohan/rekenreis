import path from 'path'
import { fileURLToPath } from 'url'
import type { Page } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// CI: e2e/ is read-only; use playwright-report (writable)
const SCREENSHOT_DIR = process.env.CI
  ? path.join(__dirname, '..', '..', 'playwright-report')
  : path.join(__dirname, '..')

export interface DiagnoseResult {
  url: string
  hasAuthPage: boolean
  hasProfileSelector: boolean
  hasPlayLoading: boolean
  hasProblemCard: boolean
  bodySnippet: string
  screenshotPath: string
  debugAuth?: Record<string, unknown>
}

export async function diagnoseOnFailure(
  page: Page,
  label: string
): Promise<DiagnoseResult> {
  const safeLabel = label.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50) || 'screenshot'
  const screenshotPath = path.join(SCREENSHOT_DIR, `.fail-${safeLabel}.png`)
  const url = page.url()
  const hasAuthPage = await page.locator('.auth-page').isVisible().catch(() => false)
  const hasProfileSelector = await page
    .locator('.profile-selector')
    .isVisible()
    .catch(() => false)
  const hasPlayLoading = await page
    .locator('.play-loading')
    .isVisible()
    .catch(() => false)
  const hasProblemCard = await page
    .locator('.problem-card')
    .isVisible()
    .catch(() => false)
  const bodyText = await page.locator('body').innerText().catch(() => '')
  await page.screenshot({ path: screenshotPath })
  let debugAuth: Record<string, unknown> | undefined
  try {
    debugAuth = await page.evaluate(async () => {
      const r = await fetch('/api/debug/auth-flow', { credentials: 'include', headers: { Accept: 'application/json' } })
      return r.ok ? await r.json() : { error: `HTTP ${r.status}` }
    })
  } catch {
    debugAuth = { error: 'fetch failed' }
  }
  return {
    url,
    hasAuthPage,
    hasProfileSelector,
    hasPlayLoading,
    hasProblemCard,
    bodySnippet: bodyText.slice(0, 500),
    screenshotPath,
    debugAuth,
  }
}
