# PR Draft Notes (Epic 22.0 Planning Snapshot)

## Scope

Planning-only `/epicify` output for Epic 22:

- Created planning artifacts in `artifacts/current`.
- Added design bible `docs/design/epic-22.md`.
- Added micro-epics `22.1..22.6` to `docs/epics.md`.
- Archived planning snapshot to `artifacts/archive/epic-22.0/latest`.

## Test Plan

- N/A for runtime changes in this planning-only commit.
## Summary

Epic 21.1: i18n Foundation + Dutch UI Copy

Create Dutch i18n infrastructure (useI18n composable + nl.json source of truth) and replace all ~195 hardcoded English strings across 7 pages and 20+ components with Dutch translations.

PlanRef: docs/design/epic-21.md (slice 21.1)

## Tasks

- [ ] 0118-i18n-composable
- [ ] 0119-i18n-pages
- [ ] 0120-i18n-components
- [ ] 0121-i18n-lint-gate
- [ ] 0122-i18n-tests

## PR Metadata
- Base: main
- Branch: feat/epic-21.1-i18n-dutch
- PR: #58
- URL: https://github.com/jievamohan/rekenreis/pull/58
