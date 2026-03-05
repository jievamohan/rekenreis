# Architecture — Epic 21.1

**PlanRef:** artifacts/archive/epic-21.0/latest/architecture.md
**Slice:** 21.1 — i18n Foundation + Dutch UI Copy

Architecture:
- apps/web/content/locales/nl.json: flat/nested key-value for all UI strings
- apps/web/composables/useI18n.ts: t(key, params?) composable, static import, fallback to key
- No vue-i18n dependency; custom composable sufficient for single locale
- ESLint custom rule or script for no-hardcoded English in templates
