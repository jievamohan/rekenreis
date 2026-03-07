# Backlog — Epic 24.4 Fine-tune Spinup

## Epic Summary

Fine-tune tot spinup (Build + Start) nagenoeg instantaan. Slices 24.1–24.3 gedaan (benchmark, MySQL cache, build cache).

## Scope

**In:** e2e-container job optimalisatie; docs/runbooks/e2e-benchmark.md
**Out:** Andere gates; test logic; nieuwe tests

## Risks

- Lane I (infra): low risk. Standard CI.
- Mitigation: Gate D groen; cache miss fallback getest

## Tasks

1. **0129-epic24-4-parallel-load** — Parallel load Playwright + MySQL images when both caches hit; document final config

## NFRs

- Perf: spinup < ~1m30s (target: nagenoeg instantaan)
- Security: Gate D groen
- Playwright: container-only (policy 64)
