import type { Page } from '@playwright/test'

export interface DiagnoseResult {
  url: string
  hasAuthPage: boolean
  hasProfileSelector: boolean
  hasPlayLoading: boolean
  hasProblemCard: boolean
  bodySnippet: string
  screenshotPath: string
}

export async function diagnoseOnFailure(
  page: Page,
  label: string
): Promise<DiagnoseResult> {
  const screenshotPath = `e2e/.fail-${label}.png`
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
  return {
    url,
    hasAuthPage,
    hasProfileSelector,
    hasPlayLoading,
    hasProblemCard,
    bodySnippet: bodyText.slice(0, 500),
    screenshotPath,
  }
}
