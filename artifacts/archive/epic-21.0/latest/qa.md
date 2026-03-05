# QA Strategy — Epic 21

**Role:** qa-strategist  
**Epic:** 21 — Six New Minigames  
**Test runner:** Playwright via `docker compose run --rm e2e`

---

## Unit Test Strategy

### useMinigameServing
- **Deterministic seed:** Same seed produces identical minigame sequence across runs
- **No-repeat window:** No minigame repeats within configured window (e.g. last N)
- **Shuffle bag exhaustion/refill:** Bag refills correctly when exhausted; no gaps or duplicates in sequence
- **Coverage:** All branches for seed handling, window logic, bag state

### useDifficultyProgression
- **Math ranges scale correctly:** Per-chapter ranges match expected bounds (e.g. chapter 1: 1–5, chapter 2: 1–10)
- **Edge cases:** Chapter 0, max chapter, invalid chapter
- **Coverage:** Mapping from chapter → operand ranges, difficulty multipliers

### useI18n
- **All keys resolve:** No missing keys; fallback behavior documented
- **Key structure:** Nested keys (e.g. minigames.bubblePop.title) resolve correctly
- **Coverage:** All minigame-related keys, error states, empty states

### Mapping Table Validation
- **Level → minigame mapping:** All `levelIds` map to valid `minigameIds`
- **No orphan minigames:** Every referenced minigame exists and is implemented
- **Coverage:** Static validation of mapping table; no runtime surprises

---

## E2E Strategy (Playwright, Container-Only)

### Smoke Tests
- **Minigame renders:** Each of 6 minigames loads and displays
- **Interaction works:** Tap/drag/input responds; no dead UI
- **Answer submits:** Correct/incorrect flow completes; feedback visible

### Flow Tests
- **Map → play → minigame → complete → map:** Full round-trip without errors
- **Progress persistence:** Level complete state reflected on map
- **Navigation:** Back, retry, next level behave correctly

### Dutch Copy
- **No English strings on key pages:** Map, minigame screens, results use Dutch
- **i18n coverage:** No hardcoded English in visible UI

### Visual Regression
- **Screenshot baselines:** One baseline per minigame (initial state, post-interaction if needed)
- **Container consistency:** Screenshots taken in fixed viewport; same Docker env

---

## Non-Flaky Assertions

- **Avoid timing-dependent checks:** Use `data-testid` for element presence; avoid fixed `waitForTimeout`
- **Deterministic seeds:** Minigame sequence fixed per test; no random flakiness
- **Stable selectors:** Prefer `data-testid`, `aria-label` over CSS classes or DOM order
- **Wait for ready state:** Use Playwright `expect(locator).toBeVisible()` or custom ready attribute

---

## Test Data

- **Deterministic seeds:** All minigame serving tests use fixed seeds (e.g. `seed: 42`)
- **Reproducible sequences:** Same seed → same minigame order across CI and local
- **Fixtures:** Shared test data for chapters, levels, expected ranges

---

## Coverage Targets

| Area | Target |
|------|--------|
| 6 minigame components | All render, interact, submit |
| useMinigameServing | All branches, seed, bag, window |
| useDifficultyProgression | All chapters, ranges |
| useI18n composable | All minigame keys, fallbacks |
| Mapping table | Full validation |
