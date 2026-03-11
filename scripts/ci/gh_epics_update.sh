#!/usr/bin/env bash
# After an epic PR is merged: update epics.md + epic-progress.md, create PR, merge (no squash), sync main.
# Usage: scripts/ci/gh_epics_update.sh <epic_id> <pr_num>
# Example: scripts/ci/gh_epics_update.sh 23.1 72

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

EPIC_ID="${1:-${EPIC_ID:-}}"
EPIC_PR_NUM="${2:-${EPIC_PR_NUM:-}}"

if [[ -z "$EPIC_ID" ]]; then
  echo "Usage: $0 <epic_id> <pr_num>"
  echo "Example: $0 23.1 72"
  exit 2
fi

# Normalize epic id (e.g. "Epic 23.1" -> "23.1")
EPIC_ID="${EPIC_ID#Epic }"
EPIC_ID="${EPIC_ID#epic }"
EPIC_SLUG="epic-${EPIC_ID//./-}"

BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"

# 1) Sync main
git fetch origin "$BASE"
git checkout "$BASE"
git pull origin "$BASE"

# 2) Update epics.md: set checkbox to [x] for this epic
EPICS_MD="docs/epics.md"
if [[ ! -f "$EPICS_MD" ]]; then
  echo "docs/epics.md not found."
  exit 3
fi

# Escape dots for regex (23.1 -> 23\.1)
EPIC_PATTERN="${EPIC_ID//./\\.}"
# Use awk: when we see "## Epic 23.1 —" or "## Epic 23.1" at start of line, next line's "- [ ]" -> "- [x]"
awk -v pat="^## Epic ${EPIC_PATTERN}[[:space:]]" '
  $0 ~ pat { in_epic=1; print; next }
  in_epic && /^- \[ \]$/ { print "- [x]"; in_epic=0; next }
  in_epic { in_epic=0 }
  { print }
' "$EPICS_MD" > "$EPICS_MD.tmp" && mv "$EPICS_MD.tmp" "$EPICS_MD"

# 3) Update epic-progress.md
PROGRESS_MD="docs/epic-progress.md"
if [[ -f "$PROGRESS_MD" ]]; then
  EPIC_TITLE=$(grep -m1 "^## Epic $EPIC_ID" "$EPICS_MD" | sed 's/^## //')
  if [[ -n "$EPIC_TITLE" ]]; then
    NOTE="PR #${EPIC_PR_NUM:-?} merged"
    if grep -q "| $EPIC_TITLE |" "$PROGRESS_MD"; then
      # Update existing row
      awk -v title="$EPIC_TITLE" -v note="$NOTE" '
        index($0, "| " title " |") > 0 { print "| " title " | done | " note " |"; next }
        { print }
      ' "$PROGRESS_MD" > "$PROGRESS_MD.tmp" && mv "$PROGRESS_MD.tmp" "$PROGRESS_MD"
    else
      # Add new row at end of table
      echo "| $EPIC_TITLE | done | $NOTE |" >> "$PROGRESS_MD"
    fi
  fi
fi

# 4) Create branch, commit, push
BRANCH="chore/epics-update-${EPIC_SLUG}"
git checkout -b "$BRANCH"
git add docs/epics.md docs/epic-progress.md 2>/dev/null || true
if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit (epic may already be marked done)."
  git checkout "$BASE"
  git branch -D "$BRANCH" 2>/dev/null || true
  exit 0
fi
git commit -m "chore(epics): mark Epic $EPIC_ID done (PR #${EPIC_PR_NUM:-?} merged)"

# 5) Push and create PR
git push -u origin "$BRANCH"

PR_BODY="chore(epics): update epics.md + epic-progress.md after Epic $EPIC_ID merged (PR #${EPIC_PR_NUM:-?})"
gh pr create --base "$BASE" --head "$BRANCH" \
  --title "chore(epics): mark Epic $EPIC_ID done" \
  --body "$PR_BODY"

PR_NUM="$(gh pr view --json number -q .number)"

# 6) Merge with merge commit (no squash)
gh pr merge "$PR_NUM" --merge --delete-branch

# 7) Wait for merge to complete
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-120}"
for ((i=0; i<TIMEOUT_SECONDS; i+=5)); do
  MERGED="$(gh pr view "$PR_NUM" --json mergedAt -q .mergedAt)"
  if [[ -n "$MERGED" && "$MERGED" != "null" ]]; then
    break
  fi
  sleep 5
done

# 8) Fetch main and checkout
git fetch origin "$BASE"
git checkout "$BASE"
git pull origin "$BASE"

# 9) Delete local feature branch (remote already deleted by GitHub)
HEAD_REF="$(gh pr view "$EPIC_PR_NUM" --json headRefName -q .headRefName 2>/dev/null || true)"
FEATURE_BRANCH="${HEAD_REF#*:}"  # strip "owner:" for fork PRs
if [[ -n "$FEATURE_BRANCH" ]] && git show-ref --quiet refs/heads/"$FEATURE_BRANCH" 2>/dev/null; then
  git branch -d "$FEATURE_BRANCH" 2>/dev/null || true
fi

echo "Epics update complete. Epic $EPIC_ID marked done. On $BASE, ready for next epic."
