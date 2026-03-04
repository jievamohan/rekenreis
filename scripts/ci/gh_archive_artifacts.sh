#!/usr/bin/env bash
set -euo pipefail

# Archive artifacts/current to artifacts/archive/<epic-id>/<timestamp>
# Best-effort: logs failure but does not exit non-zero (does not block finalize)

ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}"
ARCHIVE_BASE="${ARCHIVE_BASE:-artifacts/archive}"

if [[ ! -d "$ARTIFACTS_DIR" ]]; then
  echo "Archive: $ARTIFACTS_DIR not found, skipping."
  exit 0
fi

BRANCH="$(git branch --show-current)"

# Derive epic-id from branch (override via EPIC_ID env): feat/epic16-release-prep -> epic16, feat/foo-bar -> foo-bar
if [[ -n "${EPIC_ID:-}" ]]; then
  : # use env
elif [[ "$BRANCH" =~ ^feat/(epic[0-9]+)[-_] ]]; then
  EPIC_ID="${BASH_REMATCH[1]}"
elif [[ "$BRANCH" =~ ^feat/(.+)$ ]]; then
  EPIC_ID="${BASH_REMATCH[1]}"
else
  EPIC_ID="unknown"
fi

# Timestamp: YYYYMMDDTHHMMSSZ
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE_DIR="$ARCHIVE_BASE/$EPIC_ID/$TIMESTAMP"

mkdir -p "$(dirname "$ARCHIVE_DIR")"
if cp -r "$ARTIFACTS_DIR" "$ARCHIVE_DIR" 2>/dev/null; then
  echo "Archive: saved to $ARCHIVE_DIR"
else
  echo "Archive: failed to copy (best-effort, continuing)" >&2
fi
