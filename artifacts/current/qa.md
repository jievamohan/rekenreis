# QA — Epic 26

## QA Strategist Output

### Unit tests required
- MapDecor: optional unit test for item count and x-range (0–100%) if logic is extracted.
- Scroll logic: difficult to unit test in isolation; rely on E2E.

### E2E smoke updates
- `e2e/map.spec.ts` (or equivalent): add assertion that after navigating to /map, the current level node is in view (e.g. visible, or scroll position is non-zero when current level > 3).
- Add assertion: decoration elements exist and are distributed (e.g. multiple img elements with decor-item class).

### Non-flaky UI assertions
- Use `waitFor` or similar for scroll to complete before asserting.
- Avoid asserting exact scroll position; prefer "element is in viewport" or "scrollTop > 0 when currentLevel > 2".

### Visual regression approach
- Update map page screenshot baseline if visual change is significant (full-width dense decor).
- Run `docker compose run --rm e2e pnpm exec playwright test` for visual project.
