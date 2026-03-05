# Epic 20 — QA Strategy

> Planning document. No code changes.
> QA Strategist perspective for Rekenreis UI rebuild.

---

## 1. Playwright Setup

### 1.1 Create `playwright.config.ts`

**Location:** `apps/web/playwright.config.ts`

**Configuration:**
- **Base URL:** `process.env.BASE_URL || 'http://localhost:3000'` (e2e container uses `BASE_URL=http://web:3000`)
- **Timeout:** `testTimeout: 15000`, `expect.timeout: 5000`
- **Projects:** `chromium` (default), optionally `firefox`, `webkit` for cross-browser
- **Web server:** `webServer: { command: 'pnpm dev', url: BASE_URL, reuseExistingServer: !process.env.CI }` — **skip in container**; e2e runs against already-running `web` service
- **Screenshot:** `screenshot: 'only-on-failure'` for default; visual project uses `only-on-failure` or `on`
- **Video:** `video: 'retain-on-failure'` (optional)
- **Trace:** `trace: 'retain-on-failure'` for debugging

**Container-specific:** When run via `docker compose run --rm e2e`, `BASE_URL=http://web:3000` is set. Do **not** start a local dev server; assume `web` is up. Use `webServer: undefined` or conditional: only start if `!process.env.BASE_URL`.

```ts
// Example structure (do not create; planning only)
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'visual', testMatch: /visual\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
  // No webServer when BASE_URL is set (container mode)
  webServer: process.env.BASE_URL ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 1.2 E2E Directory Structure

```
apps/web/
├── playwright.config.ts
├── e2e/
│   ├── map.spec.ts
│   ├── play.spec.ts
│   ├── level-complete.spec.ts
│   ├── mistakes-review.spec.ts
│   ├── visual/
│   │   ├── map-visual.spec.ts
│   │   ├── play-visual.spec.ts
│   │   └── level-complete-visual.spec.ts
│   └── fixtures/
│         └── test-profile.ts  (optional: seed localStorage)
```

### 1.3 Run Command

Per `.cursor/rules/64-container-only-playwright.mdc`:

```bash
docker compose run --rm e2e pnpm exec playwright test
```

Ensure `e2e` service has `pnpm` and `@playwright/test` available. Add to `apps/web/package.json` if needed:

```json
"test:e2e": "playwright test"
```

E2E service uses `working_dir: /repo/apps/web`; run `pnpm install` in e2e Dockerfile or entrypoint if deps are missing.

---

## 2. E2E Test Plan (Per Screen)

### 2.1 Map Screen (`/map`)

| Test | Selectors | Assertions |
|------|-----------|------------|
| Map page loads | `page.goto('/map')` | `expect(page).toHaveURL(/\/map/)` |
| Path visible | `[data-testid="map-path"]` or `svg path` | `expect(path).toBeVisible()` |
| Nodes rendered | `[data-testid="map-node"]` | `expect(nodes).toHaveCount(N)` (N = level count) |
| Current node highlighted | `[data-testid="map-node"][data-state="current"]` | `expect(currentNode).toBeVisible()` |
| Locked nodes show lock | `[data-testid="map-node"][data-state="locked"] .lock` | `expect(lock).toBeVisible()` |
| Completed nodes show star | `[data-testid="map-node"][data-state="completed"] .star` | `expect(star).toBeVisible()` |
| Play button present | `role=link[name=/Play/i]` or `[data-testid="play-cta"]` | `expect(btn).toBeVisible()` |
| Play navigates to play | Click Play | `expect(page).toHaveURL(/\/play/)` |
| Avatar at current node | `[data-testid="map-avatar"]` | `expect(avatar).toBeVisible()` |

**Data-testid recommendations:** Add `data-testid` to MapPath, MapNode, MapAvatar, Play CTA for stable selectors.

---

### 2.2 Play Screen (`/play`)

| Test | Selectors | Assertions |
|------|-----------|------------|
| Play page loads | `page.goto('/play')` | `expect(page).toHaveURL(/\/play/)` |
| Problem card visible | `[data-testid="problem-card"]` or `.prompt` | `expect(card).toContainText(/\+/)` |
| Keypad visible | `[data-testid="keypad"]` | `expect(keypad).toBeVisible()` |
| Digits 0-9 present | `[data-testid="keypad"] button` | `expect(buttons).toHaveCount(>=12)` |
| Check button present | `role=button[name=/Check|Controleer/i]` | `expect(checkBtn).toBeVisible()` |
| Enter answer and submit | Type digits, click Check | Feedback area visible |
| Correct feedback | After correct answer | `expect(page.getByRole('status')).toContainText(/Correct/i)` |
| Wrong feedback | After wrong answer | `expect(page.getByRole('status')).toContainText(/Not quite|answer/i)` |
| Next button after feedback | `role=button[name=/Next/i]` | `expect(nextBtn).toBeVisible()` |
| Keyboard playable | Tab to keypad, Enter to submit | Same assertions as click |

---

### 2.3 Level Complete Modal

| Test | Selectors | Assertions |
|------|-----------|------------|
| Modal appears on level complete | Trigger level complete in pack mode | `expect(modal).toBeVisible()` |
| Mascot visible | `[data-testid="level-complete-mascot"]` or `img[alt*="mascot"]` | `expect(mascot).toBeVisible()` |
| Stars visible | `[data-testid="level-complete-stars"]` | `expect(stars).toBeVisible()` |
| Next button | `role=button[name=/Next/i]` in modal | `expect(nextBtn).toBeVisible()` |
| Next closes modal / navigates | Click Next | Modal gone or URL changed |
| Accessible (focus trap) | Tab through modal | Focus stays within modal until Next |

---

### 2.4 Mistakes Review Screen

| Test | Selectors | Assertions |
|------|-----------|------------|
| Review appears when mistakes exist | Complete level with wrong answers | `expect(review).toBeVisible()` or navigate to `/mistakes` |
| Mistake cards listed | `[data-testid="mistake-card"]` | `expect(cards).toHaveCount(N)` |
| Each card shows problem | `{{ a }} + {{ b }}` | `expect(card).toContainText(/\d+ \+ \d+/)` |
| Each card shows correct answer | | `expect(card).toContainText(/correct|answer/i)` |
| CTA present | "Try again" or "Back to map" | `expect(cta).toBeVisible()` |

---

## 3. Visual Regression Strategy

### 3.1 Approach

- Use Playwright's `expect(page).toHaveScreenshot()` for baseline comparison.
- Store baselines in `apps/web/e2e/visual/snapshots/` (or `playwright/.screenshots`).
- Run visual tests in a **dedicated project** with fixed viewport (e.g. 1280×720) for consistency.
- On CI: compare against committed baselines; fail on diff. Use `--update-snapshots` only when intentional.

### 3.2 Baseline Management

- **Initial:** Run `docker compose run --rm e2e pnpm exec playwright test --project=visual --update-snapshots` to generate baselines.
- **Commit:** Baselines committed to repo.
- **CI:** Run visual tests without `--update-snapshots`; any pixel diff fails the build.
- **Review:** If UI change is intentional, re-run with `--update-snapshots` and commit new baselines.

### 3.3 Flakiness Mitigation

- **Disable animations:** Use `page.emulateMedia({ reducedMotion: 'reduce' })` before screenshot to avoid animation mid-frame.
- **Wait for stable state:** `await expect(element).toBeVisible()` before screenshot.
- **Fixed viewport:** `viewport: { width: 1280, height: 720 }` for all visual tests.
- **Exclude dynamic content:** Use `mask` option to mask timestamps, scores, or random elements if needed.

---

## 4. Screenshot Targets (Per Micro-Epic)

| Micro-Epic | Screenshot Target | Selector |
|------------|-------------------|----------|
| Map | Full map page | `page` or `[data-testid="map-page"]` |
| Map | Node states (completed, current, locked) | `[data-testid="map-nodes"]` |
| Play | Problem card + keypad | `[data-testid="game-main"]` |
| Play | Feedback (correct) | `[data-testid="feedback"]` or `.feedback` |
| Level complete | Modal | `[data-testid="level-complete-modal"]` |
| Mistakes | Review list | `[data-testid="mistakes-review"]` |

---

## 5. Accessibility Testing

### 5.1 Keyboard Navigation

| Test | Steps | Assertion |
|------|-------|-----------|
| Map: Tab to Play | Tab through map | Play CTA receives focus |
| Map: Enter activates Play | Focus on Play, press Enter | Navigate to /play |
| Play: Tab to keypad | Tab from problem card | First keypad key focusable |
| Play: Tab through keypad | Tab | All keys reachable |
| Play: Enter submits | Focus on Check, Enter | Answer submitted |
| Modal: Focus trap | Open modal, Tab repeatedly | Focus cycles within modal |
| Modal: Escape closes | Open modal, Escape | Modal closes (if design allows) |

### 5.2 Reduced Motion

| Test | Steps | Assertion |
|------|-------|-----------|
| Reduced motion: no confetti | `page.emulateMedia({ reducedMotion: 'reduce' })`, open level complete | No confetti elements visible (or static only) |
| Reduced motion: no path draw | Load map with reduced motion | Path visible immediately (no animation) |
| Reduced motion: no card slide | Load mistakes with reduced motion | Cards appear without slide animation |

### 5.3 Screen Reader / A11y

- Use `@axe-core/playwright` or Playwright's built-in a11y if available.
- Assert `role="dialog"` and `aria-modal="true"` on modals.
- Assert `aria-live="polite"` on feedback area.
- Assert `aria-label` or visible text on keypad keys.

---

## 6. Unit Test Updates

### 6.1 Composables That Need New Tests

| Composable | Change | Test to Add |
|------------|--------|-------------|
| **useLevelProgress** (new) | Read/write levelProgress, currentLevel | `getLevelStars`, `setLevelComplete`, `currentLevel` |
| **useMistakes** (new) | Collect mistakes during session | `addMistake`, `mistakes`, `clearMistakes` |
| **usePlayGame** | Support `initialPackIndex` for `?level=N` | When `level` query, packIndex starts at N-1 |
| **useSound** | No change | Existing tests sufficient |
| **useRoundOutcome** | No change | Existing tests sufficient |
| **useProfile** | `updateProfile` with levelProgress | Indirect via useLevelProgress |

### 6.2 Existing Test Files to Extend

- `usePlayGame.test.ts` — Add test for pack mode with initial index.
- New: `useLevelProgress.test.ts`, `useMistakes.test.ts`.

### 6.3 Profile Schema

- If `ProfileProgress` gains `levelProgress`, `currentLevel`: extend `profileSchema.test.ts` for migration and validation.

---

## 7. Non-Flaky UI Assertion Strategy

### 7.1 Principles

- **Prefer role + name over CSS:** `getByRole('button', { name: /Next/i })` over `.next-btn`.
- **Wait for visibility before interaction:** `await expect(btn).toBeVisible()` then `await btn.click()`.
- **Avoid timing-based waits:** Use `expect` auto-retry (Playwright waits up to `expect.timeout`).
- **Stable data:** Seed localStorage or use deterministic level pack for reproducible state.
- **Disable animations in tests:** `page.emulateMedia({ reducedMotion: 'reduce' })` to avoid animation-related flakiness.

### 7.2 Anti-Patterns to Avoid

- `page.waitForTimeout(1000)` — use `expect` or `waitFor` with condition.
- Asserting exact text that includes dynamic numbers (e.g. "Score: 5") — use `toContainText` or regex.
- Relying on DOM order for selection — use `data-testid` or `getByRole` with name.
- Screenshot during animation — use reduced motion or wait for animation end.

### 7.3 Recommended Selectors (Priority Order)

1. `getByRole` + `name` (accessible)
2. `getByTestId` (stable, requires adding `data-testid`)
3. `getByLabelText` for form fields
4. `getByText` for unique static text
5. CSS only as last resort (e.g. `.feedback-correct`)

---

*End of QA Strategy*
