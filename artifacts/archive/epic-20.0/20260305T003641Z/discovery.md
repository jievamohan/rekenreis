# Epic 20 — UI Rebuild: Discovery (Business Analyst + Game Designer)

> Planning-only. No code changes.
> Rebuild the UI to match kindergarten game reference screenshots.

---

## 1. Target Audience & Context

**Primary users:** Children ages 4–7 (Dutch: kleuters, groep 1–3), playing at home or in school on tablets or shared devices.

**Context:**
- Rekenreis is a math practice game (addition focus) with an underwater theme (teal/cyan, bubbles, waves).
- Current stack: Nuxt 3 + Vue 3 + TypeScript; AppShell with NavTabs, GameStageCard; game modes: classic, timed-pop, build-bridge.
- Existing pages: `/` (home), `/start`, `/play`, `/stickers`, `/summary`, `/settings`.
- Persistence: `rekenreis_profiles_v1` in localStorage; per-profile `progress.bestScore`, `totalRounds`, `totalCorrect`, `totalWrong`, `totalTimeout`, `modeCounts`.
- Rewards: skins unlock by score threshold (`UNLOCK_THRESHOLDS`); sticker book shows collected skins.

**Design intent:** Match reference screenshots of a kindergarten-style math game: level map, big problem card, keypad, level-complete modal, and mistakes review. The app must feel like a playful journey, not a worksheet.

---

## 2. Primary Experience Goals (What Should the Child FEEL)

| Goal | Feeling |
|------|---------|
| **Belonging** | "This is my game. I see my avatar. I know where I am." |
| **Progress** | "I'm on a path. I can see how far I've come and what's next." |
| **Confidence** | "I can tap big buttons. I know what to do." |
| **Delight** | "Stars, confetti, mascot—I did it!" |
| **Safety** | "Wrong answers don't punish me. I can try again." |
| **Clarity** | "The problem is big and clear. I type my answer and press Check." |

---

## 3. "Looks/Feels Like" Acceptance Criteria (Per Screen)

### 3.1 `/map` Screen (New — Level Map)

**Purpose:** Hub for level selection; shows progression and current position.

| Criterion | Detail |
|-----------|--------|
| **Layout** | Winding path (SVG or CSS) with circular level nodes along it. No plain white document. |
| **Nodes** | Each node: circular, shows level number; state: completed (star), current (highlighted), locked (lock icon). |
| **Avatar** | Child's avatar in a bubble at current level position. Uses `ProfileData.avatarId` (default, star, heart, circle, square). |
| **CTA** | Big "Play" button (primary CTA) to start/continue current level. |
| **Integration** | Uses `profile.activeProfile.progress` for completed levels and current position. Level pack from `levels.classic.v1.json` (or mode-specific). |
| **Nav** | Within AppShell; NavTabs visible. |

**Existing touchpoints:** `useProfile`, `usePersistence`, `ProfileProgress`, level packs in `content/levels.*.v1.json`, `GameStageCard`.

---

### 3.2 `/play` Screen (Rebuild)

**Purpose:** Solve one problem at a time with clear visuals and keypad input.

| Criterion | Detail |
|-----------|--------|
| **Problem card** | Large, prominent card showing `a + b = ?` with visuals (e.g., dots, objects). Uses `question` from `usePlayGame`. |
| **Answer input** | Keypad (0–9, clear, submit) instead of multiple-choice buttons. Replaces `question.choices`-based buttons in `SkinClassic` and other skins. |
| **CTA** | Big "Check" / "Controleer" button to submit answer. |
| **Header** | Playful header (e.g., mascot, level label); not generic "Math Game". |
| **Feedback** | After submit: correct/incorrect feedback; "Next" to continue. No harsh failure state. |
| **No plain white** | Themed surface (underwater tokens); GameStageCard or equivalent. |

**Existing touchpoints:** `play.vue`, `ModeClassic` → `SkinClassic`, `usePlayGame.selectAnswer`, `SkinRoundProps.onAnswer`. Keypad must call `onAnswer(value)` with numeric input.

---

### 3.3 Level Complete Modal (New Component)

**Purpose:** Celebrate completion before moving to next level or back to map.

| Criterion | Detail |
|-----------|--------|
| **Content** | Mascot + star reward + "Next" CTA. |
| **Confetti** | Optional celebratory confetti; **must respect `prefers-reduced-motion`** (no animation or minimal static sparkles). |
| **Next action** | Advances to next level or returns to map. |
| **Placement** | Modal overlay; appears after correct answer on level-complete (pack mode) or after round in infinite mode. |

**Existing touchpoints:** `usePlayGame.nextQuestion`, pack vs infinite flow, `useRoundOutcome.recordRoundOutcome`, `useSound.playCelebrate`.

---

### 3.4 Mistakes / Review Screen (New)

**Purpose:** Friendly recap of wrong answers so the child (and caregiver) can see what was missed, without shame.

| Criterion | Detail |
|-----------|--------|
| **Tone** | Friendly, supportive. "Let's look at these together." |
| **Content** | List of mistakes: problem (e.g., `3 + 5`), child's answer, correct answer, optional visual (dots/number line). |
| **Entry point** | After session with wrong answers: e.g., from level complete modal or end-of-session flow. |
| **CTA** | "Try again" or "Back to map" / "Play again". |
| **Data source** | Session-level mistakes (in-memory during play) or persisted `totalWrong` + last N wrong items. `useRoundOutcome` records outcomes; may need `useMistakes` or session state for itemized review. |

**Existing touchpoints:** `useRoundOutcome`, `PlayFeedback` (correct/selectedAnswer), `useAssistance` (hintToShow). No dedicated mistakes screen today.

---

## 4. Game Design Notes

### 4.1 Level Progression

- **Pack mode:** Levels from `levels.classic.v1.json` (and mode-specific packs). Linear progression: complete level N → unlock N+1.
- **Infinite mode:** No discrete levels; continuous rounds. Map may show "free play" or redirect to pack for map-centric flow.
- **Persistence:** `ProfileProgress` stores `bestScore` (cumulative). For map, we need **per-level completion** (e.g., `completedLevels: number[]` or `levelProgress: Record<number, { stars: number }>`). This is a schema extension.
- **Struggling intervention:** Existing `strugglingRoundsLeft` + pacing engine can serve easier levels. Map can surface "practice" vs "challenge" nodes.

### 4.2 Star System

- **Current:** Skins unlock by `bestScore` threshold. Sticker book = skins.
- **Epic 20 intent:** Stars on map nodes = level completion quality (e.g., 1–3 stars per level). Stars can map to:
  - 1 star: completed (any outcome)
  - 2 stars: completed with no wrong answers
  - 3 stars: completed quickly + no wrong (optional)
- **Reuse:** Star thresholds could feed `bestScore` or a new `starsEarned` aggregate. Sticker unlocks can stay score-based or become star-based.

### 4.3 Mistakes Review Flow

- **When:** After a session with ≥1 wrong answer. Optional: after every wrong (too interruptive) vs end-of-session only.
- **What to show:** Each mistake: `a + b = ?`, child answered X, correct is Y. Optional: `HintDots` or `HintNumberLine` for visual.
- **Data:** `usePlayGame` exposes `feedback` with `selectedAnswer` and `correctAnswer`. A `useMistakes` composable could collect `{ a, b, selectedAnswer, correctAnswer }[]` during a session.
- **Persistence:** Optional: store last N mistakes per profile for "review later" (parent view). MVP: session-only.

### 4.4 Keypad Interaction Model

- **Replaces:** Multiple-choice buttons (`question.choices`) in `SkinClassic` and similar.
- **Behavior:**
  - Child taps digits 0–9 to build answer (e.g., "1" then "2" → 12).
  - "Clear" or backspace to correct.
  - "Check" / "Controleer" submits. Calls `onAnswer(enteredValue)`.
- **Validation:** Only allow submitting when input is non-empty. For `a + b` with sum ≤ 20, max 2 digits.
- **Accessibility:** Keyboard navigable (Tab, Enter, Space); digits focusable; screen reader announces value.
- **Contract change:** `SkinRoundProps.onAnswer(choice: number)` already accepts a number. Keypad passes the constructed number. No API change if we keep `AdditionQuestion`; we drop `choices` display and use free-form input.

---

## 5. Non-Goals

| Non-Goal | Rationale |
|----------|-----------|
| Plain white document pages | Explicitly forbidden. Every screen must be themed. |
| Heavy game engine (Phaser, etc.) | CSS/SVG only. No new runtime dependencies. |
| Host-side Playwright | Playwright must run container-only (`docker compose run --rm e2e`). |
| New operators (subtraction, etc.) | Addition only for Epic 20. |
| Cloud sync / accounts | Local-only persistence. |
| Full adaptive ML | Pacing and hints stay rule-based. |
| Monetization / ads | None. |
| Redesign of all skins | Focus on core flow: map, play, level complete, mistakes. Skins can adopt keypad incrementally. |
| Changing core game logic | `usePlayGame`, `useRoundOutcome`, level generator stay. UI layer changes. |

---

## 6. Success Metrics (Qualitative)

| Metric | How to Assess |
|--------|---------------|
| **Feels like a game** | No screen looks like a form or document. Themed, playful, consistent. |
| **Child can navigate** | Big tap targets, clear CTAs, predictable flow (map → play → complete → map or review). |
| **Accessible** | Keyboard playable, contrast OK, `prefers-reduced-motion` respected. |
| **Keypad is intuitive** | Child can enter answer and press Check without confusion. |
| **Mistakes feel safe** | Review screen is supportive, not punitive. |
| **Map shows progress** | Child (and caregiver) can see completed levels and what's next. |
| **Confetti is optional** | Reduced motion disables or simplifies it. |

---

## Appendix: Codebase Reference

| Area | Path / Symbol |
|------|---------------|
| Pages | `pages/index.vue`, `pages/play.vue`, `pages/stickers.vue`, `pages/summary.vue`, `pages/settings.vue`, `pages/start.vue` |
| Shell | `components/AppShell.vue`, `components/NavTabs.vue`, `components/GameStageCard.vue` |
| Game modes | `components/modes/ModeClassic.vue`, `ModeTimedPop.vue`, `ModeBuildBridge.vue` |
| Skins | `components/skins/SkinClassic.vue`, etc. |
| Composables | `usePlayGame`, `useProfile`, `usePersistence`, `useRewards`, `useRoundOutcome`, `useAssistance`, `useDailyGoal` |
| Profile schema | `utils/profileSchema.ts` — `ProfileProgress`, `ProfileData` |
| Level packs | `content/levels.classic.v1.json`, `levels.timed-pop.v1.json`, `levels.build-bridge.v1.json` |
| Rewards | `utils/rewardsConfig.ts` — `UNLOCK_THRESHOLDS`, `SKIN_ORDER` |
| Hints | `components/hints/HintDots.vue`, `HintNumberLine.vue` |
