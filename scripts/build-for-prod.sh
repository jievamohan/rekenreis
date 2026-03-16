#!/usr/bin/env bash
# Build Vue frontend and copy to apps/api/public for unified production deployment.
# Preserves Laravel index.php and .htaccess.
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
cd "$REPO_ROOT"

WEB_DIR="$REPO_ROOT/apps/web"
PUBLIC_DIR="$REPO_ROOT/apps/api/public"
OUTPUT_PUBLIC="$WEB_DIR/.output/public"

echo "Building Vue frontend..."
# Use pnpm in container if available, else host
if command -v docker >/dev/null 2>&1 && docker compose ps web --format json 2>/dev/null | grep -q running; then
  docker compose exec -T web pnpm run generate
else
  (cd "$WEB_DIR" && pnpm run generate)
fi

if [[ ! -d "$OUTPUT_PUBLIC" ]]; then
  echo "Error: Vue build output not found at $OUTPUT_PUBLIC" >&2
  exit 1
fi

# Preserve Laravel files (must not be overwritten by Vue output)
BACKUP_DIR=$(mktemp -d)
for f in index.php .htaccess favicon.ico robots.txt; do
  [[ -f "$PUBLIC_DIR/$f" ]] && cp "$PUBLIC_DIR/$f" "$BACKUP_DIR/$f"
done

# Copy Vue output (overwrites index.html if present)
echo "Copying Vue output to apps/api/public..."
rsync -a --delete \
  --exclude 'index.php' \
  --exclude '.htaccess' \
  --exclude 'favicon.ico' \
  --exclude 'robots.txt' \
  "$OUTPUT_PUBLIC/" "$PUBLIC_DIR/"

# Restore Laravel files
for f in index.php .htaccess favicon.ico robots.txt; do
  [[ -f "$BACKUP_DIR/$f" ]] && mv "$BACKUP_DIR/$f" "$PUBLIC_DIR/$f"
done
rm -rf "$BACKUP_DIR"

echo "Build complete. Unified folder: $PUBLIC_DIR"
