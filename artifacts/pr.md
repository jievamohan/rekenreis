# PR: [0003] vertical-slice-skeleton

## Summary

Minimal end-to-end slice: Nuxt `/start` page calls Laravel `GET /api/health` and renders the JSON. Docker Compose brings up web, api, and mysql.

## Acceptance Criteria

- [x] Web has a page `/start` that calls API and renders the returned JSON
- [x] API exposes `GET /api/health` returning `{ status: 'ok', version: '1.0.0' }`
- [x] Running via docker compose brings up web+api+mysql, and `/start` renders status ok
- [x] Unit tests exist for: web fetch helper (mocked) and api endpoint response
- [ ] All gates pass (C,D,F) and CI is green on PR

## Commands Run

- `cd apps/web && pnpm run typecheck` ✓
- `cd apps/web && pnpm run test` ✓
- `cd apps/web && pnpm run build` ✓
- `cd apps/web && pnpm run size` ✓ (2.5M, baseline)
- `cd apps/api && composer run phpstan` ✓
- `cd apps/api && composer run test` ✓

## Risks

- **infra**: Docker networking + env wiring – minimal, documented in runbooks
- **perf**: Page lightweight – no heavy deps

## Rollback

Revert commit; remove docker-compose.yml, Dockerfiles if needed.

---

## PR Metadata

- **PR**: #4
- **URL**: https://github.com/jievamohan/rekenreis/pull/4
