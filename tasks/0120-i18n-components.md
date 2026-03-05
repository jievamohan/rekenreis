---
id: "0120"
title: "Replace English strings in all components"
epic: "21.1"
lane: W1
gates: [C, D, F]
risk_tags: []
depends_on: ["0118"]
scope_in:
  - apps/web/components/AppShell.vue
  - apps/web/components/NavTabs.vue
  - apps/web/components/ProfileSelector.vue
  - apps/web/components/ProfileCreate.vue
  - apps/web/components/ParentGate.vue
  - apps/web/components/PlayModeSelector.vue
  - apps/web/components/modals/LevelCompleteModal.vue
  - apps/web/components/review/MistakesReview.vue
  - apps/web/components/play/ProblemCard.vue
  - apps/web/components/play/Keypad.vue
  - apps/web/components/map/MapNode.vue
  - apps/web/components/map/MapAvatar.vue
  - apps/web/components/skins/SkinClassic.vue
  - apps/web/components/skins/SkinSpace.vue
  - apps/web/components/skins/SkinPirate.vue
  - apps/web/components/skins/SkinMonsterFeed.vue
  - apps/web/components/modes/ModeTimedPop.vue
  - apps/web/components/modes/ModeBuildBridge.vue
  - apps/web/components/hints/HintDots.vue
  - apps/web/components/hints/HintNumberLine.vue
  - apps/web/utils/rewardsConfig.ts
  - apps/web/utils/profileSchema.ts
  - apps/web/composables/useProfile.ts
scope_out:
  - pages (separate task)
  - new component creation
acceptance:
  - All components use t() from useI18n for visible text
  - All aria-labels use t() for Dutch text
  - AppShell nav labels are Dutch
  - LevelCompleteModal messages are Dutch
  - All skin/mode feedback text is Dutch
  - Rewards config label is Dutch
  - Default profile name is Dutch
  - Typecheck clean
  - Build passes
---

# 0120 — Replace English strings in all components

## What
Replace all hardcoded English strings in all components, skins, modes, hints, and TS utils with useI18n t() calls.

## Key changes

### Shell/Nav
- AppShell.vue: nav labels, profile text, "Choose game", "Close", "Back to Map"
- NavTabs.vue: aria-label "Main navigation"
- ProfileSelector.vue: "Who is playing?", "Add new profile"
- ProfileCreate.vue: "New profile", "Name", labels, buttons
- ParentGate.vue: all prompts and labels

### Modes/Skins
- All 4 skins: title, hints, feedback (Correct/Wrong/Timeout), Score/Streak labels, difficulty labels
- ModeTimedPop.vue: feedback, labels
- ModeBuildBridge.vue: feedback, aria-labels

### Game UI
- LevelCompleteModal.vue: title, star messages, button labels
- MistakesReview.vue: standardize mixed Dutch/English to pure t() calls
- ProblemCard.vue: aria-label
- Keypad.vue: aria-labels
- MapNode.vue: aria-label
- MapAvatar.vue: aria-label
- HintDots.vue / HintNumberLine.vue: aria-labels

### TS Utils
- rewardsConfig.ts: STICKER_CATEGORIES label
- profileSchema.ts: default "Player 1" → "Speler 1"
- useProfile.ts: fallback name

## Acceptance
- [ ] No English strings in any component template
- [ ] All skins/modes use t() for feedback
- [ ] Typecheck clean
- [ ] Build passes
