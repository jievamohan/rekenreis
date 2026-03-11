#!/usr/bin/env bash
set -euo pipefail

PR_NUM="${1:-}"

if [[ -z "$PR_NUM" ]]; then
  PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"
fi

if [[ -z "$PR_NUM" || "$PR_NUM" == "null" ]]; then
  echo "No PR number provided and could not infer PR."
  exit 2
fi

gh pr view "$PR_NUM" --json headRefOid -q .headRefOid