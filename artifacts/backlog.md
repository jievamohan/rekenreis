# Epic 7 — Second Mode (Drag & Drop) + Mode Selector UI: Backlog

## Epic Summary

Add a second game mode (build-bridge) using drag-and-drop interaction and a kid-friendly mode selector UI. Mode selector is reachable from /play; chooses Mode + optionally Skin; remembers last selection locally.

## Scope In

- Mode selector UI (big buttons with icons) reachable from /play
- Choose Mode + optionally Skin; remember last selection (localStorage)
- build-bridge mode: drag/drop, gap/bridge, planks as answers, friendly feedback, no fail state
- Keyboard alternative: select + place (no drag required)
- Extend InteractionModeId, modeResolver, useMode for build-bridge
- Tests: mode selector routing + persistence; build-bridge logic deterministic
- E2E: smoke covers switching to build-bridge and completing one round

## Scope Out

- More than 2 modes total (we have classic, timed-pop, build-bridge = 3; no more)
- New operators
- Backend auth/accounts

## Risks

| Area   | Note                                                |
|--------|-----------------------------------------------------|
| perf   | Drag library: prefer native HTML5 drag or minimal dep |
| a11y   | Keyboard path required; test thoroughly              |

## NFRs

- a11y: keyboard playable without drag
- perf: bundle budget unchanged
- Backward compat: /play without mode param still works (use stored or classic)

## Task List

| #    | Task                       | Lanes   | Gates  |
|------|----------------------------|---------|--------|
| 0040 | build-bridge-mode-contract | W2      | C,D,F  |
| 0041 | mode-selector-ui           | W1,W2   | C,D,F  |
| 0042 | mode-build-bridge-component| W1,W2   | C,D,F  |
| 0043 | mode-selector-tests        | T       | C,D,F  |
| 0044 | smoke-build-bridge         | I       | C,D,F  |

## Acceptance Criteria (Epic)

- [ ] Mode selector UI exists; big buttons, reachable from /play
- [ ] Selector persists mode/skin to localStorage
- [ ] build-bridge mode: drag/drop + keyboard place
- [ ] Friendly feedback; no fail state; gentle hint on wrong
- [ ] Unit tests: mode resolver, selector persistence, build-bridge logic
- [ ] E2E smoke: switch to build-bridge, complete one round
- [ ] Existing smoke/e2e green
