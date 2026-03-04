#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-host}"   # host|container
PR="${2:-}"         # PR number optional
BRANCH="${3:-}"     # branch name optional
RETRIES="${RETRIES:-20}"
SLEEP="${SLEEP:-30}"

ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}"
mkdir -p "$ARTIFACTS_DIR"

run_gh() {
  if [[ "$MODE" == "container" ]]; then
    docker compose run --rm gh gh "$@"
  else
    gh "$@"
  fi
}

# Resolve PR if not provided
if [[ -z "$PR" ]]; then
  if [[ -n "$BRANCH" ]]; then
    PR="$(run_gh pr list --head "$BRANCH" --json number -q '.[0].number' || true)"
  else
    # Try current branch
    CURRENT_BRANCH="$(git branch --show-current)"
    PR="$(run_gh pr list --head "$CURRENT_BRANCH" --json number -q '.[0].number' || true)"
  fi
fi

if [[ -z "$PR" || "$PR" == "null" ]]; then
  echo "CI-WATCH: Could not resolve PR number. Provide PR number explicitly." >&2
  exit 2
fi

# Get the latest run id for the PR's head sha
HEAD_SHA="$(run_gh pr view "$PR" --json headRefOid -q .headRefOid)"

# Poll latest run for the workflow(s) associated with this SHA
for ((i=1; i<=RETRIES; i++)); do
  # List runs for this SHA, take newest
  RUN_ID="$(run_gh run list --json databaseId,headSha,status,conclusion,createdAt --limit 20 \
    -q ".[] | select(.headSha==\"$HEAD_SHA\") | .databaseId" | head -n 1 || true)"

  if [[ -z "$RUN_ID" ]]; then
    sleep "$SLEEP"
    continue
  fi

  STATUS="$(run_gh run view "$RUN_ID" --json status -q .status)"
  CONCLUSION="$(run_gh run view "$RUN_ID" --json conclusion -q .conclusion)"

  if [[ "$STATUS" == "completed" ]]; then
    if [[ "$CONCLUSION" == "success" ]]; then
      exit 0
    else
      echo "$RUN_ID" > "$ARTIFACTS_DIR/ci-last-run-id.txt"
      # Auto-fetch logs per /ci-watch protocol
      SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
      "$SCRIPT_DIR/gh_fetch_logs.sh" "$MODE" || true
      exit 1
    fi
  fi

  sleep "$SLEEP"
done

echo "CI-WATCH: Still pending after ${RETRIES} polls. Marking BLOCKED." >&2
exit 3