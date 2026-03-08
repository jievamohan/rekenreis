# Solution Design — Epic 27 (Solution Designer)

## Implementation Approach

### 1. Replace MinigameCoralBuilder.vue

- **New mechanic:** Drag coral piece from source zone to reef target slot
- **Keyboard fallback:** Tab through pieces → select; Tab to slot → Enter to place
- **Structure:**
  - Source zone: coral pieces (choices) as draggable items
  - Reef zone: reef base with one highlighted drop target
  - On correct drop: emit answer, show success
  - On wrong drop: wobble, return, optional hint after 2 wrong

### 2. Asset Creation

- Reef base SVG: simple rock/coral structure with clear drop area
- Coral piece SVGs: 2–3 variants (branch, fan) — can be colored via CSS or separate files
- Each < 2 KB; total < 15 KB

### 3. Pointer + Keyboard Handling

- Pointer: pointerdown → drag ghost → pointermove → pointerup on drop zone
- Keyboard: focusable buttons for pieces and slot; select piece, focus slot, Enter to place
- Reuse patterns from MinigameTreasureDive (drag) and MinigameSubmarineSort (keyboard fallback)

### 4. useMinigame Registry Update

- `interactionType`: `'drag-drop'` (was `build-sequence`)
- `layoutClass`: `'layout-drag-reef'`
- `uniqueDifficultyKnobs`: pieceCount, optional reefStyle

### 5. Dutch Copy (nl.json)

- Update `minigameCoralBuilder` keys:
  - `sequenceHint` → new instruction, e.g. "Sleep het juiste koraal naar het rif!"
  - `pieceLabel`, `trackLabel` → `coralLabel`, `reefLabel`, `dropZoneLabel`

## File Changes

| File | Change |
|------|--------|
| `MinigameCoralBuilder.vue` | Full rewrite (drag-to-place mechanic) |
| `useMinigame.ts` | Update coral-builder contractV2 |
| `nl.json` | Update minigameCoralBuilder strings |
| `assets/graphics/minigames/coral-builder/*` | New SVGs |
| E2E specs | Update coral-builder interaction tests |

## Rollback

- Revert MinigameCoralBuilder.vue to previous version; no schema or API changes
