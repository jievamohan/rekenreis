# Epic 23 Design Bible — Playwright CI Speed

> PlanRef (master): artifacts/archive/epic-23.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Developers, CI/CD pipeline.
- **Primary experience goal:** Playwright CI job completes in < 60 seconds.
- **“Looks/feels like” acceptance criteria:** PR feedback faster; e2e-container job duration < 60s.
- **Non-goals:** Changing test logic; adding tests; migrating CI provider.

## 2. Visual Direction (Art Director)

N/A: Infra-only. No visual changes.

## 3. UX Layout & Components (UX Designer)

N/A: Infra-only. No user-facing changes.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Infra-only. No motion or audio.

## 5. Accessibility (UX + QA)

N/A: Infra-only. E2E tests remain; no a11y impact.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Files:** `.github/workflows/gates.yml`, `apps/web/playwright.config.ts`, `docker-compose*.yml`, e2e specs.
- **Levers:** Workers (1→2–4), project consolidation (visual-only for visual specs), pnpm cache in e2e, slow-test optimization, test deduplication.
- **Constraints:** Container-only Playwright (policy 64); all tests must stay green.
- **Baseline:** Document in docs/runbooks or scripts; CI outputs duration.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Invariant:** All existing Playwright tests remain green.
- **Benchmark:** Add timing to CI; document baseline.
- **No flakiness:** Workers > 1 requires test isolation (no shared state).

## 8. Security/Privacy Notes (Security/Privacy)

- **New risks:** Low. Standard CI caching/parallelization.
- **Cache keys:** Must include lockfile hash (already in place).
- **Gate D:** Must remain green.

## 9. Slice Map (Orchestrator)

| Slice | Title | Visual Milestone | Acceptance |
|-------|-------|------------------|------------|
| 23.1 | Benchmark & Baseline | Baseline documented | Benchmark script; baseline in runbook |
| 23.2 | Workers & Project Consolidation | Duration ~50% reduced | workers 2–4; visual-only for visual specs; tests pass |
| 23.3 | pnpm Cache & Slow Test Optimization | Additional 15–25s saved | pnpm cached; mistakes-review optimized |
| 23.4 | Fine-Tune to <60s | Job < 60s | Deduplicate if needed; final config documented |
