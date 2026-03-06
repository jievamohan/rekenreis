# Epic 22 Risk Register

## Top Risks

- **Metadata drift risk:** Contract v2 fields omitted or inconsistent across minigames.
- **Diversity gate brittleness:** false positives without clear diagnostics.
- **Timer safety regressions:** punitive timeout behavior introduced during refactor.
- **Accessibility regression:** keyboard and reduced-motion paths diverge from pointer path.

## Mitigations

- Type-safe contract + validation tests.
- Deterministic CI gate with explicit failure messages.
- E2E coverage for timeout hint+continue and keyboard sorting fallback.
- Reduced-motion checks in unit/E2E.

## Sensitive Domains

- Auth: none
- Crypto: none
- Payments: none
