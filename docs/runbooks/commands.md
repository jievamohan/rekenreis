# Canonical Command List

Commands used by CI gates and local development. All paths relative to repo root.

**Quick start:** See [docs/quick-start.md](../quick-start.md).

## Local development: pnpm in container

**pnpm and npm commands MUST run inside the Docker container, never locally.** Use:

```bash
docker compose exec web pnpm <command>
```

Example: `docker compose exec web pnpm run typecheck`

## Gate C (Type-safety)

| App | Command | Notes |
|-----|---------|-------|
| web | `cd apps/web && pnpm run typecheck` | nuxt typecheck (vue-tsc) |
| api | `cd apps/api && composer run phpstan` | PHPStan via Larastan |

## Gate D (Security)

| Tool | Command | Notes |
|------|--------|-------|
| policy-check | `bash scripts/ci/policy-check.sh` | Config-file secrets (docker-compose, workflows, .env.example) |
| gitleaks | `gitleaks detect --no-git` | Secrets scan; uses `.gitleaks.toml` if present (install: https://github.com/gitleaks/gitleaks) |
| semgrep | `docker compose run --rm ci semgrep scan --config auto --config .semgrep --error` | SAST: auto + custom rules; run in ci container (no host pip) |
| pnpm audit | `cd apps/web && pnpm audit --prod` | Web deps |
| composer audit | `cd apps/api && composer run audit-deps` | API deps (audit reserved by Composer) |
| hadolint | `docker run --rm -i hadolint/hadolint < apps/web/Dockerfile` | Dockerfile lint (image cached in gate-d) |
| trivy config | `docker run --rm -v "$(pwd):/app" -w /app aquasec/trivy config .` | IaC/config scan (image cached in gate-d) |
| ZAP baseline | See `.github/workflows/gates.yml` zap-baseline job | DAST: web /start, /play; api /api/health, /api/session-stats |
| security-headers-check | `bash scripts/ci/security-headers-check.sh` | Requires stack running; asserts X-Frame-Options, X-Content-Type-Options, CORS |

## Gate F (Performance)

| App | Command | Notes |
|-----|---------|-------|
| web build | `cd apps/web && pnpm run build` | Must succeed |
| web size | `cd apps/web && pnpm run size` | Reports .output size; baseline in perf.md |

## CI Caching

- **pnpm**: Cached via `setup-node` with `cache-dependency-path: apps/web/pnpm-lock.yaml`
- **composer**: Cached via `actions/cache` with key `composer-${{ hashFiles('apps/api/composer.lock') }}`
- **Docker (zap-baseline)**: Buildx bake (parallel web+api) via `docker/bake-action` with GHA cache; `docker compose up --no-build`. Pre-pulled images (mysql:8.0, ghcr.io/zaproxy/zaproxy:stable) cached via `actions/cache` + `docker save`/`docker load` (restore-keys for fallback). ZAP scans run in parallel (4 targets).
- **pip (gate-d)**: Cached via `actions/cache` with key `pip-${{ runner.os }}-semgrep` for semgrep install
- **Docker pull (gate-d)**: hadolint + trivy images cached via `docker save`/`docker load` + `actions/cache`

## Lint & Test

| App | Command |
|-----|---------|
| web lint | `docker compose exec web pnpm run lint` | In web container |
| web test | `docker compose exec web pnpm run test` | In web container |
| api test | `cd apps/api && composer run test` |

## Docker Compose (vertical slice)

```bash
# Bring up web + api + mysql
docker compose up --build

# Web: http://localhost:3000/start
# Web game: http://localhost:3000/play
# API: http://localhost:8001/api/health
```

### Playwright (container-only)
- Build e2e image once: `docker compose build e2e` (or `docker buildx bake e2e`)
- Run e2e:
  - docker compose run --rm e2e pnpm install
  - docker compose run --rm e2e pnpm test:e2e
- **Benchmark:** See [e2e-benchmark.md](e2e-benchmark.md). CI uses `scripts/ci/e2e-benchmark.sh`; baseline ~2+ min.
- Run e2e with UI (optional):
  - docker compose run --rm -p 9323:9323 e2e pnpm playwright test --ui --host 0.0.0.0


## Smoke verification

1. `docker compose up --build`
2. **UI regression (Epic 18):** On any page, verify AppShell renders:
   - Top bar with profile pill and "Choose game" button
   - Nav tabs (Sticker book, Progress, Settings) with icons
   - Centered stage card wrapping page content
   - No plain white document background (gradient/playful background visible)
3. Visit http://localhost:3000/start — should show API health JSON inside stage card
4. Visit http://localhost:3000/play — should show math game (classic mode, infinite content), question, answer buttons
5. Visit http://localhost:3000/play?mode=classic — same as above (explicit classic)
6. Visit http://localhost:3000/play?mode=timed-pop — should show math game with countdown timer
7. For timed-pop: wait ~15s for timeout → "Time's up! The answer was X" → click Next → new question loads
8. Visit http://localhost:3000/play?mode=pack or /play?source=pack — should show math game with content pack levels
9. Visit http://localhost:3000/play?skin=monster-feed (or space, pirate) — should show that skin
10. Select an answer — feedback appears; click Next — new question loads (classic and timed-pop)
11. Click "Choose game" — mode selector opens with Classic, Timed Pop, Build Bridge; select Build Bridge — game switches to build-bridge mode
12. Visit http://localhost:3000/play?mode=build-bridge — graphical scene (background, bridge, character); planks as game objects; drag correct plank to gap or click plank then gap — feedback; wrong drop shows wobble; after 2 wrong, hint appears; click Next — score increments, new question loads
13. Visit http://localhost:3000/stickers, /summary, /settings — each loads correctly with AppShell

## Slack (run-epics)

Used by `/run-epics` to post to Slack. All scripts load from `.env` or env; if unset, no-op.

| Purpose | Script | Env var |
|---------|--------|---------|
| Code review results | `scripts/ci/slack_post_review.sh` | `SLACK_REVIEW_WEBHOOK_URL` |
| PR merged | `scripts/ci/slack_post_pr_merged.sh` | `SLACK_PR_WEBHOOK_URL` |
| Epic checklist | `scripts/ci/slack_post_epic_checklist.sh` | `SLACK_EPIC_WEBHOOK_URL` |

Setup: [Slack API Apps](https://api.slack.com/apps) → Incoming Webhooks → Add to Workspace → choose channel.

## Install (prerequisites)

```bash
# Web (in container)
docker compose exec web pnpm install

# API
cd apps/api && composer install
```
