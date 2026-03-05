# QA — Epic 21.1

**PlanRef:** artifacts/archive/epic-21.0/latest/qa.md
**Slice:** 21.1 — i18n Foundation + Dutch UI Copy

Testing:
- Unit: useI18n key resolution, interpolation with params, missing key fallback
- E2E: verify Dutch text on /map, /play, /settings (no English visible)
- Lint gate: verify script catches hardcoded English in templates
- Regression: existing Playwright smoke tests must still pass (text selectors may need updating)
