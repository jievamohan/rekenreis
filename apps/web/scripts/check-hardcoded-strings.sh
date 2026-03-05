#!/bin/sh
# Detects hardcoded English strings in Vue templates.
# Looks for common English words that should be translated via useI18n.
# Exit 0 = clean, Exit 1 = potential hardcoded strings found.

set -eu
cd "$(dirname "$0")/.."

PATTERN="Welcome|Loading\.\.\.|Settings|Choose Level|Sticker Book|Progress Summary|Play math|Check connection|Skip to game|Back to Map|Choose game|Who is playing|For grown-ups|New profile|Hold 3 seconds|Solve a simple|Keep holding|Answer choices|Number keypad|Not quite|Time.s up|Next Level|Review Mistakes|Math Game|Space Math|Pirate Math|Feed the Monster|Player 1|Difficulty ceiling|Sound effects|Score:|Streak:|Up to 10|Up to 20"

FOUND=$(grep -rlE "$PATTERN" pages/ components/ --include='*.vue' 2>/dev/null || true)

if [ -n "$FOUND" ]; then
  echo "Warning: Potential hardcoded English strings found in:"
  echo "$FOUND"
  echo ""
  echo "Ensure all UI strings use useI18n t() calls."
  exit 1
fi

echo "OK: No hardcoded English strings detected."
exit 0
