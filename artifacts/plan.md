# Plan: 0003-vertical-slice-skeleton

## Branch

**Active branch**: `feat/0003-vertical-slice-skeleton`

## Task Contract Validation

| Item | Status |
|------|--------|
| scope_in | ✓ Minimal E2E slice, env/config wiring, deterministic response |
| scope_out | ✓ No game logic, auth, persistence beyond proof |
| acceptance criteria | ✓ 5 items |
| lanes | ✓ W1, W2, A1, A2, T, I |
| gates | ✓ C, D, F |
| risks | ✓ infra, perf |

## Acceptance Criteria Mapping

| # | Criterion | Lane | Implementation |
|---|-----------|------|----------------|
| 1 | Web `/start` calls API and renders returned JSON | W1, W2 | Page + composable/service |
| 2 | API `GET /api/health` returns `{ status: 'ok', version: <string> }` | A1, A2 | Route + controller/service |
| 3 | docker compose brings up web+api+mysql; `/start` renders status ok | I | docker-compose.yml, env, Dockerfiles |
| 4 | Unit tests: web fetch (mocked), api endpoint | T | Vitest + PHPUnit |
| 5 | Gates C,D,F pass; CI green on PR | All | typecheck, security, perf, CI |

## Wave Plan

### Wave 0: Shared config (I lane, serialized)
- Root `.env.example` with `API_URL` for web
- `docker-compose.yml` with web, api, mysql services
- `apps/web/Dockerfile`, `apps/api/Dockerfile`
- Update `docs/runbooks/commands.md` with docker compose commands

### Wave 1: Backend (A2 → A1)
- A2: `apps/api/app/Services/HealthService.php` (returns status + version)
- A1: `apps/api/routes/api.php`, controller for `GET /api/health`
- Wire api routes in `bootstrap/app.php`

### Wave 2: Frontend (W2 → W1)
- W2: `apps/web/composables/useApi.ts` or `apps/web/utils/api.ts` (fetch helper)
- W2: `apps/web/nuxt.config.ts` runtimeConfig for `API_URL`
- W1: `apps/web/pages/start.vue` calls API, renders JSON

### Wave 3: Tests + hardening (T)
- T: Web unit test for fetch helper (mocked)
- T: API unit test for health endpoint
- Run gates, produce artifacts

## Lane Ownership

| Lane | Files | Owner |
|------|-------|-------|
| I | docker-compose.yml, .env.example, apps/**/Dockerfile, docs/runbooks/** | deps-infra |
| A2 | apps/api/app/Services/**, app/Domain/** | api |
| A1 | apps/api/routes/**, app/Http/Controllers/** | api |
| W2 | apps/web/composables/**, services/**, utils/** | web |
| W1 | apps/web/pages/**, components/** | web |
| T | apps/web/**/__tests__/**, apps/api/tests/** | tester |

## Integration Order

I → A2 → A1 → W2 → W1 → T
