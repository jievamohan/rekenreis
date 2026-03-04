# Epic 2: Skin System + 1 Skin

Build minigame skin system (rendering layer) + implement ONE skin (Monster Feed).

## Requirements
- Skin contract (TS) for rendering a round + callbacks
- Core loop remains single source of truth (no duplicated logic)
- /play switches skin via query/config (default classic)
- Implement ONE skin: Monster Feed (minimal UI, accessible)
- Tests: skin selection + contract/callback correctness
- Keep existing smoke/e2e green

## Tasks
- [ ] 0013-skin-contract-types
- [ ] 0014-use-skin-composable
- [ ] 0015-extract-skin-classic
- [ ] 0016-monster-feed-skin
- [ ] 0017-play-skin-wiring-tests

## PR Metadata
- Base: main
- Branch: feat/epic2-skin-system
- PR: #12
- URL: https://github.com/jievamohan/rekenreis/pull/12
