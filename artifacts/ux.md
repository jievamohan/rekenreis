# Epic 2: Skin System + 1 Skin — UX

## Current state

- /play has "classic" math UI: prompt, choices, feedback, Next, stats, mode toggles
- No skin switching today

## Target state

### Classic skin (default)
- Unchanged from current: same layout, colors, controls
- Acts as reference implementation of the skin contract

### Monster Feed skin
- Minimal thematic overlay: "Feed the monster!"
- Same interaction model: question, choices, feedback, Next
- Visual twist: e.g. monster graphic or emoji; correct answer "feeds" it
- Accessible: same ARIA/focus behavior as classic
- No new controls; reuse choice buttons, feedback, Next

### Skin selection
- Query param: `/play?skin=monster-feed` or `/play?skin=classic`
- Default: classic when no param
- No extra nav/selector in Epic 2 (can add later)

## Constraints

- a11y: keyboard, focus, ARIA preserved (no regression)
- Bundle: keep within budget
- Minimal UI for Monster Feed — no heavy assets
