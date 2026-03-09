#!/usr/bin/env bash
set -euo pipefail

# Archive artifacts/current to artifacts/archive/epic-<N>.0/<timestamp>
# Usage: ./archive_current_artifacts.sh "<N>.0"   e.g. "31.0"

EPIC_ARCHIVE_ID="${1:?Usage: $0 <N>.0}"
ARCHIVE_BASE="${ARCHIVE_BASE:-artifacts/archive}"
ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}"

if [[ ! "$EPIC_ARCHIVE_ID" =~ ^[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid epic archive id: $EPIC_ARCHIVE_ID (expected e.g. 31.0)" >&2
  exit 2
fi

ARCHIVE_DIR="$ARCHIVE_BASE/epic-$EPIC_ARCHIVE_ID"

if [[ ! -d "$ARTIFACTS_DIR" ]]; then
  echo "Archive: $ARTIFACTS_DIR not found" >&2
  exit 1
fi

# Timestamp: YYYYMMDDTHHMMSSZ
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TIMESTAMPED_DIR="$ARCHIVE_DIR/$TIMESTAMP"

mkdir -p "$(dirname "$ARCHIVE_DIR")"
mkdir -p "$TIMESTAMPED_DIR"
cp -r "$ARTIFACTS_DIR"/* "$TIMESTAMPED_DIR/" 2>/dev/null || true

# Create/update latest symlink
ln -sfn "$TIMESTAMP" "$ARCHIVE_DIR/latest"
echo "Archive: saved to $ARCHIVE_DIR/$TIMESTAMP (latest -> $TIMESTAMP)"
