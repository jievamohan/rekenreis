# Canonical Command List

Commands used by CI gates and local development. All paths relative to repo root.

## Gate C (Type-safety)

| App | Command | Notes |
|-----|---------|-------|
| web | `cd apps/web && pnpm run typecheck` | nuxt typecheck (vue-tsc) |
| api | `cd apps/api && composer run phpstan` | PHPStan via Larastan |

## Gate D (Security)

| Tool | Command | Notes |
|------|--------|-------|
| gitleaks | `gitleaks detect --no-git` | Secrets scan (install: https://github.com/gitleaks/gitleaks) |
| semgrep | `semgrep scan --config auto` | SAST (install: pip install semgrep) |
| pnpm audit | `cd apps/web && pnpm audit --prod` | Web deps |
| composer audit | `cd apps/api && composer run audit-deps` | API deps (audit reserved by Composer) |

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
3. Visit http://localhost:3000/play — should show math game (infinite mode), question, answer buttons
4. Visit http://localhost:3000/play?mode=pack — should show math game with content pack levels
5. Select an answer — feedback appears; click Next — new question loads (both modes)

## Install (prerequisites)

```bash
# Web
cd apps/web && pnpm install

# API
cd apps/api && composer install
```
