# UX: Epic 21

## Navigation Model
- Consistent shell on every page: TopBar + NavTabs
- "Back to Map" visible everywhere except /map
- Active tab visually marked (aria-current="page"), not hidden
- Play page has "Exit to Map" as escape hatch

## Flow
1. Map → tap unlocked node → /play?level=N
2. Play 5 rounds → LevelCompleteModal
3. Primary CTA: "Back to Map" | Secondary: "Next Level" (if unlocked)
4. Return to Map → progress reflected (stars, unlock)

## Key UX Decisions
- No redesign of visuals (per constraint)
- NavTabs remain at bottom on all pages
- TopBar simplified: profile pill + context-aware action button + map button
- "Choose game" button only shows on /play (or when handler registered)
