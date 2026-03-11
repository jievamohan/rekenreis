#!/usr/bin/env bash
set -euo pipefail

ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}"
mkdir -p "$ARTIFACTS_DIR"

BRANCH="$(git branch --show-current)"
BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"
PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"

if [[ -z "${PR_NUM}" || "${PR_NUM}" == "null" ]]; then
  echo "No PR found for branch ${BRANCH}."
  exit 2
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Commit or revert changes first."
  exit 3
fi

git fetch origin "$BASE"
git reset --soft "origin/${BASE}"

git commit -m "feat(${BRANCH}): finalize (squashed)" || true

git push --force-with-lease origin "$BRANCH"

HEAD_SHA="$(git rev-parse HEAD)"
echo "$HEAD_SHA" > "$ARTIFACTS_DIR/pr-head-sha.txt"

scripts/ci/gh_watch.sh host "$PR_NUM"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/gh_archive_artifacts.sh" || true

echo "Finalize complete: squashed head $HEAD_SHA, CI green for PR #$PR_NUM."