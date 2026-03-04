#!/usr/bin/env bash
# Policy-as-code: detect hardcoded secrets in docker-compose, workflows, .env.example
# Fails on violations; allows known placeholders (base64:0000..., secret, root)
# Usage: run from repo root
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_ROOT"

VIOLATIONS=0

# Files to check
FILES=(
  docker-compose.yml
  .env.example
  apps/api/.env.example
)
# Add workflow files
while IFS= read -r -d '' f; do FILES+=("$f"); done < <(find .github/workflows -name "*.yml" -print0 2>/dev/null || true)

check_value() {
  local line="$1"
  local file="$2"
  # Skip comments and empty lines
  [[ "$line" =~ ^[[:space:]]*# ]] && return 0
  [[ "$line" =~ ^[[:space:]]*$ ]] && return 0
  # Extract VALUE after = or : (for YAML/env)
  local val
  if [[ "$line" =~ =([^#]*) ]]; then
    val="${BASH_REMATCH[1]}"
  elif [[ "$line" =~ :[[:space:]]*([^#]+) ]]; then
    val="${BASH_REMATCH[1]}"
  else
    return 0
  fi
  # Allowed placeholders: base64:0+, secret, root, null, empty
  [[ -z "$val" ]] && return 0
  [[ "$val" =~ ^base64:0+$ ]] && return 0
  local lower
  lower=$(echo "$val" | tr '[:upper:]' '[:lower:]')
  [[ "$lower" == "secret" ]] && return 0
  [[ "$lower" == "root" ]] && return 0
  [[ "$lower" == "null" ]] && return 0
  # Flag suspicious: long base64 (potential real key)
  if [[ "$val" =~ ^base64:[A-Za-z0-9+/=]{20,}$ ]]; then
    echo "::error file=$file::Potential hardcoded secret (base64 key): use base64:0000... placeholder"
    ((VIOLATIONS++)) || true
  fi
  # Flag: AWS-style keys
  if [[ "$val" =~ ^(AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16} ]]; then
    echo "::error file=$file::Potential AWS key detected"
    ((VIOLATIONS++)) || true
  fi
  # Flag: 32+ char hex/alphanumeric (potential API key) - skip URLs
  if [[ "$val" =~ ^https?:// ]] || [[ "$val" =~ ^[0-9.]+$ ]]; then return 0; fi
  if [[ "$val" =~ ^[a-zA-Z0-9_-]{32,}$ ]]; then
    echo "::error file=$file::Potential API key/token (32+ chars): use placeholder"
    ((VIOLATIONS++)) || true
  fi
}

for f in "${FILES[@]}"; do
  [[ ! -f "$f" ]] && continue
  while IFS= read -r line; do
    check_value "$line" "$f"
  done < "$f"
done

if [[ $VIOLATIONS -gt 0 ]]; then
  echo "Policy check failed: $VIOLATIONS violation(s) (hardcoded secrets in config files)"
  exit 1
fi
echo "Policy check passed (no hardcoded secrets in docker-compose, workflows, .env.example)"
