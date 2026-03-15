# Quick Start

## Prerequisites

- Node.js 20+
- pnpm (or npm)
- PHP 8.2+ (for API)
- Composer (for API)

## Install & Run

### Web only (game works standalone)

```bash
cd apps/web
pnpm install
pnpm run dev
```

Open http://localhost:3000/play

### Full stack (web + API)

```bash
# From repo root (node_modules en vendor zitten in git)
docker compose up --build
```

**Eenmalig** bij nieuwe migrations: `docker compose run --rm api php artisan migrate --force`

- Web: http://localhost:3000/start (API health)
- Game: http://localhost:3000/play

See [docs/runbooks/commands.md](runbooks/commands.md) for CI commands and smoke verification.
