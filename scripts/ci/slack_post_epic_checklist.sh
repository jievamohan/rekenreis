#!/usr/bin/env bash
# Post epic checklist to Slack.
# Used by run-epics when an epic is started and after each PR merge.
# Reads docs/epics.md and posts the current done/pending checklist.
# Usage: run from repo root. Reads SLACK_EPIC_WEBHOOK_URL from env or .env.
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

# Load SLACK_EPIC_WEBHOOK_URL from .env if not already set
if [[ -z "${SLACK_EPIC_WEBHOOK_URL:-}" && -f .env ]]; then
  val=$(grep -E '^SLACK_EPIC_WEBHOOK_URL=' .env 2>/dev/null | head -1 | cut -d= -f2- | sed "s/^['\"]//;s/['\"]$//" | tr -d '\r') || true
  if [[ -n "$val" ]]; then
    export SLACK_EPIC_WEBHOOK_URL="$val"
  fi
fi

WEBHOOK="${SLACK_EPIC_WEBHOOK_URL:-}"
if [[ -z "$WEBHOOK" ]]; then
  exit 0
fi

EPICS_FILE="${1:-docs/epics.md}"
if [[ ! -f "$EPICS_FILE" ]]; then
  echo "Epics file not found: $EPICS_FILE" >&2
  exit 1
fi

# Parse epics: ## Epic N — Title or ## Epic N.M — Title, followed by - [x] or - [ ]
CHECKLIST=""
while IFS= read -r line; do
  if [[ "$line" == "## Epic "* ]]; then
    item="${line#\#\# }"
    read -r next_line || true
    if [[ "$next_line" == *"[x]"* ]]; then
      CHECKLIST="${CHECKLIST}• [x] $item"$'\n'
    else
      CHECKLIST="${CHECKLIST}• [ ] $item"$'\n'
    fi
  fi
done < "$EPICS_FILE"

# Trim trailing newline for display
CHECKLIST="${CHECKLIST%$'\n'}"

# Escape for JSON (Slack mrkdwn)
escape_json() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g'
}

CHECKLIST_E=$(escape_json "$CHECKLIST")

FALLBACK="Epic checklist updated"

JSON=$(cat <<ENDOFJSON
{
  "text": "$FALLBACK",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": ":clipboard: Epic Checklist",
        "emoji": true
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "\`\`\`$CHECKLIST_E\`\`\`"
      }
    }
  ]
}
ENDOFJSON
)

HTTP_CODE=$(curl -sS -w "%{http_code}" -o /tmp/slack_epic_checklist_$$.out \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  "$WEBHOOK" 2>/dev/null || echo "000")

rm -f /tmp/slack_epic_checklist_$$.out

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Slack epic checklist post failed (HTTP $HTTP_CODE)" >&2
  exit 1
fi
