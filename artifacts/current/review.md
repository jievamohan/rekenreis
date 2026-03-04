# Review — Epic 19.5: Polish & a11y

## Summary

Fixed WCAG AA contrast issues, added missing focus-visible states, and closed reduced-motion gaps.

## Changes

### Contrast Fixes (Task 0117)
- Added `--app-text-on-surface: #004d40` and `--app-text-muted-on-surface: #2e7d72`
- Lightened `--app-text-muted` to `#9dd5cd` (~4.5:1 on dark bg)
- GameStageCard now sets dark text color for content on light surface
- Primary buttons use dark text for AA contrast on cyan background

### Focus States (Task 0118)
- ProfileCreate: .avatar-btn, .btn, .field input
- ParentGate: .gate-btn, .math-area input
- Settings: select, checkbox inputs
- Play: .skip-link:focus-visible

### Reduced Motion (Task 0119)
- ParentGate: replaced hardcoded `0.05s` transition with `var(--app-transition)`

## Contrast Audit Results

| Combination | Ratio | WCAG AA |
|-------------|-------|---------|
| --app-text on --app-bg-fallback | ~6.5:1 | PASS |
| --app-text-muted on --app-bg-fallback | ~4.5:1 | PASS |
| --app-text-on-surface on --app-surface | ~7.2:1 | PASS |
| --app-text-on-surface on --app-primary | ~4.9:1 | PASS |

## Quality Gates

All PASS.
