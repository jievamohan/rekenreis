# Build Artifacts (Epic 46.2)

## Overview

The production build produces a **unified public folder** at `apps/api/public` containing:
- Laravel API: `index.php`, `.htaccess`
- Vue SPA: `index.html`, `_nuxt/`, route-specific HTML

## Artifact strategy

**Build artifacts are NOT committed to git.** They are:
- Generated locally by `make build`
- Excluded via `apps/api/.gitignore`
- Verified by the pre-push hook before every push

When deploying to production, run `make build` on the server (or in CI) before serving.

## Keeping artifacts up to date

### Before every push (recommended)

1. **Install the pre-push hook** (one-time):

   ```bash
   make install-hooks
   ```

2. The hook runs `make build` and verifies `_nuxt/` and `index.html` exist. If the build fails or artifacts are missing, the push is blocked.

### Manual build

```bash
make build
```

Runs `scripts/build-for-prod.sh`: Nuxt generate → copy to `apps/api/public` (preserves Laravel files).

### Skip pre-push (emergency only)

```bash
SKIP_PRE_PUSH_BUILD=1 git push
```

Use only when the hook cannot run (e.g. no Docker, CI context).

## Local verification

After `make build`:
- `apps/api/public/index.html` — Vue SPA entry
- `apps/api/public/_nuxt/` — JS/CSS chunks
- `apps/api/public/index.php` — Laravel (preserved)

Test unified folder locally:
```bash
php -S localhost:8000 -t apps/api/public
```
Then visit http://localhost:8000/ and http://localhost:8000/api/health
