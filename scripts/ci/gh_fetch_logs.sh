#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-host}"   # host|container
RUN_ID="${2:-}"

mkdir -p artifacts/ci-logs
FAIL_FILE="artifacts/ci-failures.md"

run_gh() {
  if [[ "$MODE" == "container" ]]; then
    docker compose run --rm gh gh "$@"
  else
    gh "$@"
  fi
}

if [[ -z "$RUN_ID" ]]; then
  if [[ -f artifacts/ci-last-run-id.txt ]]; then
    RUN_ID="$(cat artifacts/ci-last-run-id.txt)"
  fi
fi

if [[ -z "$RUN_ID" ]]; then
  echo "CI-FETCH: No RUN_ID provided and artifacts/ci-last-run-id.txt missing." | tee "$FAIL_FILE"
  exit 2
fi

echo "# CI Failures" > "$FAIL_FILE"
echo "- Mode: $MODE" >> "$FAIL_FILE"
echo "- Run ID: $RUN_ID" >> "$FAIL_FILE"
echo "" >> "$FAIL_FILE"

# Get jobs + conclusions
JOBS_JSON="$(run_gh run view "$RUN_ID" --json jobs)"

# Extract failing job names (jq not guaranteed; use gh query)
FAIL_JOBS="$(run_gh run view "$RUN_ID" --json jobs -q '.jobs[] | select(.conclusion!="success") | .name' || true)"

if [[ -z "$FAIL_JOBS" ]]; then
  echo "No failing jobs found (maybe cancelled?). Fetching full log." >> "$FAIL_FILE"
  run_gh run view "$RUN_ID" --log > "artifacts/ci-logs/run-${RUN_ID}.log" || true
  echo "- Saved: artifacts/ci-logs/run-${RUN_ID}.log" >> "$FAIL_FILE"
  exit 0
fi

# Save full log always (cheap + useful)
run_gh run view "$RUN_ID" --log > "artifacts/ci-logs/run-${RUN_ID}.log" || true
echo "- Saved: artifacts/ci-logs/run-${RUN_ID}.log" >> "$FAIL_FILE"
echo "" >> "$FAIL_FILE"
echo "## Failing jobs" >> "$FAIL_FILE"

while IFS= read -r JOB; do
  [[ -z "$JOB" ]] && continue
  SAFE_JOB="$(echo "$JOB" | tr ' /' '__' | tr -cd '[:alnum:]_-' )"
  OUT="artifacts/ci-logs/run-${RUN_ID}-${SAFE_JOB}.log"
  # gh doesn't support per-job log extraction reliably; keep as reference + tell orchestrator to search within full log
  echo "- $JOB (see run log: $OUT not available; use run-${RUN_ID}.log search)" >> "$FAIL_FILE"
done <<< "$FAIL_JOBS"

echo "" >> "$FAIL_FILE"
echo "Next: create a CI-fix task (Lane I) using snippets from artifacts/ci-logs/run-${RUN_ID}.log" >> "$FAIL_FILE"