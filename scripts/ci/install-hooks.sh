#!/usr/bin/env bash
# Install git hooks for Epic 46.2 (pre-push build verification).
# Copies .githooks/pre-push to .git/hooks/pre-push.
# Usage: ./scripts/ci/install-hooks.sh (run from repo root)
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

HOOK_SRC="$REPO_ROOT/.githooks/pre-push"
HOOK_DEST="$REPO_ROOT/.git/hooks/pre-push"

if [[ ! -f "$HOOK_SRC" ]]; then
  echo "Error: $HOOK_SRC not found" >&2
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DEST"
chmod +x "$HOOK_DEST"
echo "Installed pre-push hook: .git/hooks/pre-push"
