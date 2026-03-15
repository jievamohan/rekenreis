/**
 * TEMPORARY: Extra debug output when E2E tests fail.
 * Remove after CI/auth issues are resolved.
 *
 * On failure: logs URL, title, visible text, attaches screenshot.
 * IMPORT: Only import from *.spec.ts files, NOT from fixtures — otherwise CI fails.
 */
import { test } from '@playwright/test'

const DEBUG_FAIL = process.env.E2E_DEBUG_FAIL !== '0'

test.afterEach(async ({ page }, testInfo) => {
  if (!DEBUG_FAIL || testInfo.status === 'passed' || testInfo.status === 'skipped') return

  try {
    const url = page.url()
    const title = await page.title()
    const bodyText = await page
      .locator('body')
      .innerText()
      .catch(() => '(could not get body text)')
    const preview = bodyText.replace(/\s+/g, ' ').trim().slice(0, 600)

    console.error('\n--- E2E FAIL DEBUG ---')
    console.error(`Test: ${testInfo.title}`)
    console.error(`URL: ${url}`)
    console.error(`Title: ${title}`)
    console.error(`Body preview: ${preview}${bodyText.length > 600 ? '...' : ''}`)
    console.error('---')

    const screenshot = await page.screenshot({ path: undefined }).catch(() => null)
    if (screenshot) {
      await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' })
    }
  } catch (e) {
    console.error('[E2E FAIL] Could not capture debug info:', String(e))
  }
})
