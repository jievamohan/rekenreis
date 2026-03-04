#!/usr/bin/env bash
set -euo pipefail

PR_NUM="${1:-}"
SLEEP="${SLEEP:-20}"
RETRIES="${RETRIES:-999999}" # effectively "wait until merged"

if [[ -z "$PR_NUM" ]]; then
  # try infer PR from current branch
  PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"
fi

if [[ -z "$PR_NUM" || "$PR_NUM" == "null" ]]; then
  echo "No PR number provided and could not infer PR for current branch."
  exit 2
fi

for ((i=1; i<=RETRIES; i++)); do
  MERGED="$(gh pr view "$PR_NUM" --json merged -q .merged)"
  STATE="$(gh pr view "$PR_NUM" --json state -q .state)"
  URL="$(gh pr view "$PR_NUM" --json url -q .url)"

  TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[$TS] PR #$PR_NUM state=$STATE merged=$MERGED url=$URL"

  if [[ "$MERGED" == "true" ]]; then
    echo "PR #$PR_NUM merged."
    exit 0
  fi

  sleep "$SLEEP"
done