#!/usr/bin/env bash
# Run Playwright e2e tests and record duration for CI benchmark.
# Uses self-contained e2e image: no pnpm install at runtime, no volume mounts.
set -euo pipefail

mkdir -p artifacts/ci

# Self-contained e2e image has tests + node_modules baked in; just run tests.
START=$(date +%s)
docker compose -f docker-compose.yml -f docker-compose.ci.pull.yml -f docker-compose.ci.pr-mount.yml run --rm e2e pnpm test:e2e
EXIT=$?
END=$(date +%s)
DURATION=$((END - START))

echo "0" > artifacts/ci/install-seconds.txt
echo "$DURATION" > artifacts/ci/test-seconds.txt
echo "$DURATION" > artifacts/ci/e2e-duration-seconds.txt
echo "Playwright e2e: install=0s test=${DURATION}s total=${DURATION}s"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "- **Install (pnpm):** 0s"
    echo "- **Run Playwright:** ${DURATION}s"
    echo "- **Total:** ${DURATION}s"
    echo ""
    echo "See docs/runbooks/e2e-benchmark.md for baseline."
  } >> "$GITHUB_STEP_SUMMARY"
fi

exit $EXIT
