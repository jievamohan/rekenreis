# Plan — Epic 21.1: i18n Foundation + Dutch UI Copy

Branch: `feat/epic-21.1-i18n-dutch-ui`
PlanRef: docs/design/epic-21.md (Section 6: i18n architecture, Section 9: Slice Map 21.1)

## Objective
Replace all hardcoded English UI strings with Dutch via a new `useI18n` composable and `nl.json` locale file.

## Scope
- Create `apps/web/content/locales/nl.json` (single source of truth)
- Create `apps/web/composables/useI18n.ts` (`t(key, params?)` with interpolation)
- Replace English strings in all 7 pages and ~20+ components
- Add ESLint rule / lint script for `no-hardcoded-ui-strings`
- Unit tests for useI18n; E2E for Dutch text verification
- Keep all functionality identical; only text changes

## Tasks (max 5)
1. i18n foundation (composable + nl.json + unit tests)
2. Dutch strings in pages (all 7 pages)
3. Dutch strings in components batch 1 (shell, nav, modals, forms, play)
4. Dutch strings in components batch 2 (skins, modes, hints, map, config)
5. ESLint lint script + E2E Dutch verification + final typecheck
