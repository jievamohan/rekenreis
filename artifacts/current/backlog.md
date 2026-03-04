# Backlog — Epic 19.4: Page Unification

## Epic Summary

Replace all hardcoded colors across pages, shared components, game modes, hints, and skins with underwater theme CSS custom properties for visual consistency.

## Scope

### scope_in
- Replace hardcoded colors (#06c, #333, #666, #999, #ccc, #f0f0f0, #e6f2ff, etc.) with CSS variables
- Theme: ProfileSelector, PlayModeSelector, ProfileCreate, ParentGate
- Theme: pages/index, pages/play, pages/stickers, pages/summary
- Theme: ModeTimedPop, ModeBuildBridge, HintNumberLine, HintDots
- Theme: SkinClassic, SkinMonsterFeed, SkinSpace, SkinPirate
- Ensure visual consistency across all routes

### scope_out
- New components or pages
- Backend changes
- New animations or features
- Token/variable changes (use existing tokens)

## Risks + Mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Visual regression | perf | Verify build, typecheck; manual visual check |

## Task List

1. **0112** — Theme shared components (W1, Gate C)
2. **0113** — Theme pages (W1, Gate C)
3. **0114** — Theme game modes + hints (W1, Gate C)
4. **0115** — Theme skins (W1, Gate C)
5. **0116** — Verify typecheck + build + bundle budget (T/I, Gates C/D/F)
