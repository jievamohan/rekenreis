# Security Design — Epic 23: Playwright CI Speed

## Risk Assessment

- **Scope:** CI/infrastructure only. No application code, auth, or data handling changes.
- **New risks:** Low. Caching and parallelization are standard CI practices.

## Considerations

1. **Cache integrity:** pnpm/composer caches must not weaken dependency integrity. Use hash-based cache keys (already in place).
2. **Secrets:** No new secrets. Existing GITHUB_TOKEN usage unchanged.
3. **Container isolation:** Playwright runs in container; no change to isolation model.
4. **SAST/DAST:** Unaffected. Gates remain as configured.

## Checks Required

- Gate D (security) must remain green.
- No new dependencies with security implications.
- Cache keys must include lockfile hash (already: `hashFiles('apps/web/pnpm-lock.yaml')`).
