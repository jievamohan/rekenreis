# Epic 46 Design Bible — Production Deployment

> PlanRef (master): artifacts/archive/epic-46.0/latest  
> Living document for production deployment on TransIP VPS + DirectAdmin.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience**: Ops/beheer, ontwikkelaars
- **Primary experience goal**: Eén public folder voor Laravel API + Vue frontend; dev blijft werken, prod werkt op DirectAdmin
- **Acceptance criteria**:
  - DirectAdmin public folder = apps/api/public
  - /api/* → Laravel; /* → Vue SPA
  - Build artifacts geautomatiseerd (pre-push)
  - Makefile met deploy targets
- **Non-goals**: CDN, Kubernetes, meerdere prod-omgevingen

## 2. Visual Direction (Art Director)

N/A: Geen visuele wijzigingen.

## 3. UX Layout & Components (UX Designer)

N/A: Geen UX-wijzigingen.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Geen motion/audio-wijzigingen.

## 5. Accessibility (UX + QA)

Geen wijziging; bestaande a11y blijft.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Unified public folder**: Vue build output (nuxt generate → .output/public) kopiëren naar apps/api/public
- **Merge-strategie**: index.php en .htaccess van Laravel behouden; Vue levert index.html en _nuxt/
- **Routing (.htaccess)**:
  1. Bestand bestaat → serveer
  2. /api/* → index.php
  3. Anders → index.html (SPA fallback)
- **Build**: Script of Makefile target; dev ongewijzigd (Docker)
- **Config**: NUXT_PUBLIC_API_URL relatief of prod URL; .env.example

## 7. Test Strategy & Regression Plan (QA Strategist)

- Bestaande tests blijven groen
- Optioneel: lokaal smoke tegen prod build (php -S -t public)
- Pre-push verifieert build + artifacts

## 8. Security/Privacy Notes (Security/Privacy)

- Geen secrets in Makefile; env vars
- APP_DEBUG=false op prod
- .htaccess: alleen bedoelde routes

## 9. Slice Map (Orchestrator)

- **Epic 46.1** — Unified public folder + routing
  - Build script kopieert Vue output naar apps/api/public
  - .htaccess: /api → index.php, SPA fallback
  - Dev blijft Docker; prod-ready structuur
  - Acceptance: build produceert unified folder; lokaal php -S werkt

- **Epic 46.2** — Build automation + pre-push
  - Pre-push hook: run build, verify artifacts
  - Build artifacts in git of CI; geautomatiseerd
  - Acceptance: pre-push faalt als build niet gedaan of artifacts ontbreken

- **Epic 46.3** — Makefile deploy scripts
  - Targets: build, deploy, deploy-pull, deploy-rsync
  - TransIP/DirectAdmin runbook
  - Acceptance: make build, make deploy-pull werken

- **Epic 46.4** — Production config + docs
  - runtimeConfig apiUrl voor prod
  - .env.example, runbook
  - Acceptance: prod build gebruikt juiste API URL; docs compleet
