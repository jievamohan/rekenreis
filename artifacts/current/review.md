# Review Notes

Internal planning review completed for Epic 22 outputs:

- Required planning artifacts are present and non-empty.
- Design bible created for major epic 22.
- Micro-epics `22.1..22.6` appended with explicit acceptance criteria and E2E points.
- Archive snapshot created at `artifacts/archive/epic-22.0/latest`.
# Review — Epic 21.1

## Summary
- Created `useI18n` composable + `nl.json` locale file
- Replaced all English strings across 7 pages, ~20 components
- Added useI18n unit tests (9 tests)
- Added hardcoded-string lint script
- All gates pass: typecheck, build, tests, lint

## Files Changed
- New: `apps/web/content/locales/nl.json`
- New: `apps/web/composables/useI18n.ts`
- New: `apps/web/test/useI18n.test.ts`
- New: `apps/web/scripts/check-hardcoded-strings.sh`
- Modified: `apps/web/vitest.config.ts` (added ~ alias)
- Modified: 7 pages (index, start, map, play, summary, stickers, settings)
- Modified: ~20 components (AppShell, NavTabs, ParentGate, ProfileCreate, ProfileSelector, PlayModeSelector, LevelCompleteModal, MistakesReview, ProblemCard, Keypad, MapNode, MapAvatar, HintDots, HintNumberLine, SkinClassic, SkinSpace, SkinPirate, SkinMonsterFeed, ModeTimedPop, ModeBuildBridge)
- Modified: `utils/rewardsConfig.ts`, `utils/profileSchema.ts`
- Modified: test files (profileSchema.test, useProfile.test)

## Acceptance Criteria
- [x] 100% of visible UI strings come from nl.json via useI18n
- [x] Lint script catches new hardcoded English strings
- [x] No English text visible in the app
- [x] Typecheck clean, build passes
