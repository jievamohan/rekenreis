# Solution — Epic 21.1

**PlanRef:** artifacts/archive/epic-21.0/latest/solution.md
**Slice:** 21.1 — i18n Foundation + Dutch UI Copy

File locations:
- apps/web/content/locales/nl.json (new)
- apps/web/composables/useI18n.ts (new)
- All 7 pages + 20+ components (modified: replace hardcoded strings)
- scripts/ci/check-i18n.sh or ESLint config (new)

Build impact: nl.json statically imported; no runtime fetch; negligible bundle increase.
