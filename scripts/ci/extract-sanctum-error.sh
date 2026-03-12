#!/usr/bin/env bash
# Extract exception type and message from Laravel sanctum error HTML for CI visibility.
# Writes to GITHUB_STEP_SUMMARY when set; always echoes to stdout.
set -euo pipefail

HTML="${1:-apps/web/playwright-report/sanctum-error-response.html}"
[[ ! -f "$HTML" ]] && exit 0

# Extract exception class from <h1> (Laravel error page structure)
EXC=$(grep -oP '(?<=<h1[^>]*>)[^<]+' "$HTML" 2>/dev/null | head -1 || true)
# Extract message from <p class="text-xl font-light...">
MSG=$(grep -oP '(?<=<p class="text-xl font-light[^"]*">)[^<]+' "$HTML" 2>/dev/null | head -1 || true)
# Fallback: extract from markdown const (first line after # Exception - Title)
[[ -z "$MSG" ]] && MSG=$(grep -oP "const markdown = '[^']*'" "$HTML" 2>/dev/null | sed "s/const markdown = '//;s/'$//" | sed 's/\\n/\n/g' | head -3 | tail -1 | head -c 500 || true)

[[ -z "$EXC" && -z "$MSG" ]] && exit 0

echo "=== Extracted API error from sanctum-error-response.html ==="
echo "Exception: ${EXC:-'(not found)'}"
echo "Message: ${MSG:-'(not found)'}"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "## Extracted API error (sanctum/csrf-cookie)"
    echo ""
    echo "| Field | Value |"
    echo "|-------|-------|"
    echo "| **Exception** | \`${EXC:-—}\` |"
    echo "| **Message** | ${MSG:-—} |"
  } >> "$GITHUB_STEP_SUMMARY"
fi
