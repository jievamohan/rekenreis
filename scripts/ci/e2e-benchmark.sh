#!/usr/bin/env bash
# Run Playwright e2e tests and record duration for CI benchmark.
# Outputs duration to GITHUB_STEP_SUMMARY when in GitHub Actions.
set -euo pipefail

START=$(date +%s)
# When node_modules exists (e.g. from CI cache), skip pnpm install to save time
if [[ -d apps/web/node_modules ]] && [[ -f apps/web/node_modules/.pnpm/lock ]]; then
  docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm e2e sh -lc \
    "npm install -g pnpm@9 && pnpm config set store-dir /pnpm-store && pnpm test:e2e"
else
  docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm e2e sh -lc \
    "npm install -g pnpm@9 && pnpm config set store-dir /pnpm-store && pnpm install --frozen-lockfile && pnpm test:e2e"
fi
EXIT=$?
END=$(date +%s)
DURATION=$((END - START))

mkdir -p artifacts/ci
echo "$DURATION" > artifacts/ci/e2e-duration-seconds.txt
echo "Playwright e2e duration: ${DURATION}s"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "## Playwright e2e benchmark"
    echo "- **Duration:** ${DURATION}s"
    echo "- **Baseline:** See docs/runbooks/e2e-benchmark.md"
  } >> "$GITHUB_STEP_SUMMARY"
fi

exit $EXIT
