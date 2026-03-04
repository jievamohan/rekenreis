#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-host}"   # host|container
PR="${2:-}"         # PR number optional
BRANCH="${3:-}"     # branch name optional
RETRIES="${RETRIES:-20}"
SLEEP="${SLEEP:-30}"

mkdir -p artifacts
STATUS_FILE="artifacts/ci-status.md"

run_gh() {
  if [[ "$MODE" == "container" ]]; then
    docker compose run --rm gh gh "$@"
  else
    gh "$@"
  fi
}

# Resolve repo context
REPO="$(run_gh repo view --json nameWithOwner -q .nameWithOwner)"

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
  echo "CI-WATCH: Could not resolve PR number. Provide PR number explicitly." | tee "$STATUS_FILE"
  exit 2
fi

# Get the latest run id for the PR's head sha
HEAD_SHA="$(run_gh pr view "$PR" --json headRefOid -q .headRefOid)"

echo "# CI Status" > "$STATUS_FILE"
echo "- Repo: $REPO" >> "$STATUS_FILE"
echo "- PR: #$PR" >> "$STATUS_FILE"
echo "- Head SHA: $HEAD_SHA" >> "$STATUS_FILE"
echo "- Mode: $MODE" >> "$STATUS_FILE"
echo "" >> "$STATUS_FILE"

# Poll latest run for the workflow(s) associated with this SHA
for ((i=1; i<=RETRIES; i++)); do
  # List runs for this SHA, take newest
  RUN_ID="$(run_gh run list --json databaseId,headSha,status,conclusion,createdAt --limit 20 \
    -q ".[] | select(.headSha==\"$HEAD_SHA\") | .databaseId" | head -n 1 || true)"

  if [[ -z "$RUN_ID" ]]; then
    echo "- Poll $i/$RETRIES: No run found yet (queued?)" >> "$STATUS_FILE"
    sleep "$SLEEP"
    continue
  fi

  STATUS="$(run_gh run view "$RUN_ID" --json status -q .status)"
  CONCLUSION="$(run_gh run view "$RUN_ID" --json conclusion -q .conclusion)"

  TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "- Poll $i/$RETRIES @ $TS: run_id=$RUN_ID status=$STATUS conclusion=${CONCLUSION:-null}" >> "$STATUS_FILE"

  if [[ "$STATUS" == "completed" ]]; then
    if [[ "$CONCLUSION" == "success" ]]; then
      echo "" >> "$STATUS_FILE"
      echo "✅ CI SUCCESS (run $RUN_ID)" >> "$STATUS_FILE"
      exit 0
    else
      echo "" >> "$STATUS_FILE"
      echo "❌ CI FAILED (run $RUN_ID, conclusion=$CONCLUSION)" >> "$STATUS_FILE"
      echo "$RUN_ID" > artifacts/ci-last-run-id.txt
      # Auto-fetch logs per /ci-watch protocol
      SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
      "$SCRIPT_DIR/gh_fetch_logs.sh" "$MODE" || true
      exit 1
    fi
  fi

  sleep "$SLEEP"
done

echo "" >> "$STATUS_FILE"
echo "⏱️ CI still pending after ${RETRIES} polls. Marking BLOCKED." >> "$STATUS_FILE"
exit 3