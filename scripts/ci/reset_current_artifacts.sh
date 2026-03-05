#!/usr/bin/env bash
set -euo pipefail

DIR="artifacts/current"
mkdir -p "$DIR"

# Safety: refuse to delete if DIR is empty or weird
if [[ "$DIR" != "artifacts/current" ]]; then
  echo "Refusing to reset unexpected dir: $DIR"
  exit 2
fi

# Remove only known generated artifacts (keep pr-number/pr-url/ci logs? -> we regenerate anyway)
rm -rf \
  "$DIR"/*.md \
  "$DIR"/ci-logs \
  "$DIR"/ci-status.md \
  "$DIR"/pr.md \
  "$DIR"/pr-number.txt \
  "$DIR"/pr-url.txt || true

mkdir -p "$DIR"
echo "Reset artifacts/current"