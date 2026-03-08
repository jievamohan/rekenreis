# Game Feel — Epic 27 (Game Designer)

## Problem with Current Coral Builder

- Mechanic: "Pick number from track" — abstract, not tactile
- No sense of building, placing, or nurturing
- Feels like a quiz disguised as a game

## Design Goal

Create a coral minigame that feels like a **real kids' game** — immediate, satisfying, with clear cause-and-effect. It does NOT need to resemble other minigames.

## Proposed Mechanic: Coral Reef Builder (Drag-to-Place)

### Core Loop

1. **Setup:** Reef base visible (rock/coral structure with an empty "target" slot)
2. **Pieces:** 3–5 coral pieces with numbers (choices) float or sit in a tray/source zone
3. **Goal:** Drag the correct coral piece onto the reef target slot (or tap to select + tap slot)
4. **Success:** Piece snaps into place, reef "glows" or grows slightly, correct feedback
5. **Wrong:** Piece wobbles, returns to tray; after 2 wrong, hint appears

### Why This Works for Kids

- **Concrete action:** "I put the coral on the reef" — matches mental model
- **Satisfying:** Snap-in, growth, celebration
- **Low pressure:** No timer; wrong answer is gentle
- **Distinct:** Drag-to-place on a reef is different from Treasure Dive (chest), Bubble Pop (tap), etc.

### Alternative Considered: Coral Tap (Bubble-Pop-like)

- Coral pieces bob gently; tap correct one
- **Rejected:** Too similar to Bubble Pop; user asked for something that feels different

### Alternative Considered: Coral Count

- Count fish near coral; answer is sum
- **Rejected:** Changes math model (counting vs. addition choice); out of scope

### Difficulty Knobs

- `pieceCount`: 3–5 coral pieces (choices)
- `reefComplexity`: simple reef vs. slightly busier (visual only)

### Contract Alignment

- `interactionType`: `drag-drop` (with keyboard fallback: select piece, then select slot)
- `requiredInputs`: pointer, keyboard
- `layoutClass`: `layout-drag-reef` (distinct from `layout-drag-chest` of Treasure Dive)

## Non-Goals

- Timer (keep it relaxed)
- Multiple rounds per question
- Changing the AdditionQuestion contract
