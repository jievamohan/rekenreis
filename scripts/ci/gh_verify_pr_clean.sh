#!/usr/bin/env bash
set -euo pipefail

PR_NUM="${1:-}"
REVIEW_JSON="${2:-}"

if [[ -z "$PR_NUM" || -z "$REVIEW_JSON" ]]; then
  echo "Usage: $0 <pr_num> <review_json_path>"
  exit 2
fi

if [[ ! -f "$REVIEW_JSON" ]]; then
  echo "Review JSON not found: $REVIEW_JSON"
  exit 3
fi

STATE="$(gh pr view "$PR_NUM" --json state -q .state)"
IS_DRAFT="$(gh pr view "$PR_NUM" --json isDraft -q .isDraft)"
HEAD_SHA="$(gh pr view "$PR_NUM" --json headRefOid -q .headRefOid)"

if [[ "$STATE" != "OPEN" ]]; then
  echo "PR is not open."
  exit 4
fi

if [[ "$IS_DRAFT" == "true" ]]; then
  echo "PR is draft."
  exit 5
fi

MERGE_ALLOWED="$(jq -r '.merge_allowed' "$REVIEW_JSON")"
FINDINGS_COUNT="$(jq -r '.findings_count' "$REVIEW_JSON")"

if [[ "$MERGE_ALLOWED" != "true" ]]; then
  echo "Review gate disallows merge."
  exit 6
fi

if [[ "$FINDINGS_COUNT" != "0" ]]; then
  echo "Review findings are not empty."
  exit 7
fi

echo "$HEAD_SHA"