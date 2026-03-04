# Epic 7 — Second Mode (Drag & Drop) + Mode Selector UI

Build Epic 7: Add a second game mode using drag & drop interaction and a kid-friendly mode selector UI.

**Requirements:**
- Implement mode selector UI (big buttons with icons) reachable from /play
- Choose Mode + optionally Skin; remember last selection (local)
- Add build-bridge mode: drag correct plank into gap; friendly feedback; no fail state
- Accessibility: keyboard alternative (select + place)
- Tests: mode selector routing + persistence; build-bridge logic deterministic
- E2E: smoke covers switching to build-bridge and completing one round

## Tasks

- [ ] 0040-build-bridge-mode-contract
- [ ] 0041-mode-selector-ui
- [ ] 0042-mode-build-bridge-component
- [ ] 0043-mode-selector-tests
- [ ] 0044-smoke-build-bridge

## PR Metadata
- Base: main
- Branch: feat/epic7-drag-drop-mode-selector
- PR: #23
- URL: https://github.com/jievamohan/rekenreis/pull/23
