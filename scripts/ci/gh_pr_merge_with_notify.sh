#!/usr/bin/env bash
# Merge PR and post Slack notifications. Bundles steps i + j2 so Slack cannot be skipped.
# Usage: run from repo root.
#   scripts/ci/gh_pr_merge_with_notify.sh --pr <PR_NUM> --head-sha <SHA> --epic <EPIC_ID> --title <EPIC_TITLE>
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

PR=""
HEAD_SHA=""
EPIC=""
TITLE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pr) PR="$2"; shift 2 ;;
    --head-sha) HEAD_SHA="$2"; shift 2 ;;
    --epic) EPIC="$2"; shift 2 ;;
    --title) TITLE="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$PR" || -z "$HEAD_SHA" ]]; then
  echo "Usage: $0 --pr <PR_NUM> --head-sha <SHA> --epic <EPIC_ID> --title <EPIC_TITLE>" >&2
  exit 1
fi

PR_URL="$(gh pr view "$PR" --json url -q .url 2>/dev/null || echo "https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/pull/$PR")"

# 1. Pre-merge: ensure GitHub ruleset sees all checks (avoid race after CI completes)
MERGE_DELAY="${MERGE_DELAY:-30}"
PRE_MERGE_RETRIES="${PRE_MERGE_RETRIES:-3}"
for ((i=1; i<=PRE_MERGE_RETRIES; i++)); do
  STATUS="$(gh pr view "$PR" --json mergeStateStatus -q .mergeStateStatus 2>/dev/null || true)"
  if [[ "$STATUS" == "CLEAN" ]]; then
    break
  fi
  if [[ $i -lt $PRE_MERGE_RETRIES ]]; then
    echo "Merge gate not ready (status=$STATUS). Waiting ${MERGE_DELAY}s before retry $i/$PRE_MERGE_RETRIES..." >&2
    sleep "$MERGE_DELAY"
  else
    echo "Merge gate still not CLEAN after ${PRE_MERGE_RETRIES} retries. Status: $STATUS" >&2
    exit 4
  fi
done

# 2. Merge
gh pr merge "$PR" --merge --delete-branch --match-head-commit "$HEAD_SHA"

# 3. Slack: PR merged (no-op if webhook unset)
"$REPO_ROOT/scripts/ci/slack_post_pr_merged.sh" --epic "${EPIC:-}" --title "${TITLE:-}" --pr "$PR" --url "$PR_URL"

# 4. Slack: Epic checklist (no-op if webhook unset)
"$REPO_ROOT/scripts/ci/slack_post_epic_checklist.sh"
