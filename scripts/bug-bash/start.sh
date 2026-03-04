#!/usr/bin/env bash
# Start the stack for bug bash. Run from repo root.
set -euo pipefail

cd "$(dirname "$0")/../.."
docker compose up --build -d
echo "Stack starting. Web: http://localhost:3000  API: http://localhost:8001"
echo "Run scripts/bug-bash/open-urls.sh to open key URLs in browser."
