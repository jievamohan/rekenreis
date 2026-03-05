# Epic 20 — Game Feel Design

> Planning document. No code changes.
> Game Feel Designer perspective for Rekenreis UI rebuild.

---

## 1. Level Map Feel

### 1.1 Path Reveal & Progression

- Levels unlock sequentially: complete level N → unlock level N+1.
- On first visit, the map shows all nodes but only level 1 is unlocked; the rest display a lock icon.
- Completed nodes show 1–3 filled stars beneath the node circle.
- The current (next-to-play) node has a gentle pulse animation (scale 1→1.05, 1.5s loop).
- The path behind completed nodes is fully opaque; ahead of the current node it is dimmed (opacity 0.4).

### 1.2 Star Display

| Stars | Condition |
|-------|-----------|
| 0 | Not yet completed |
| 1 | Completed with 2+ wrong answers |
| 2 | Completed with exactly 1 wrong answer |
| 3 | Completed with 0 wrong answers (perfect) |

Stars are small inline SVGs beneath each node. Filled stars use `--app-correct` (#69f0ae); empty stars use `--app-muted` (#80cbc4).

### 1.3 Lock / Unlock Visual States

| State | Visual |
|-------|--------|
| **Locked** | Node bg `--app-node-locked`, lock icon, non-interactive, `aria-disabled="true"`, no focus |
| **Unlocked (current)** | Node bg `--app-node-unlocked`, level number visible, pulse animation, focusable |
| **Completed** | Node bg `--app-node-unlocked`, level number visible, 1–3 stars, check mark or star overlay |

### 1.4 Avatar Placement

- The child's avatar (from `ProfileData.avatarId`) appears as a small bubble (40–48px) positioned near the current node.
- Uses the same avatar shapes as `ProfileSelector` (default, star, heart, circle, square).
- Gentle vertical bounce (translateY -4px, 0.4s, ease-out) on mount.

### 1.5 Scroll Behavior

- Map content may exceed viewport height (many levels = tall path).
- On mount, auto-scroll to the current node using `scrollIntoView({ behavior: 'smooth', block: 'center' })`.
- `prefers-reduced-motion`: use `behavior: 'auto'` (instant scroll).

---

## 2. Keypad Feel

### 2.1 Button Press Feedback

- On `mousedown` / `touchstart`: key scales to 0.95, bg shifts to `--app-keypad-key-active` (`--app-primary`).
- On release: spring back to scale 1, 0.15s ease-out.
- Optional: vibration via `navigator.vibrate(10)` if supported (silent fail if not).
- `prefers-reduced-motion`: no scale animation; instant color change only.

### 2.2 Number Entry Flow

1. Child taps digit → digit appends to answer display (e.g., "1" → "12").
2. Answer display is large (2rem+), centered above the keypad, within or adjacent to the problem card.
3. "Clear" / backspace key removes last digit.
4. Max 2 digits enforced (sums ≤ 20); input silently ignores further digits.
5. "Check" / "Controleer" submits the entered value. Disabled when answer display is empty.

### 2.3 Answer Display

- Large numeric text (2.5rem, bold) in a dedicated area between problem and keypad.
- Placeholder text when empty: "?" or blinking cursor effect.
- On submit: answer flashes briefly before feedback appears.

### 2.4 Correct / Wrong Feedback Timing

| Event | Timing | Visual |
|-------|--------|--------|
| Correct | 0.25s delay → green glow + bounce | `--app-correct` bg on answer, existing `feedback-bounce` |
| Wrong | 0.25s delay → coral shake | `--app-wrong` bg on answer, existing `feedback-shake` |
| Hint | After 2 wrong on same level → show `HintDots` or `HintNumberLine` | Existing `useAssistance` logic |
| Next | Appears after feedback | "Next" button fades in, 0.25s delay |

---

## 3. Level Complete Feel

### 3.1 Star Reveal Sequence

1. Modal panel enters (scale 0.95→1, 0.3s).
2. Mascot appears (fade in, 0.2s).
3. Stars reveal one by one with 150ms stagger:
   - Each star scales from 0 to 1 with a slight bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
   - Unfilled star positions remain visible but dimmed.
4. After last star: confetti burst (0.3s delay).
5. "Next" CTA fades in (0.25s, after confetti starts).

### 3.2 Confetti Burst

- 24–32 CSS particles, no canvas.
- Colors: `--app-primary`, `--app-secondary`, `--app-correct`, gold (#ffd54f).
- Duration: 1.2s, then particles fade out.
- Only triggers for 2+ stars (skip confetti for 1-star to keep emotional tone appropriate).
- `prefers-reduced-motion`: no confetti; optionally show 3–5 static sparkle SVGs.

### 3.3 Mascot Reaction

- Mascot character (from `assets/graphics/characters/mascot.svg`) displayed at ~100px height.
- Gentle bounce loop (2 iterations, 0.6s each, ease-in-out).
- Expression: always happy/neutral — no sad mascot for low stars.
- `prefers-reduced-motion`: static mascot, no bounce.

### 3.4 CTA Logic

| Session Outcome | CTA Options |
|----------------|-------------|
| All correct (3 stars) | "Next Level" (primary) |
| Some wrong (1–2 stars) | "Next Level" (primary) + "Review Mistakes" (secondary) |
| Last level in pack | "Back to Map" (primary) |

---

## 4. Mistakes Review Feel

### 4.1 Tone

- **Never punitive.** No red X marks, no frowning faces.
- Heading: "Laten we deze nog eens bekijken!" (Let's look at these again!)
- Mascot appears with an encouraging expression.

### 4.2 Card Layout Per Mistake

Each mistake is a card with:
- Problem: `3 + 5 = ?` (large text, `--app-font-size-xl`)
- Child's answer: struck through or dimmed (not red), labeled "Jouw antwoord:" (Your answer:)
- Correct answer: highlighted in `--app-correct`, labeled "Het juiste antwoord:" (The correct answer:)
- Optional visual: `HintDots` showing the correct sum (dots for each operand)

Cards slide in from the right with 60ms stagger. `prefers-reduced-motion`: instant appearance.

### 4.3 CTAs

- "Opnieuw proberen" (Try Again) — restart the same level.
- "Naar de kaart" (To the map) — navigate back to `/map`.
- Both use existing `PrimaryButton` / `SecondaryButton` styles.

---

## 5. Pacing & Difficulty

### 5.1 Mapping Existing Systems to Levels

- **Content packs** (`levels.classic.v1.json`, etc.) already contain ordered problems.
- A "level" on the map = a batch of N problems from the pack (e.g., N=5).
- The pacing engine (`applyPacing`, `effectivePacingTag`) still controls per-problem difficulty tags within a level.
- `PACK_BY_MODE` resolves which pack to use based on game mode.

### 5.2 Problems Per Level

- **MVP:** 5 problems per level.
- Level count = `Math.ceil(pack.length / 5)` (e.g., 27 problems → 6 levels, last level has 2 problems).
- Level 1 starts at pack index 0, level 2 at index 5, etc.

### 5.3 Star Thresholds

| Wrong Answers in Level | Stars |
|------------------------|-------|
| 0 | 3 (perfect) |
| 1 | 2 |
| 2+ | 1 |

Stars are computed at end of level. Stored in `ProfileProgress.levelProgress[levelIndex].stars`. Best-of: if replaying a level, keep the higher star count.

### 5.4 Existing Composable Mapping

| Composable | Role in Epic 20 |
|------------|-----------------|
| `usePlayGame` | Runs the problem loop; receives answer from Keypad via `onAnswer` |
| `usePersistence` | Extended to read/write `levelProgress`, `currentLevel` |
| `useRoundOutcome` | Records each answer; feeds mistake collection |
| `useAssistance` | Shows hints after repeated wrong (unchanged) |
| `useRewards` | Skin unlocks stay score-based; stars are separate |
| `useProfile` | `updateProfile` persists `levelProgress` |

---

*End of Game Feel Design*
