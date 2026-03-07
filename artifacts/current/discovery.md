# Discovery — Epic 24 (Business Analyst)

## Problem Statement

Bij het runnen van een merge request (GitHub Actions) duurt de Playwright e2e-container job te lang door:

1. **Build images (cached):** Ondanks "cached" in de naam worden images toch gebouwd — GHA cache lijkt niet effectief te worden gebruikt.
2. **Start stack (no rebuild):** De MySQL image wordt elke run opnieuw gepulled (alle layers), terwijl zap-baseline job wel MySQL cached.

Deze twee stappen alleen al duren ~1m30s. De gebruiker wil dat Playwright tests **nagenoeg instantaan** runnen, zonder al te veel spinup en scaffolding.

## Target Audience

- Developers die PRs openen en snel feedback willen
- CI pipeline efficiency

## Success Criteria

- Build images (cached) stap: cache hit → geen rebuild (of minimale rebuild)
- Start stack (no rebuild) stap: MySQL image uit cache → geen pull
- Totale spinup (build + start) significant korter dan huidige ~1m30s
- Playwright tests zelf blijven container-only (policy 64)

## Non-Goals

- Migreren naar andere CI provider
- Playwright test logic wijzigen
- Nieuwe tests toevoegen
