#!/usr/bin/env bash
set -euo pipefail

# Create a git worktree for parallel epic execution.
# Usage: scripts/ci/gh_worktree_epic.sh <epic-id>
#   epic-id: e.g. 19.1, 19.2, 20.1
# Output: path to the new worktree (to open in a separate Cursor window)

EPIC_ID="${1:?Usage: gh_worktree_epic.sh <epic-id> (e.g. 19.1, 19.2)}"

# Normalize: 19.1 -> 19-1 for branch name, 19.1 for dir
SLUG="${EPIC_ID//./-}"
BRANCH="feat/epic-${EPIC_ID}-parallel"
REPO_ROOT="$(git rev-parse --show-toplevel)"
PARENT="$(dirname "$REPO_ROOT")"
WORKTREE_DIR="${PARENT}/rekenreis-epic-${SLUG}"

if [[ -d "$WORKTREE_DIR" ]]; then
  echo "Worktree already exists: $WORKTREE_DIR"
  echo "$WORKTREE_DIR"
  exit 0
fi

BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null || echo "main")"
git worktree add "$WORKTREE_DIR" -b "$BRANCH" "$BASE"

echo "Worktree created: $WORKTREE_DIR"
echo "Branch: $BRANCH"
echo ""
echo "Open in Cursor: File > Open Folder > $WORKTREE_DIR"
echo "Then run: /feature --epic-id=${EPIC_ID} <epic prompt from docs/epics.md>"
echo ""
echo "$WORKTREE_DIR"
