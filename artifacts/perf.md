# Performance

PASS - Bundle within budget

## Baseline (Epic 15)

- **Web build**: Must succeed (`pnpm run build`)
- **Output size**: `pnpm run size` reports `.output`; typical ~2 MB (nitro total)
- **Client chunk**: ~170 kB (Vue + runtime); no heavy new deps
- **CI**: Gate F runs build + size; no explicit numeric budget enforcement (manual check)

## Budget

| Metric | Budget | Notes |
|--------|--------|-------|
| Build | Pass | Required |
| .output total | < 3 MB | Nitro server + client |
| Client JS | < 250 kB | Vue, Nuxt, app code |

If over budget: audit deps, lazy-load non-critical modules, tree-shake.
