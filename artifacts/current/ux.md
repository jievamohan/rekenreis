# Epic 21.2 — UX Notes

**Source:** docs/design/epic-21.md §3

## UI Component: MinigameRenderer

- **Single new UI surface:** MinigameRenderer.vue
- **Placement:** Renders within existing play page (GameStageCard/play layout)
- **Role:** Dynamic component loader (lazy via defineAsyncComponent)

## Flow

```
Map → Play → [ProblemCard] → [Minigame Scene] → [Answer] → Feedback → Next
```

- ProblemCard remains canonical math display.
- Minigame is the interaction wrapper for answering.
- **Fallback:** If minigame fails to load → show Keypad.

## UX Constraints (from design)

- Tap targets ≥ 44px (deferred to minigame implementations).
- Keyboard: Tab, Enter/Space, arrow keys (deferred).
- No user choice of minigame—system auto-selects via mapping + serving.

## Epic 21.2 Scope

- MinigameRenderer: loading state, error state, a11y fallback to Keypad.
- No minigame visuals yet—foundation only.
