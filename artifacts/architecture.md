# Epic 7 — Architecture

## Layering

```
/play
  ├─ mode selector (modal or inline) — choose mode + skin
  │   └─ localStorage: lastMode, lastSkin
  ├─ route.query.mode, route.query.skin (synced from storage or user)
  └─ game area
      └─ <component :is="gameMode.component" /> (classic | timed-pop | build-bridge)
```

## Mode Selector

- **Option A**: Modal overlay on /play — "Choose game" button opens modal
- **Option B**: Dedicated route /play/select — navigates to /play with query after choice
- **Option C**: Inline on /play — when ?mode= empty and no stored pref, show selector instead of game

Recommendation: **Option A** — modal keeps URL simple; "Change mode" opens modal; first visit with no pref can auto-open or show selector above game area briefly.

## Build-Bridge Component

- Receives: SkinRoundProps + effectiveSkinId + (no recordTimeout for build-bridge)
- Renders: question prompt, bridge visual, draggable planks (answer choices), drop slot
- Callbacks: onAnswer(choice) when correct plank placed; onNext() after feedback
- Wrong placement: call onAnswer with wrong value → core loop handles feedback; show gentle hint
- Keyboard: plank buttons focusable; "place" via click on slot or dedicated control

## Data Flow

- usePlayGame unchanged: generates question, handles selectAnswer/nextQuestion
- ModeBuildBridge: same contract as ModeClassic — receives question, choices, calls onAnswer/onNext
- Only interaction changes: drag-and-drop or keyboard place vs click
