#!/usr/bin/env bash
set -euo pipefail

PR_NUM="${1:-}"
HEAD_SHA="${2:-}"

if [[ -z "$PR_NUM" || -z "$HEAD_SHA" ]]; then
  echo "Usage: $0 <pr_num> <head_sha>"
  exit 2
fi

STATE="$(gh pr view "$PR_NUM" --json state -q .state)"
if [[ "$STATE" != "OPEN" ]]; then
  echo "PR #$PR_NUM is not open."
  exit 3
fi

IS_DRAFT="$(gh pr view "$PR_NUM" --json isDraft -q .isDraft)"
if [[ "$IS_DRAFT" == "true" ]]; then
  echo "PR #$PR_NUM is still draft."
  exit 4
fi

MERGE_STATE="$(gh pr view "$PR_NUM" --json mergeStateStatus -q .mergeStateStatus || true)"
CURRENT_HEAD="$(gh pr view "$PR_NUM" --json headRefOid -q .headRefOid)"

if [[ "$CURRENT_HEAD" != "$HEAD_SHA" ]]; then
  echo "Head SHA mismatch. Expected $HEAD_SHA but PR is at $CURRENT_HEAD."
  exit 5
fi

gh pr merge "$PR_NUM" --merge --delete-branch --match-head-commit "$HEAD_SHA"

MERGED_AT="$(gh pr view "$PR_NUM" --json mergedAt -q .mergedAt)"
if [[ -z "$MERGED_AT" || "$MERGED_AT" == "null" ]]; then
  echo "Merge command executed but PR #$PR_NUM is not marked merged yet."
  exit 6
fi

echo "Merged PR #$PR_NUM with merge commit at head $HEAD_SHA."