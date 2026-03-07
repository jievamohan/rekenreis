#!/usr/bin/env bash
set -euo pipefail

ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}"
mkdir -p "$ARTIFACTS_DIR"

# One-time migration: if legacy artifacts/pr.md exists and current doesn't, copy it
if [[ -f artifacts/pr.md && ! -f "$ARTIFACTS_DIR/pr.md" ]]; then
  cp artifacts/pr.md "$ARTIFACTS_DIR/pr.md"
fi

BASE="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"
BRANCH="$(git branch --show-current)"

# Try existing PR for current branch
PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"

if [[ -z "${PR_NUM}" || "${PR_NUM}" == "null" ]]; then
  BODY_FILE="$ARTIFACTS_DIR/pr.md"
  if [[ ! -f "$BODY_FILE" ]]; then
    cat > "$BODY_FILE" <<EOF
# PR Summary
Auto-generated PR bootstrap for branch: $BRANCH
EOF
  fi
  
  if ! grep -q '^## Tasks' "$BODY_FILE"; then
    echo "$ARTIFACTS_DIR/pr.md missing required '## Tasks' checklist section."
    exit 4
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
echo "$PR_NUM" > "$ARTIFACTS_DIR/pr-number.txt"
echo "$PR_URL" > "$ARTIFACTS_DIR/pr-url.txt"

# Append PR metadata to $ARTIFACTS_DIR/pr.md (idempotency not required; it's an audit trail)
{
  echo ""
  echo "## PR Metadata"
  echo "- Base: $BASE"
  echo "- Branch: $BRANCH"
  echo "- PR: #$PR_NUM"
  echo "- URL: $PR_URL"
} >> "$ARTIFACTS_DIR/pr.md"