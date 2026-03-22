#!/usr/bin/env bash
# Scaffold a new project from rekenreis template.
# Usage: ./scripts/scaffold-new-project.sh <target_dir> <project_name> <github_org/repo>
# Example: ./scripts/scaffold-new-project.sh ../fissa fissa jievamohan/fissa
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET="${1:-}"
PROJECT_NAME="${2:-}"
REPO_SLUG="${3:-}"

if [[ -z "$TARGET" || -z "$PROJECT_NAME" || -z "$REPO_SLUG" ]]; then
  echo "Usage: $0 <target_dir> <project_name> <github_org/repo>" >&2
  echo "Example: $0 ../fissa fissa jievamohan/fissa" >&2
  exit 1
fi

# Resolve target (may not exist yet)
mkdir -p "$REPO_ROOT/$TARGET"
TARGET_ABS="$(cd "$REPO_ROOT/$TARGET" && pwd)"

if [[ "$TARGET_ABS" == "$REPO_ROOT" ]]; then
  echo "Error: Target must be different from source repo" >&2
  exit 1
fi

echo "Scaffolding to $TARGET_ABS"
echo "  project=$PROJECT_NAME repo=$REPO_SLUG"
echo ""

# Directories to copy
COPY_DIRS=(.cursor scripts docker .githooks docs .github .semgrep)
for d in "${COPY_DIRS[@]}"; do
  src="$REPO_ROOT/$d"
  dst="$TARGET_ABS/$d"
  if [[ -d "$src" ]]; then
    echo "  Copying $d/..."
    mkdir -p "$(dirname "$dst")"
    rm -rf "$dst"
    cp -R "$src" "$dst"
  fi
done

# Apps: web = minimal template (no logic/pages), api = Laravel base with minimal routes
TEMPLATES="$SCRIPT_DIR/scaffold-templates"
echo "  Copying apps/web/ (minimal skeleton)..."
mkdir -p "$TARGET_ABS/apps/web"
rsync -a "$TEMPLATES/apps-web/" "$TARGET_ABS/apps/web/"

echo "  Copying apps/api/ (minimal skeleton, excluding vendor)..."
RSYNC_EXCLUDE=(--exclude=node_modules --exclude=vendor --exclude=.output --exclude=.nuxt \
  --exclude=coverage --exclude=playwright-report --exclude=test-results --exclude=.cache)
mkdir -p "$TARGET_ABS/apps/api"
rsync -a "${RSYNC_EXCLUDE[@]}" "$REPO_ROOT/apps/api/" "$TARGET_ABS/apps/api/"
# Skeletonize API: remove rekenreis logic, keep Laravel base + minimal health
echo "  Skeletonizing apps/api/..."
rm -f "$TARGET_ABS/apps/api/app/Http/Controllers/AuthController.php" \
      "$TARGET_ABS/apps/api/app/Http/Controllers/DebugAuthController.php" \
      "$TARGET_ABS/apps/api/app/Http/Controllers/ProgressController.php" \
      "$TARGET_ABS/apps/api/app/Http/Controllers/SessionStatsController.php" \
      "$TARGET_ABS/apps/api/app/Models/UserProgress.php" \
      "$TARGET_ABS/apps/api/app/Services/HealthService.php" \
      "$TARGET_ABS/apps/api/database/migrations/2026_03_12_000001_create_user_progress_table.php" 2>/dev/null || true
cp "$TEMPLATES/apps-api/Http/Controllers/HealthController.php" "$TARGET_ABS/apps/api/app/Http/Controllers/"
cp "$TEMPLATES/apps-api/routes-api.php" "$TARGET_ABS/apps/api/routes/api.php"

# Single files (all docker-compose variants)
FILES=(Makefile .gitignore docker-compose.yml docker-compose.ci.yml docker-compose.ci.pull.yml docker-compose.ci.e2e.yml docker-compose.ci.pr-build.yml docker-compose.ci.pr-build-api.yml docker-compose.ci.pr-mount.yml)
[[ -f "$REPO_ROOT/.gitleaks.toml" ]] && FILES+=(.gitleaks.toml)
for f in "${FILES[@]}"; do
  if [[ -f "$REPO_ROOT/$f" ]]; then
    echo "  Copying $f..."
    mkdir -p "$(dirname "$TARGET_ABS/$f")"
    cp "$REPO_ROOT/$f" "$TARGET_ABS/$f"
  fi
done

# Artifacts structure
echo "  Creating artifacts/..."
mkdir -p "$TARGET_ABS/artifacts/current" "$TARGET_ABS/artifacts/archive"
touch "$TARGET_ABS/artifacts/current/.gitkeep" "$TARGET_ABS/artifacts/archive/.gitkeep"

# Tasks dir with bootstrap template
echo "  Creating tasks/..."
mkdir -p "$TARGET_ABS/tasks"
cat > "$TARGET_ABS/tasks/0001-bootstrap-tooling.md" << 'TASK'
---
id: "0001"
title: "bootstrap-tooling"
status: ready
scope_in:
  - scripts/config to satisfy gates C, D, F for apps/web and apps/api
  - web: lint, typecheck, test, build, size scripts
  - api: phpstan, test, audit scripts
  - CI pipeline that runs gates on PR
  - /artifacts generation path
scope_out:
  - any application logic
lanes:
  - I (deps/infra) for scripts/config/CI
  - W2 minimal if needed for typecheck wiring
  - A2 minimal if needed for phpstan wiring
  - T for minimal test harness
gates:
  - C: typecheck (web), PHPStan (api)
  - D: gitleaks, semgrep, pnpm audit, composer audit
  - F: bundle-size budget, build success
---

# Bootstrap Tooling

Baseline scripts/config via this task before application logic.

## Acceptance Criteria

- [ ] **Web (apps/web)**: lint, typecheck, test, build, size scripts
- [ ] **API (apps/api)**: phpstan, test, audit-deps scripts
- [ ] **CI**: runs gates on PR
- [ ] **Artifacts**: `/artifacts` path exists
TASK

# Replace project-specific strings
# PROJECT_TITLE = capitalized name (e.g. Fissa)
PROJECT_TITLE="$(echo "$PROJECT_NAME" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"

echo ""
echo "  Replacing rekenreis → $PROJECT_NAME..."
find "$TARGET_ABS" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.sh" -o -name "*.md" -o -name "*.mdc" -o -name "*.toml" -o -name "*.ts" -o -name "*.vue" -o -name "*.php" -o -name "*.json" -o -name "Dockerfile" -o -name "Makefile" \) \
  ! -path "*/.git/*" ! -path "*/node_modules/*" ! -path "*/vendor/*" 2>/dev/null | while read -r f; do
  if grep -q "rekenreis" "$f" 2>/dev/null; then
    sed "s/rekenreis/$PROJECT_NAME/g" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
  fi
done

echo "  Replacing Rekenreis → $PROJECT_TITLE..."
find "$TARGET_ABS" -type f \( -name "*.ts" -o -name "*.vue" -o -name "*.php" -o -name "*.json" \) \
  ! -path "*/.git/*" ! -path "*/node_modules/*" ! -path "*/vendor/*" 2>/dev/null | while read -r f; do
  if grep -q "Rekenreis" "$f" 2>/dev/null; then
    sed "s/Rekenreis/$PROJECT_TITLE/g" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
  fi
done

echo "  Replacing jievamohan/rekenreis → $REPO_SLUG..."
find "$TARGET_ABS" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.sh" -o -name "*.md" \) \
  ! -path "*/.git/*" ! -path "*/node_modules/*" ! -path "*/vendor/*" 2>/dev/null | while read -r f; do
  if grep -q "jievamohan/rekenreis" "$f" 2>/dev/null; then
    sed "s|jievamohan/rekenreis|$REPO_SLUG|g" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
  fi
done

# Make scripts executable
echo "  Making scripts executable..."
find "$TARGET_ABS/scripts" -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true

# Install hooks (if .git exists in target)
if [[ -d "$TARGET_ABS/.git" && -f "$TARGET_ABS/scripts/ci/install-hooks.sh" ]]; then
  echo ""
  echo "  Installing git hooks..."
  (cd "$TARGET_ABS" && ./scripts/ci/install-hooks.sh)
fi

echo ""
echo "Done. Scaffold written to $TARGET_ABS"
echo "Next steps:"
echo "  1. cd $TARGET_ABS && pnpm install (in apps/web) and composer install (in apps/api)"
echo "  2. docker compose up --build"
echo "  3. See docs/runbooks/commands.md for CI commands"
