# Solution — Epic 23: Playwright CI Speed

## Benchmark Baseline (to be documented in Epic 23.1)

- **Metric:** Total e2e-container job duration.
- **Current:** ~2+ minutes (Playwright "20 passed (2.0m)").
- **Target:** < 60 seconds.

## Solution Levers (ordered by impact)

### 1. Increase Playwright Workers (high impact)

- **Current:** `workers: 1` in CI.
- **Change:** `workers: 2` or `workers: 4` (CPU-bound; 2–4 is typical for CI).
- **Risk:** Low. May need to ensure tests are isolated (no shared state).
- **Expected gain:** ~40–60% reduction in test execution time.

### 2. Consolidate or Shard Projects (high impact)

- **Current:** `chromium` + `visual` projects run all tests twice.
- **Change A:** Run visual tests only for visual specs (e.g. `e2e/visual/*.spec.ts`).
- **Change B:** Merge into single project; visual specs use viewport override.
- **Expected gain:** ~50% fewer test runs if visual runs only visual specs.

### 3. Cache pnpm/node_modules in E2E Container (medium impact)

- **Current:** `pnpm install --frozen-lockfile` inside e2e container every run.
- **Change:** Pre-install in web image or use a dedicated e2e image with deps baked in.
- **Alternative:** Mount pnpm store from job cache; reuse across runs.
- **Expected gain:** 10–30s per run.

### 4. Reduce Test Count / Deduplication (medium impact)

- **Current:** interaction-diversity, mechanic-upgrades, sorting-sequence, minigame overlap.
- **Change:** Consolidate overlapping tests; keep one canonical suite per interaction type.
- **Expected gain:** 20–40% fewer tests.

### 5. Optimize Slow Tests (medium impact)

- **Current:** mistakes-review.spec.ts ~30s.
- **Change:** Reduce wait timeouts, use faster assertions, or split.
- **Expected gain:** 10–20s.

### 6. Parallelize e2e with Other Gates (low impact for Playwright itself)

- e2e-container already runs in parallel with gate-c, gate-d, gate-f, zap-baseline, lint-test.
- No change needed for Playwright job itself.

### 7. Shard Playwright Across Multiple Jobs (advanced)

- Split specs across 2–3 jobs; run in parallel.
- Requires CI config changes; more complex.
- Defer to later slice if <60s not achieved.

## Recommended Order

1. **23.1:** Benchmark + document baseline; add timing to CI output.
2. **23.2:** Increase workers to 2–4; consolidate projects (visual-only for visual specs).
3. **23.3:** Cache pnpm in e2e path; optimize slow tests.
4. **23.4:** Deduplicate tests if still >60s; fine-tune.
