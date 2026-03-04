#!/usr/bin/env bash
set -euo pipefail

BRANCH="$(git branch --show-current)"
BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"
PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"

if [[ -z "${PR_NUM}" || "${PR_NUM}" == "null" ]]; then
  echo "No PR found for branch ${BRANCH}."
  exit 2
fi

# Ensure clean working tree
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Commit or revert changes first."
  exit 3
fi

# Squash all commits on branch into one commit on top of base
git fetch origin "$BASE"
git reset --soft "origin/${BASE}"
git commit -m "feat(${BRANCH}): finalize (squashed)" || true

# Force push (required after soft reset)
git push --force-with-lease origin "$BRANCH"

# Run CI watch (host mode)
scripts/ci/gh_watch.sh host "$PR_NUM"

# Archive artifacts (best-effort, does not block)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/gh_archive_artifacts.sh" || true

echo "Finalize complete: CI green for PR #$PR_NUM."