# Review — Epic 19.4: Page Unification

## Summary

Replaced all hardcoded colors across 16 Vue components with CSS custom properties from the underwater theme.

## Files Changed

### Shared Components
- ProfileSelector.vue, ProfileCreate.vue, PlayModeSelector.vue, ParentGate.vue

### Pages
- index.vue, play.vue, summary.vue

### Game Modes + Hints
- ModeTimedPop.vue, ModeBuildBridge.vue, HintNumberLine.vue, HintDots.vue

### Skins
- SkinClassic.vue, SkinMonsterFeed.vue, SkinSpace.vue, SkinPirate.vue

## Replacement Summary

| Old | New |
|-----|-----|
| #06c | var(--app-primary) |
| #333, #666, #999, #ccc | var(--app-muted) / var(--app-text-muted) |
| #f0f0f0, #f5f5f5, #eee, #f9f9f9 | var(--app-surface-elevated) |
| #e6f2ff | rgba(0, 188, 212, 0.15) |
| #0a0, #080 | var(--app-correct) |
| #c00, #800 | var(--app-wrong) |
| rgba(46,125,50,...) | rgba(0,188,212,...) |

## Quality Gates

All gates PASS.
