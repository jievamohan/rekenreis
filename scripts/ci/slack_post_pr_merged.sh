#!/usr/bin/env bash
# Post PR merged notification to Slack.
# Used by run-epics after a feature PR is merged.
# Usage: run from repo root. Reads SLACK_PR_WEBHOOK_URL from env or .env.
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

# Load SLACK_PR_WEBHOOK_URL from .env if not already set
if [[ -z "${SLACK_PR_WEBHOOK_URL:-}" && -f .env ]]; then
  val=$(grep -E '^SLACK_PR_WEBHOOK_URL=' .env 2>/dev/null | head -1 | cut -d= -f2- | sed "s/^['\"]//;s/['\"]$//" | tr -d '\r') || true
  if [[ -n "$val" ]]; then
    export SLACK_PR_WEBHOOK_URL="$val"
  fi
fi

WEBHOOK="${SLACK_PR_WEBHOOK_URL:-}"
if [[ -z "$WEBHOOK" ]]; then
  exit 0
fi

EPIC=""
TITLE=""
PR=""
URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --epic) EPIC="$2"; shift 2 ;;
    --title) TITLE="$2"; shift 2 ;;
    --pr) PR="$2"; shift 2 ;;
    --url) URL="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

escape_json() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g'
}

EPIC_E=$(escape_json "$EPIC")
TITLE_E=$(escape_json "$TITLE")
PR_E=$(escape_json "$PR")
URL_E=$(escape_json "$URL")

FALLBACK="PR merged: Epic $EPIC — $TITLE"

JSON=$(cat <<ENDOFJSON
{
  "text": "$FALLBACK",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": ":white_check_mark: PR Merged — Epic $EPIC_E",
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*Epic:* $EPIC_E"},
        {"type": "mrkdwn", "text": "*Title:* $TITLE_E"},
        {"type": "mrkdwn", "text": "*PR:* <$URL_E|#$PR_E>"}
      ]
    }
  ]
}
ENDOFJSON
)

HTTP_CODE=$(curl -sS -w "%{http_code}" -o /tmp/slack_pr_merged_$$.out \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  "$WEBHOOK" 2>/dev/null || echo "000")

rm -f /tmp/slack_pr_merged_$$.out

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Slack PR merged post failed (HTTP $HTTP_CODE)" >&2
  exit 1
fi
