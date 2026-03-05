# Epic 21: Game Feel (Game Designer)

**Epic:** Minigame expansion + Dutch UI copy  
**Artifact:** game-feel.md  
**Author:** game-designer

---

## The 6 Invented Minigames

### 1. Bubble Pop (tap)

**Concept:** Bubbles float upward with numbers inside. One bubble shows the correct answer (e.g. 7 for 3+4). Tap it to pop and succeed.

| Aspect | Detail |
|--------|--------|
| **Interaction** | Tap/click on the correct bubble |
| **Required assets** | Bubble SVG (filled circle, gradient, optional shine); burst/ripple SVG for pop feedback; water background (reuse existing) |
| **Accessibility** | Keyboard: focusable bubbles in DOM order; Enter/Space to select; arrow keys to move focus |
| **Difficulty knobs** | `bubbleCount` (3–6), `floatSpeed` (slow/medium/fast), `distractorProximity` (how close wrong answers are to correct) |
| **Core loop** | Same `AdditionQuestion` → `correctAnswer`; wrong bubbles = wrong choices from `generateQuestionFromLevel`; no duplicated math |

---

### 2. Treasure Dive (drag)

**Concept:** A treasure chest is open. Gems/shells with numbers float nearby. Drag the gem that shows the correct answer into the chest.

| Aspect | Detail |
|--------|--------|
| **Interaction** | Drag correct gem/shell into drop zone (chest) |
| **Required assets** | Chest SVG (open lid); gem/shell SVG variants (3–4 shapes, number badge); drag ghost; drop-zone highlight |
| **Accessibility** | Keyboard: focus gems with Tab; arrow keys to move; Enter to "drop" into focused chest; or list of choices with Enter to select |
| **Difficulty knobs** | `gemCount` (3–5), `gemSpread` (distance), `requirePreciseDrop` (strict vs. generous hitbox) |
| **Core loop** | Same question/answer; drag target = correctAnswer; distractors = wrong choices |

---

### 3. Fish Feed (timed scene)

**Concept:** A fish waits with an open mouth. Pellets with numbers float by. Tap pellets to feed; must feed exactly N pellets (where N = correct answer) before time runs out. Over/under = gentle retry (no punitive fail).

| Aspect | Detail |
|--------|--------|
| **Interaction** | Timed scene; tap pellets in sequence; count must match answer |
| **Required assets** | Fish SVG (mouth open/closed); pellet SVG; timer bar/bubble; gentle "try again" feedback (no harsh fail) |
| **Accessibility** | Keyboard: focus pellets in order; no time pressure in reduced-motion mode (or extended timer); optional auto-advance on correct |
| **Difficulty knobs** | `timerSeconds` (8–20), `pelletFlowRate`, `maxPelletsVisible` (cap how many on screen) |
| **Core loop** | Same question; player taps N pellets where N = correctAnswer; wrong count → soft retry, no score penalty |

---

### 4. Coral Builder (scene/tap)

**Concept:** A reef skeleton is shown. Coral pieces with numbers appear one by one. Tap the piece that equals the correct answer to add it to the reef. Each correct tap builds the reef.

| Aspect | Detail |
|--------|--------|
| **Interaction** | Tap correct coral piece; piece attaches to reef |
| **Required assets** | Reef base SVG; coral piece SVGs (branch, fan, etc.) with number badges; attach animation (CSS) |
| **Accessibility** | Keyboard: focus pieces; Enter to select; clear focus order |
| **Difficulty knobs** | `pieceCount` (3–5), `pieceRevealDelay` (stagger or all at once) |
| **Core loop** | Single question; one correct piece; tap = select answer |

---

### 5. Submarine Sort (drag)

**Concept:** A submarine has compartments (e.g. left/right or 3 bins). Items with numbers must be sorted: drag the item showing the correct answer into the "correct" compartment.

| Aspect | Detail |
|--------|--------|
| **Interaction** | Drag item into correct compartment |
| **Required assets** | Submarine SVG with compartments; item SVGs (crates, barrels); drop zones |
| **Accessibility** | Keyboard: focus items and compartments; arrow keys + Enter to move; or select-from-list fallback |
| **Difficulty knobs** | `compartmentCount` (2–3), `itemCount` (3–5), `compartmentLabels` (optional hints) |
| **Core loop** | Same question; one correct item; correct compartment = correct answer |

---

### 6. Starfish Match (tap/timed)

**Concept:** Starfish pairs float on screen. Each pair has two numbers that sum to the answer. Tap the pair that sums correctly before time runs out. Gentle timer; no punitive fail.

| Aspect | Detail |
|--------|--------|
| **Interaction** | Tap the starfish pair whose numbers sum to correctAnswer |
| **Required assets** | Starfish SVG (pairs); number badges; timer indicator; match feedback |
| **Accessibility** | Keyboard: focus pairs; Enter to select; extended or disabled timer in prefers-reduced-motion |
| **Difficulty knobs** | `pairCount` (2–4), `timerSeconds` (10–25), `distractorSumProximity` |
| **Core loop** | Same question; pairs are (a,b), (wrong1,wrong2), etc.; one pair sums to correctAnswer |

---

## Mapping Table Design

**File:** `apps/web/content/minigame-map.v1.json`

```json
{
  "version": 1,
  "defaultMinigameId": "bubble-pop",
  "byLevelId": {
    "1": "bubble-pop",
    "2": "treasure-dive",
    "3": "bubble-pop"
  },
  "byChapter": {
    "ch1": { "minigameIds": ["bubble-pop", "treasure-dive"], "weights": [1, 1] },
    "ch2": { "minigameIds": ["bubble-pop", "treasure-dive", "fish-feed"], "weights": [1, 1, 1] }
  },
  "byPack": {
    "levels.classic.v1": { "minigameIds": ["bubble-pop", "treasure-dive", "coral-builder"], "weights": [2, 1, 1] }
  }
}
```

- **Resolution order:** `byLevelId` > `byChapter` (if level falls in chapter) > `byPack` > `defaultMinigameId`
- **Weighted pools:** When using pool, `weights` define relative probability (e.g. [2,1,1] = 50%/25%/25%)
- **Chapter:** Optional; chapters can be derived from level ranges (e.g. 1–10 = ch1, 11–20 = ch2) or explicit in level metadata

---

## Random Serving Algorithm

**Goals:** Random but fair; avoid repeats; deterministic for tests.

**Algorithm: Shuffle bag with no-repeat window**

1. **Build pool:** From mapping table, get `minigameIds` and `weights` for current context (level/chapter/pack).
2. **Shuffle bag:** Fill a bag with minigame IDs according to weights (e.g. 2× bubble-pop, 1× treasure-dive).
3. **Shuffle:** Use `createSeededRng(seed)` to shuffle the bag.
4. **Draw:** Pop from front of bag. When bag empty, refill and reshuffle.
5. **No-repeat window:** Before drawing, if the last N served minigames include the front-of-bag candidate, swap with next in bag. N = 2 or 3 (configurable).
6. **Seed:** `seed = sessionSeed + levelIndex` (or `packIndex`) for reproducibility.

**Determinism:** Same seed + same mapping + same level sequence ⇒ same minigame sequence. Tests can assert exact minigame IDs per level.

---

## Difficulty Progression Model

### Math ranges (operandMin / operandMax)

- Scale with **chapter** or **level index**.
- Chapters 1–3: operandMax 5–10
- Chapters 4–6: operandMax 10–15
- Chapters 7+: operandMax 15–20
- Existing `Level` schema already has `operandMin`, `operandMax`; no change needed. Progression comes from level pack ordering and chapter metadata.

### Minigame parameters

Scale with **level index** (0-based) within pack:

| Parameter | Low (early) | High (late) |
|-----------|-------------|-------------|
| `bubbleCount` | 3 | 6 |
| `floatSpeed` | slow | medium (never "fast" for kleuters) |
| `timerSeconds` | 15–20 | 8–12 |
| `gemCount` / `pieceCount` | 3 | 5 |
| `pairCount` | 2 | 4 |

Formula: `param = lerp(min, max, levelIndex / maxLevelIndex)` with optional step thresholds.

### Kleuter-friendly rules

- **No punitive failures:** Wrong answer → gentle "try again" or hint; no lives, no game-over.
- **Hints available:** When `hintMode` allows, show hint (e.g. highlight correct bubble, reduce choices).
- **prefers-reduced-motion:** Slower animations, longer timers, or timer-off mode.
- **Difficulty ceiling:** Respect `profile.prefs.difficultyCeiling` (e.g. upTo10) to cap operandMax.

---

## Integration with Existing Systems

### Pacing engine

- **Current:** `applyPacing` reorders levels so no two consecutive `challenge` levels.
- **Integration:** Pacing stays; minigame selection runs **after** level selection. For a given level, we resolve `minigameId` from mapping table, then apply difficulty params from `levelIndex` and `effectivePacingTag`.
- **Variety:** The no-repeat window ensures minigame variety even when pacing clusters easy levels.

### Level packs

- **Current:** `levels.classic.v1.json`, `levels.timed-pop.v1.json`, `levels.build-bridge.v1.json`; each level has `operator`, `operandMin`, `operandMax`, `choiceCount`, `hintMode`, `difficultyTag`, `pacingTag`.
- **Integration:** Level packs unchanged. `minigame-map.v1.json` references packs by filename (e.g. `levels.classic.v1`). Level index = position in paced pack.
- **Question generation:** `generateQuestionFromLevel(level, rng)` unchanged. Minigames receive `AdditionQuestion` and render it in their own interaction pattern.

### usePlayGame / play flow

- **Current:** `usePlayGame` loads question from level pack or infinite source; `selectAnswer(choice)` validates.
- **Integration:** Add `minigameId` to play context. Play page selects mode component by `minigameId` (or falls back to classic/timed-pop/build-bridge for existing modes). Same `onAnswer`/`selectAnswer` contract; minigames translate their interaction (tap/drag/timed) into a numeric choice.

### Skins

- **Current:** classic, monster-feed, space, pirate.
- **Integration:** Minigames can have skin-specific asset overrides (e.g. "bubble" vs "monster-bubble"). Default: use neutral underwater assets; skin overrides optional in later iterations.
