#!/usr/bin/env bash
set -euo pipefail

mkdir -p artifacts

BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"
BRANCH="$(git branch --show-current)"

# Try existing PR for current branch
PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"

if [[ -z "${PR_NUM}" || "${PR_NUM}" == "null" ]]; then
  BODY_FILE="artifacts/pr.md"
  if [[ ! -f "$BODY_FILE" ]]; then
    cat > "$BODY_FILE" <<EOF
# PR Summary
Auto-generated PR bootstrap for branch: $BRANCH
EOF
  fi

  # Title: keep it simple + deterministic
  gh pr create \
    --base "$BASE" \
    --head "$BRANCH" \
    --title "$BRANCH" \
    --body-file "$BODY_FILE" >/dev/null

  PR_NUM="$(gh pr view --json number -q .number)"
fi

PR_URL="$(gh pr view --json url -q .url)"

# Persist metadata for downstream scripts/agents
echo "$PR_NUM" > artifacts/pr-number.txt
echo "$PR_URL" > artifacts/pr-url.txt

# Append PR metadata to artifacts/pr.md (idempotency not required; it's an audit trail)
{
  echo ""
  echo "## PR Metadata"
  echo "- Base: $BASE"
  echo "- Branch: $BRANCH"
  echo "- PR: #$PR_NUM"
  echo "- URL: $PR_URL"
} >> artifacts/pr.md