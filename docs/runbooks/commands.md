# Canonical Command List

Commands used by CI gates and local development. All paths relative to repo root.

**Quick start:** See [docs/quick-start.md](../quick-start.md).

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
| semgrep | `semgrep scan --config auto --config .semgrep --error` | SAST: auto + custom rules in `.semgrep/` (install: pip install semgrep) |
| pnpm audit | `cd apps/web && pnpm audit --prod` | Web deps |
| composer audit | `cd apps/api && composer run audit-deps` | API deps (audit reserved by Composer) |
| hadolint | `docker run --rm -i hadolint/hadolint < apps/web/Dockerfile` | Dockerfile lint |
| trivy config | `docker run --rm -v "$(pwd):/app" -w /app aquasec/trivy config .` | IaC/config scan |
| ZAP baseline | See `.github/workflows/gates.yml` zap-baseline job | DAST against compose stack |

## Gate F (Performance)

| App | Command | Notes |
|-----|---------|-------|
| web build | `cd apps/web && pnpm run build` | Must succeed |
| web size | `cd apps/web && pnpm run size` | Reports .output size; baseline in perf.md |

## Lint & Test

| App | Command |
|-----|---------|
| web lint | `cd apps/web && pnpm run lint` |
| web test | `cd apps/web && pnpm run test` |
| api test | `cd apps/api && composer run test` |

## Docker Compose (vertical slice)

```bash
# Bring up web + api + mysql
docker compose up --build

# Web: http://localhost:3000/start
# Web game: http://localhost:3000/play
# API: http://localhost:8001/api/health
```

## Smoke verification

1. `docker compose up --build`
2. Visit http://localhost:3000/start — should show API health JSON
3. Visit http://localhost:3000/play — should show math game (classic mode, infinite content), question, answer buttons
4. Visit http://localhost:3000/play?mode=classic — same as above (explicit classic)
5. Visit http://localhost:3000/play?mode=timed-pop — should show math game with countdown timer
6. For timed-pop: wait ~15s for timeout → "Time's up! The answer was X" → click Next → new question loads
7. Visit http://localhost:3000/play?mode=pack or /play?source=pack — should show math game with content pack levels
8. Visit http://localhost:3000/play?skin=monster-feed (or space, pirate) — should show that skin
9. Select an answer — feedback appears; click Next — new question loads (classic and timed-pop)

## Install (prerequisites)

```bash
# Web
cd apps/web && pnpm install

# API
cd apps/api && composer install
```
