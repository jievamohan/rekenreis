# Epic 24 Design Bible — Playwright CI Spinup Optimization

> PlanRef (master): artifacts/archive/epic-24.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Developers, CI pipeline.
- **Primary experience goal:** Playwright e2e-container job spinup (Build images + Start stack) nagenoeg instantaan — geen ~1m30s meer voor deze twee stappen.
- **"Looks/feels like" acceptance criteria:**
  - Build images (cached): cache hit → geen rebuild of minimale rebuild
  - Start stack (no rebuild): MySQL image uit cache → geen pull
  - Totale spinup significant korter
- **Non-goals:** Migreren CI provider; wijzigen test logic; nieuwe tests.

## 2. Visual Direction (Art Director)

N/A: Infra-only. No visual changes.

## 3. UX Layout & Components (UX Designer)

N/A: Infra-only. No user-facing changes.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Infra-only. No motion or audio.

## 5. Accessibility (UX + QA)

N/A: Infra-only. E2E tests remain; no a11y impact.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Files:** `.github/workflows/gates.yml`, `scripts/ci/e2e-benchmark.sh`, `docs/runbooks/e2e-benchmark.md`
- **Levers:**
  1. MySQL image cache in e2e-container (copy pattern from zap-baseline)
  2. Build cache fix: docker/bake-action GHA cache — onderzoek waarom cache miss
  3. Stap-timing benchmark om baseline te meten
- **Constraints:** Container-only Playwright (policy 64); Gate C/D/F groen.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Invariant:** All existing Playwright tests remain green.
- **Regression:** Na elke slice CI run; e2e-container moet slagen.
- **Cache miss fallback:** Job moet ook slagen bij cache miss (pull/build).

## 8. Security/Privacy Notes (Security/Privacy)

- **New risks:** Low. Standard CI caching.
- **Cache keys:** Deterministic; no secrets.
- **Gate D:** Must remain green.

## 9. Slice Map (Orchestrator)

| Slice | Title | Visual Milestone | Acceptance |
|-------|-------|------------------|------------|
| 24.1 | Benchmark & Stap-timing | Baseline per stap gedocumenteerd | CI output duur per stap; runbook bijgewerkt |
| 24.2 | MySQL Image Cache | Start stack sneller | MySQL cache in e2e-container; geen pull bij hit |
| 24.3 | Build Cache Fix | Build images sneller | Bake cache hit effectief; geen rebuild bij hit |
| 24.4 | Fine-tune | Spinup nagenoeg instantaan | Extra optimalisaties; target bereikt |
