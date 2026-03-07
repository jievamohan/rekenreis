# Epic 25 Design Bible — E2E Container Install Optimization

> PlanRef (master): artifacts/archive/epic-25.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Developers, CI pipeline.
- **Primary experience goal:** Install-stap binnen Playwright e2e run nagenoeg geëlimineerd; container hergebruik effectief.
- **"Looks/feels like" acceptance criteria:**
  - Geen `npm install -g pnpm@9` per run
  - Geen `pnpm install` in container bij cache hit (of gereduceerd tot seconden)
  - e2e image gecached; hergebruik bij lockfile-ongewijzigd
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

- **Files:** `apps/web/Dockerfile.e2e` (of `docker/e2e/Dockerfile`), `docker-bake.hcl`, `.github/workflows/gates.yml`, `scripts/ci/e2e-benchmark.sh`, `docker-compose.yml`, `docker-compose.ci.yml`, `docs/runbooks/e2e-benchmark.md`
- **Approach:**
  1. Custom e2e image FROM playwright + RUN pnpm install -g pnpm@9
  2. Bake target voor e2e; GHA cache (key op lockfile)
  3. e2e-benchmark.sh: geen npm install -g pnpm; direct pnpm
  4. Optioneel: node_modules pre-bake in image bij lockfile
- **Constraints:** Container-only Playwright (policy 64); Gate C/D/F groen.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Invariant:** All existing Playwright tests remain green.
- **Regression:** Na elke slice CI run; e2e-container moet slagen.
- **Cache miss fallback:** Job moet ook slagen bij cache miss.

## 8. Security/Privacy Notes (Security/Privacy)

- **New risks:** Low. Standard CI caching.
- **Cache keys:** Deterministic; no secrets.
- **Gate D:** Must remain green.

## 9. Slice Map (Orchestrator)

| Slice | Title | Visual Milestone | Acceptance |
|-------|-------|------------------|------------|
| 25.1 | Benchmark e2e install timing | Baseline per stap gedocumenteerd | CI output duur install-stap; runbook |
| 25.2 | Custom e2e image met pnpm | e2e image gebouwd en gecached | Dockerfile + bake; GHA cache |
| 25.3 | Elimineer runtime installs | Geen pnpm install in container | e2e-benchmark.sh + compose aangepast |
| 25.4 | Fine-tune & documenteer | Target bereikt | Extra optimalisaties; runbook final |
