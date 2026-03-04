# Epic 17 — Graphics v1: Solution Design

## Implementation Order

### Phase 1: Design Artifacts (no code)

- `artifacts/art-direction.md`
- `artifacts/game-feel.md`
- `artifacts/motion-audio.md`
- `artifacts/assets.md`

### Phase 2: Assets Pipeline + Scene Layout

- Create `apps/web/assets/graphics/` folder structure
- Add SVG placeholders (background, plank, character)
- Create `SceneLayout.vue`: slots for background, foreground, character, content

### Phase 3: Graphical Build-Bridge Mode

- Refactor ModeBuildBridge to use SceneLayout
- Replace button planks with DraggablePlank (game objects)
- Implement wrong-drop: wobble + return + hint integration (useAssistance already provides hintToShow)
- Ensure keyboard: select plank → focus drop zone → place

### Phase 4: Mode Selector + Tests

- Mode selector already supports build-bridge; ensure kid-friendly (icons, labels)
- Unit tests: mode contract, drag/drop state transitions (fake timers)
- Smoke: switch to build-bridge → complete one round

## Wrong-Drop Behavior

1. User drops wrong plank in gap
2. `onAnswer(wrongChoice)` called → usePlayGame sets feedback
3. Mode: show wobble (CSS animation), then return plank to pool
4. **Key**: Do NOT advance to next question on wrong; feedback shows "Try another"
5. After 2 wrong: useAssistance sets hintToShow → mode displays hint
6. User tries again until correct

**Clarification**: Current usePlayGame already handles wrong answer (feedback, no score). Mode must:
- On wrong: animate wobble, keep plank in pool (don't "consume" it)
- Plank returns because we don't call onNext; user picks another

Actually: current flow calls `onAnswer(choice)` for both correct and wrong. usePlayGame sets feedback. The plank is not "consumed" — it's just that feedback is shown. So we need:
- On wrong: wobble the drop zone or the plank that was dropped, then... the plank was "dropped" so it's in the gap. We need to "return" it — i.e., clear the drop and put plank back in pool. That means we need local state: "plank in gap" vs "plank in pool". On wrong, we animate and reset that state.

**Revised flow**:
- Planks are in pool. User drags one to gap.
- On drop: if correct → onAnswer(correct), celebrate, onNext
- On drop: if wrong → wobble, return plank to pool (local state), onAnswer(wrong) for assistance tracking. No onNext.
- Keyboard: same logic.

## Drag/Drop State

- `selectedPlank: number | null` (keyboard selection)
- `draggedPlank: number | null` (during drag)
- On wrong drop: animate, then reset; do not call onNext.
