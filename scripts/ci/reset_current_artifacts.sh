#!/usr/bin/env bash
set -euo pipefail

DIR="${ARTIFACTS_DIR:-artifacts/current}"
mkdir -p "$DIR"

# Safety: only allow artifacts/current, artifacts/epic-*, or artifacts/epicify-*
if [[ "$DIR" != "artifacts/current" && ! "$DIR" =~ ^artifacts/epic(-[0-9]+(\.[0-9]+)?|ify-[0-9]+)$ ]]; then
  echo "Refusing to reset unexpected dir: $DIR (use artifacts/current, artifacts/epic-<N>.<k>, or artifacts/epicify-<N>)"
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
echo "Reset $DIR"