#!/usr/bin/env bash
# Alleen de web container starten (zelfde command als pr-build).
# Handig als je de exacte fout wilt zien zonder de rest van de stack.
# Vereist: mysql + api al draaiend (bijv. via 'docker compose up -d api mysql').
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== pnpm install ==="
(cd apps/web && pnpm install --frozen-lockfile)

echo ""
echo "=== Build + run web (foreground, zelfde als pr-build) ==="
docker compose -f docker-compose.yml -f docker-compose.ci.pr-build.yml run --rm --service-ports web
