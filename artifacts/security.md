# Gate D: Security Baseline

## Gitleaks

**Status**: Not run locally (gitleaks not installed). CI uses gitleaks/gitleaks-action.

## Semgrep

**Status**: Not run locally. CI can add `semgrep scan --config auto` if needed.

## pnpm audit (web)

**Result**: 13 vulnerabilities (2 low, 5 moderate, 6 high)

- Notable: Nuxt 3.13.2 < 3.16.0 (cache poisoning), tar (via giget), serialize-javascript, etc.
- **Action**: Documented. Dependency remediation is follow-up. Bootstrap establishes the audit script runs.

## composer audit (api)

**Result**: PASS

- No security vulnerability advisories found.

## Summary

| Check | Status |
|-------|--------|
| gitleaks | CI only |
| semgrep | CI only |
| pnpm audit | RUN (vulns found; documented) |
| composer audit | PASS |
