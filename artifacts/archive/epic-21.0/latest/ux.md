# Epic 21: UX Design (UX Designer)

**Epic:** Minigame expansion + Dutch UI copy  
**Artifact:** ux.md  
**Author:** ux-designer

---

## 1. Minigame Selection Integration

### Flow: Map → Play → Minigame

The existing flow is:

1. **Map** (`/map`) — User selects level or taps "Play Level N"
2. **Play** (`/play?level=N`) — ProblemCard + Keypad (or skin-based modes)
3. **Round outcome** — Feedback, then Next/Finish

Epic 21 extends this with a **minigame layer** between problem presentation and answer input:

```
Map → Play → [ProblemCard] → [Minigame Scene] → [Answer via minigame interaction] → Feedback → Next
```

- **ProblemCard** remains the canonical math display (e.g. `3 + 5 = ?`).
- **Minigame** is the interaction wrapper: the same question is answered through a themed mechanic (pop bubbles, drag gems, feed fish, etc.).
- **Random serving** — The system selects which minigame to show per round; the user does not choose. A mapping table links level ranges or pacing tags to minigame pools.
- **Fallback** — If a minigame fails to load or is unavailable, fall back to Keypad (existing behavior).

### Integration Points

| Location | Change |
|----------|--------|
| `play.vue` (keypad mode) | After ProblemCard render, optionally transition to minigame scene instead of Keypad |
| `play.vue` (infinite/skin mode) | Minigames can replace or augment skin-based modes; decision via modeResolver |
| Level pack / pacing | Mapping table: `levelRange` or `pacingTag` → `minigamePool[]` |
| `usePlayGame` | Emits question; minigame component receives it and calls `onAnswer(n)` on completion |

---

## 2. Screen Layouts (Wireframe Descriptions)

### Bubble Pop

- **Layout:** Full-width play area. ProblemCard at top (compact). Below: grid of floating bubbles (4–12), each labeled with a number. One bubble = correct answer.
- **Interaction:** Tap the bubble with the correct sum. Bubbles float gently (CSS animation).
- **Feedback:** Correct bubble pops (scale + opacity); wrong bubble shakes gently.
- **Zones:** Each bubble min 48×48px tap target; spacing ≥ 12px between bubbles.

### Treasure Dive

- **Layout:** ProblemCard top. Middle: seabed with 3–5 "treasure" items (gems, shells). One item has the correct answer.
- **Interaction:** Drag the correct treasure into a chest or target zone.
- **Feedback:** Correct: treasure animates into chest; wrong: gentle bounce back.
- **Zones:** Each treasure min 56×56px; drop zone min 80×80px.

### Fish Feed

- **Layout:** ProblemCard top. Center: fish character in bowl. Below: row of food pellets labeled with numbers (e.g. 5, 7, 8).
- **Interaction:** Tap/drag the pellet with the correct answer to feed the fish.
- **Feedback:** Correct: fish eats, happy animation; wrong: pellet bounces, fish stays neutral.
- **Zones:** Pellets min 48×48px; fish bowl is non-interactive decoration.

### Coral Builder

- **Layout:** ProblemCard top. Reef base (horizontal bar). Stack of coral pieces, each showing a number. Build a tower that sums to the answer.
- **Interaction:** Drag coral pieces onto the reef; sum must equal answer.
- **Feedback:** Correct sum: coral locks, celebration; wrong: piece returns, gentle hint.
- **Zones:** Each piece min 44×44px; drop area min 120px wide.

### Submarine Sort

- **Layout:** ProblemCard top. Submarine with 2–3 compartments (e.g. "&lt; 10", "= 10", "&gt; 10" or by sum). Items to sort: bubbles/objects with numbers.
- **Interaction:** Drag each item into the correct compartment.
- **Feedback:** Correct: item locks in place; wrong: item returns with soft shake.
- **Zones:** Compartments min 80px tall; items min 48×48px.

### Starfish Match

- **Layout:** ProblemCard top. Grid of starfish (pairs). One starfish shows `a + b`, the other shows the correct number. Match pairs.
- **Interaction:** Tap first starfish, then second. Match correct sum to problem.
- **Feedback:** Correct pair: both highlight; wrong: selection clears after short delay.
- **Zones:** Each starfish min 56×56px; 2×3 or 3×2 grid.

---

## 3. Minigame Transition UX

### Problem Card → Minigame Scene

1. **ProblemCard** visible for ~1s (or immediate if no intro).
2. **Transition:** Fade or slide ProblemCard up/shrink; minigame scene fades in. Use `--app-ease-enter` (0.25s).
3. **Reduced motion:** Skip animation; instant swap.

### Minigame → Feedback

1. User completes interaction (tap/drag correct answer).
2. **Immediate:** Minigame shows success state (pop, eat, lock, etc.).
3. **After ~0.5s:** Fade to feedback overlay ("Correct!" / "Not quite. The answer was X.") — same as current Keypad feedback.
4. **Next button** appears; same behavior as Keypad mode.

### Back Navigation

- "← Map" remains visible during minigame play.
- Tapping it exits to `/map` without completing the round (same as current).

---

## 4. Navigation: Automatic (Random) Serving

- **User does not choose** which minigame to play. The system selects based on:
  - Mapping table (level → minigame pool)
  - Random pick within pool (seedable RNG for tests)
  - No-repeat window: avoid serving the same minigame twice in a row within a session
- **"Choose game"** in AppShell opens PlayModeSelector (Classic / Timed Pop / Build Bridge). Minigames are **within** these modes, not a separate top-level choice.
- **Educator override:** Mapping table is configurable (e.g. JSON) so curriculum alignment can lock specific minigames to levels. Out of scope for MVP UI; config only.

---

## 5. Dutch Copy Strategy

### Single Source of Truth

- **File:** `apps/web/i18n/nl.json` (or `locales/nl.json` if using vue-i18n)
- **Composable:** `useI18n()` — returns `{ t(key) }` for lookup
- **Fallback:** If key missing, show key (dev) or English (optional); prefer key to avoid silent failures.

### Structure (nl.json)

```json
{
  "common": {
    "map": "Kaart",
    "backToMap": "Naar de kaart",
    "next": "Volgende",
    "finish": "Afronden",
    "close": "Sluiten"
  },
  "map": {
    "title": "Kies level",
    "playLevel": "Speel level {n}",
    "progress": "{stars} / {max} sterren"
  },
  "play": {
    "score": "Score",
    "streak": "Reeks",
    "roundProgress": "{current} / {total}",
    "correct": "Goed zo!",
    "wrong": "Niet helemaal. Het antwoord was {answer}.",
    "skipToGame": "Ga naar spel"
  },
  "levelComplete": {
    "title": "Level {n} klaar!",
    "perfect": "Perfect! Geweldig gedaan!",
    "great": "Mooi! Bijna perfect!",
    "good": "Goed gedaan! Blijf oefenen!",
    "backToMap": "Naar de kaart",
    "nextLevel": "Volgend level",
    "reviewMistakes": "Fouten bekijken"
  },
  "mistakesReview": {
    "title": "Laten we deze nog eens bekijken!",
    "subtitle": "Level {level} — {count} om te bekijken",
    "yourAnswer": "Jouw antwoord",
    "correct": "Goed",
    "retry": "Opnieuw proberen",
    "toMap": "Naar de kaart"
  },
  "minigames": {
    "bubblePop": { "name": "Bellen ploppen", "hint": "Tik op de bel met het goede antwoord" },
    "treasureDive": { "name": "Schat duiken", "hint": "Sleep de juiste schat naar de kist" },
    "fishFeed": { "name": "Vis voeren", "hint": "Geef de vis het juiste eten" },
    "coralBuilder": { "name": "Koraal bouwen", "hint": "Bouw tot het antwoord klopt" },
    "submarineSort": { "name": "Onderzeeër sorteren", "hint": "Sleep naar de juiste plek" },
    "starfishMatch": { "name": "Zeester matchen", "hint": "Zoek het juiste paar" }
  },
  "nav": {
    "map": "Kaart",
    "stickers": "Stickerboek",
    "progress": "Voortgang",
    "settings": "Instellingen"
  },
  "settings": { ... },
  "privacy": { ... }
}
```

### Where Current English Strings Live

| File | Strings to Replace |
|------|--------------------|
| `pages/index.vue` | "Welcome!", "Ready to practice math? Pick a game and have fun!", "Check connection", "Play math game" |
| `pages/start.vue` | "Start", "Unable to connect...", "Loading..." |
| `pages/map.vue` | "Choose Level", "Play Level {n}", "Overall progress" |
| `pages/play.vue` | "Score", "Streak", "Round progress", "Correct!", "Not quite...", "Next", "Finish", "← Map", "Skip to game", "Rounds today", "Don't share anonymous stats", privacy note |
| `pages/summary.vue` | "Progress Summary", intro, "Rounds today", "Total rounds", "Accuracy", "Favorite mode", "Copy to clipboard", "Copied!", "Copy failed", "Save as file", privacy |
| `pages/stickers.vue` | "Sticker Book", intro, "New!", category labels |
| `pages/settings.vue` | "Settings", "Difficulty ceiling", "Up to 10", "Up to 20", "Show hints when stuck", "Sound effects" |
| `components/AppShell.vue` | "Map", "Sticker book", "Progress", "Settings", "Switch profile", "Back to Map", "Choose game", "Close", "Player 1" |
| `components/modals/LevelCompleteModal.vue` | "Level complete", "Level {n} Complete!", star messages, "Back to Map", "Next Level", "Review Mistakes" |
| `components/play/ProblemCard.vue` | aria-label: "{a} plus {b} equals {answer}" |
| `components/review/MistakesReview.vue` | "Laten we..." (already Dutch), "to review", "Your answer", "Correct", "Opnieuw proberen", "Naar de kaart" |
| `components/PlayModeSelector.vue` | "Choose game", "Game mode", "Theme", "Close", mode labels |
| `components/ParentGate.vue` | "For grown-ups...", "Hold 3 seconds", "Solve a simple sum", "Keep holding...", "Try again.", "Check" |
| `utils/rewardsConfig.ts` | STICKER_CATEGORIES label "Skins" |
| `play.vue` MODE_OPTIONS | "Classic", "Timed Pop", "Build Bridge" |

---

## 6. Tap Target Sizes & Interaction Zones

- **Minimum tap target:** 44×44px (`--app-tap-min` already defined).
- **Recommended for kleuters:** 48×48px for primary actions; 56×56px for drag handles.
- **Spacing:** ≥ 8px between interactive elements to avoid mis-taps.
- **Interaction zones per minigame:** See Section 2; all exceed 44px.

---

## 7. Error / Feedback States (Gentle, Non-Punitive)

| State | Treatment |
|-------|-----------|
| Wrong answer | Gentle shake or bounce; message: "Niet helemaal. Het antwoord was X." No red flash, no harsh sound. |
| Timeout (if applicable) | Same as wrong; no penalty text. |
| Stuck / no interaction | After 10s, optional hint (dots, number line) if hints enabled. |
| Network error | Only on start/health check; "Kan niet verbinden" with link to play offline. |
| Minigame load failure | Fallback to Keypad; no error modal for child. |

---

## 8. Progress Indicators During Minigame Play

- **Round progress:** Same as Keypad mode — "3 / 5" (or Dutch: "3 / 5") in header.
- **Score & Streak:** Same StatPill layout.
- **Within minigame:** No extra progress bar unless minigame has multi-step (e.g. Submarine Sort with 3 items). Use simple "1 of 3" text if needed.
- **Reduced motion:** No animated progress fills; use static text/counts only.

---

## Checks Required

- [ ] All minigame wireframes reviewed for tap target compliance
- [ ] Transition timing validated with prefers-reduced-motion
- [ ] nl.json key coverage matches string inventory
- [ ] useI18n composable supports interpolation (`t('key', { n: 5 })`)
