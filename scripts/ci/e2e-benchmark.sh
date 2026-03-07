#!/usr/bin/env bash
# Run Playwright e2e tests and record duration for CI benchmark.
# Outputs duration per substep (install vs test) to GITHUB_STEP_SUMMARY when in GitHub Actions.
set -euo pipefail

mkdir -p artifacts/ci

# When node_modules exists (e.g. from CI cache), skip pnpm install to save time
if [[ -d apps/web/node_modules ]] && [[ -f apps/web/node_modules/.pnpm/lock ]]; then
  CMD='
    INSTALL_START=$(date +%s)
    npm install -g pnpm@9 && pnpm config set store-dir /pnpm-store
    INSTALL_END=$(date +%s)
    echo $((INSTALL_END - INSTALL_START)) > /repo/artifacts/ci/install-seconds.txt
    TEST_START=$(date +%s)
    pnpm test:e2e
    TEST_EXIT=$?
    TEST_END=$(date +%s)
    echo $((TEST_END - TEST_START)) > /repo/artifacts/ci/test-seconds.txt
    exit $TEST_EXIT
  '
else
  CMD='
    INSTALL_START=$(date +%s)
    npm install -g pnpm@9 && pnpm config set store-dir /pnpm-store && pnpm install --frozen-lockfile
    INSTALL_END=$(date +%s)
    echo $((INSTALL_END - INSTALL_START)) > /repo/artifacts/ci/install-seconds.txt
    TEST_START=$(date +%s)
    pnpm test:e2e
    TEST_EXIT=$?
    TEST_END=$(date +%s)
    echo $((TEST_END - TEST_START)) > /repo/artifacts/ci/test-seconds.txt
    exit $TEST_EXIT
  '
fi

docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm e2e sh -lc "$CMD"
EXIT=$?

# Compute total and read substeps
INSTALL_S=$(cat artifacts/ci/install-seconds.txt 2>/dev/null || echo 0)
TEST_S=$(cat artifacts/ci/test-seconds.txt 2>/dev/null || echo 0)
DURATION=$((INSTALL_S + TEST_S))
echo "$DURATION" > artifacts/ci/e2e-duration-seconds.txt
echo "Playwright e2e: install=${INSTALL_S}s test=${TEST_S}s total=${DURATION}s"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "- **Install (pnpm):** ${INSTALL_S}s"
    echo "- **Run Playwright:** ${TEST_S}s"
    echo "- **Total:** ${DURATION}s"
    echo ""
    echo "See docs/runbooks/e2e-benchmark.md for baseline."
  } >> "$GITHUB_STEP_SUMMARY"
fi

exit $EXIT
