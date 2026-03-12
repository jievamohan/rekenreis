#!/usr/bin/env bash
# Run migrate for API. node_modules en vendor zitten al in git. Pass compose files as args.
# Example: api-setup.sh -f docker-compose.yml -f docker-compose.ci.pull.yml
set -euo pipefail

COMPOSE_OPTS=("${@}")
[[ ${#COMPOSE_OPTS[@]} -eq 0 ]] && COMPOSE_OPTS=(-f docker-compose.yml)

echo "Starting mysql..."
docker compose "${COMPOSE_OPTS[@]}" up -d mysql
docker compose "${COMPOSE_OPTS[@]}" exec -T mysql mysqladmin ping -h localhost --wait=30

echo "API: composer install (when source is mounted, vendor may be missing)..."
# Run as root so we can create vendor in the mounted host dir (runner-owned)
docker compose "${COMPOSE_OPTS[@]}" run --rm --user root api composer install --no-interaction --prefer-dist

echo "API: migrate..."
docker compose "${COMPOSE_OPTS[@]}" run --rm api php artisan migrate --force
