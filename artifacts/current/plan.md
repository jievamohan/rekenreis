# Plan: Epic 21 — Cohesive App Shell + Map→Level→Game→Feedback→Map Flow

Branch: `feat/epic-21-app-shell-flow`

## Objective
Make the app feel like one coherent game with consistent navigation, UI visibility rules,
and a complete Map→Play→Feedback→Map flow.

## Tasks (5)

| # | Title | Lane | Status |
|---|-------|------|--------|
| 1 | Route state contract + useNavigationState composable | W2 | pending |
| 2 | Refactor AppShell with UI visibility rules | W1 | pending |
| 3 | Update pages to respect visibility rules + wire flow | W1 | pending |
| 4 | Wire complete Map→Play→Feedback→Map end-to-end | W1/W2 | pending |
| 5 | E2E tests for full flow + navigation | T | pending |

## Acceptance Criteria
- From /map you can open an unlocked level and play it
- After level completion, return to /map with progress reflected
- Nav to Settings/Stickers/Summary works with correct UI visibility
- No orphan page without a way back to /map
- E2E covers: map→level→finish→back + settings navigation
