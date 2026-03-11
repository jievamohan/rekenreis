#!/usr/bin/env bash
# Post code review summary to Slack via Incoming Webhook.
# Used by run-epics after each review pass.
# Usage: run from repo root. Reads SLACK_REVIEW_WEBHOOK_URL from env or .env.
# If unset, exits 0 (no-op).
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

# Load .env if SLACK_REVIEW_WEBHOOK_URL not already set (use source for robust parsing)
if [[ -z "${SLACK_REVIEW_WEBHOOK_URL:-}" && -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env 2>/dev/null || true
  set +a
fi

WEBHOOK="${SLACK_REVIEW_WEBHOOK_URL:-}"
if [[ -z "$WEBHOOK" ]]; then
  echo "Slack: SLACK_REVIEW_WEBHOOK_URL unset, skipping" >&2
  exit 0
fi

# Parse args
EPIC=""
PR=""
URL=""
VERDICT=""
MERGE_ALLOWED=""
BLOCKERS="0"
MAJORS="0"
MEDIUMS="0"
MINORS="0"
NITS="0"
BRANCH=""
HEAD_SHA=""
PASS="1"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --epic) EPIC="$2"; shift 2 ;;
    --pr) PR="$2"; shift 2 ;;
    --url) URL="$2"; shift 2 ;;
    --verdict) VERDICT="$2"; shift 2 ;;
    --merge-allowed) MERGE_ALLOWED="$2"; shift 2 ;;
    --blockers) BLOCKERS="$2"; shift 2 ;;
    --majors) MAJORS="$2"; shift 2 ;;
    --mediums) MEDIUMS="$2"; shift 2 ;;
    --minors) MINORS="$2"; shift 2 ;;
    --nits) NITS="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --head-sha) HEAD_SHA="$2"; shift 2 ;;
    --pass) PASS="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# Build Slack Block Kit payload
# Escape for JSON: replace " \ with \"
escape_json() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g'
}

EPIC_E=$(escape_json "$EPIC")
PR_E=$(escape_json "$PR")
URL_E=$(escape_json "$URL")
VERDICT_E=$(escape_json "$VERDICT")
MERGE_E=$(escape_json "$MERGE_ALLOWED")
BRANCH_E=$(escape_json "$BRANCH")
SHA_E=$(escape_json "$HEAD_SHA")

# Fallback plain text for notifications
FALLBACK="Code review: Epic $EPIC — PR #$PR — $VERDICT — merge allowed: $MERGE_ALLOWED"

# Emoji based on verdict
if [[ "$MERGE_ALLOWED" == "true" ]]; then
  EMOJI=":white_check_mark:"
else
  EMOJI=":x:"
fi

# Build JSON (avoid jq dependency)
CONTEXT_BLOCK=""
if [[ -n "$BRANCH" && -n "$HEAD_SHA" ]]; then
  CONTEXT_BLOCK=',{"type":"context","elements":[{"type":"mrkdwn","text":"Branch: `'"$BRANCH_E"'`"},{"type":"mrkdwn","text":"Head: `'"$SHA_E"'`"}]}'
fi

JSON=$(cat <<ENDOFJSON
{
  "text": "$FALLBACK",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "${EMOJI} Code Review: Epic $EPIC_E (pass $PASS)",
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*PR:* <$URL_E|#$PR_E>"},
        {"type": "mrkdwn", "text": "*Verdict:* $VERDICT_E"},
        {"type": "mrkdwn", "text": "*Merge allowed:* \`$MERGE_E\`"},
        {"type": "mrkdwn", "text": "*Findings:* blocker=$BLOCKERS major=$MAJORS medium=$MEDIUMS minor=$MINORS nit=$NITS"}
      ]
    }${CONTEXT_BLOCK}
  ]
}
ENDOFJSON
)

# POST to Slack
HTTP_CODE=$(curl -sS -w "%{http_code}" -o /tmp/slack_review_$$.out \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  "$WEBHOOK" 2>/dev/null || echo "000")

# Cleanup temp file
rm -f /tmp/slack_review_$$.out

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Slack post failed (HTTP $HTTP_CODE)" >&2
  exit 1
fi
