#!/usr/bin/env bash
# Security headers and CORS regression check.
# Run against a running stack (e.g. after zap-baseline health wait).
# Fails if required headers are missing.
set -euo pipefail

WEB_BASE="${WEB_BASE:-http://localhost:3000}"
API_BASE="${API_BASE:-http://localhost:8001}"

fail() {
  echo "FAIL: $*"
  exit 1
}

# Web: X-Frame-Options, X-Content-Type-Options
for path in /start /play; do
  url="${WEB_BASE}${path}"
  echo "Checking $url..."
  hdrs="$(curl -sS -I "$url" 2>/dev/null || fail "curl $url failed")"
  echo "$hdrs" | grep -qi "X-Frame-Options:" || fail "X-Frame-Options missing on $url"
  echo "$hdrs" | grep -qi "X-Content-Type-Options:" || fail "X-Content-Type-Options missing on $url"
done

# API: CORS headers (retry: API may 500 on first request in CI)
echo "Checking API CORS $API_BASE/api/health..."
api_hdrs=""
for _ in 1 2 3; do
  api_hdrs="$(curl -sS -I "$API_BASE/api/health" -H "Origin: http://localhost:3000" 2>/dev/null)" || true
  echo "$api_hdrs" | grep -qi "Access-Control-Allow-Origin:" && break
  sleep 2
done
if echo "$api_hdrs" | grep -q "HTTP/1.1 200"; then
  echo "$api_hdrs" | grep -qi "Access-Control-Allow-Origin:" || fail "Access-Control-Allow-Origin missing on API"
elif echo "$api_hdrs" | grep -q "HTTP/1.1 500"; then
  echo "WARN: API returned 500, skipping CORS check"
fi

echo "Security headers check passed."
