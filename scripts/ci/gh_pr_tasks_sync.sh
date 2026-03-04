#!/usr/bin/env bash
set -euo pipefail

# Updates PR body checkboxes based on tasks status in /tasks/*.md
# Requires: gh auth, PR exists for current branch.

BRANCH="$(git branch --show-current)"
PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"
if [[ -z "${PR_NUM}" || "${PR_NUM}" == "null" ]]; then
  echo "No PR found for branch ${BRANCH}."
  exit 2
fi

# Collect task ids that are done
DONE_IDS="$(grep -R --line-number -E '^status:\s*"(done|executed)"|^status:\s*(done|executed)$' tasks \
  | sed -E 's|^tasks/([^:]+):.*|\1|' \
  | sed -E 's|^([0-9]{4}).*|\1|' \
  | sort -u || true)"

if [[ -z "${DONE_IDS}" ]]; then
  echo "No done tasks found."
  exit 0
fi

# Get current PR body
BODY="$(gh pr view "$PR_NUM" --json body -q .body)"

# Mark checkboxes for done task ids (pattern: - [ ] 0005-... )
UPDATED="$BODY"
while IFS= read -r ID; do
  [[ -z "$ID" ]] && continue
  UPDATED="$(printf '%s' "$UPDATED" | perl -pe "s/^- \\[ \\] (${ID}[^\\n]*)\$/- [x] \\1/m")"
done <<< "$DONE_IDS"

# Update PR body
gh pr edit "$PR_NUM" --body "$UPDATED" >/dev/null
echo "Updated PR #$PR_NUM task checklist."