#!/usr/bin/env bash
# Open key URLs for bug bash in default browser. Run from repo root.
# Requires stack to be running (docker compose up).
set -euo pipefail

BASE="${1:-http://localhost:3000}"

open_url() {
  if command -v open >/dev/null 2>&1; then
    open "$1"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$1"
  else
    echo "Open: $1"
  fi
}

echo "Opening bug bash URLs..."
open_url "$BASE/"
open_url "$BASE/play"
open_url "$BASE/stickers"
open_url "$BASE/summary"
open_url "$BASE/settings"
echo "Done. See docs/bug-bash-checklist.md for verification steps."
