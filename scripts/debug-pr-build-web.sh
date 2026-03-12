#!/usr/bin/env bash
# Lokaal reproduceren van de Playwright pr-build web container.
# Zelfde setup als CI: pnpm install, dan compose met pr-build.
# Draait in foreground zodat je alle stdout/stderr ziet.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== 1. pnpm install (zoals CI) ==="
cd apps/web && pnpm install --frozen-lockfile && cd ../..

echo ""
echo "=== 2. Build web image (pr-build) ==="
docker compose -f docker-compose.yml -f docker-compose.ci.pr-build.yml build web

echo ""
echo "=== 3. Start stack (foreground - je ziet alle output) ==="
echo "    Stop met Ctrl+C. Web logs verschijnen direct."
docker compose -f docker-compose.yml -f docker-compose.ci.pr-build.yml up web
