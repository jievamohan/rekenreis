# Gate F: Performance Budget

## Build

**Web**: PASS

```
pnpm run build
```

- Nuxt 3.13.2 build completed successfully
- Total size: 1.98 MB (482 kB gzip)

## Bundle Size (Baseline)

**Web .output**: 2.5M (first baseline)

```
pnpm run size
```

- Builds then reports `du -sh .output`
- Baseline established. Future PRs should not exceed this without approval.

## Summary

| Check | Status |
|-------|--------|
| Web build | PASS |
| Web size | 2.5M (baseline) |
