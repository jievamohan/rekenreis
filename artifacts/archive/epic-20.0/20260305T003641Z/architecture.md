# Epic 20 — Architecture

> Planning document. No code changes.
> Principal Architect + Solution Designer perspective.

---

## 1. New Routes

| Route | Purpose | Existing? |
|-------|---------|------------|
| `/` | Home | Yes |
| `/start` | Connection check | Yes |
| `/map` | **NEW** — Level map hub, node selection, Play CTA | No |
| `/play` | Game play (redesigned) | Yes (modify) |
| `/stickers` | Sticker book | Yes |
| `/summary` | Progress summary | Yes |
| `/settings` | Settings | Yes |
| `/mistakes` or `/review` | **NEW** — Mistakes recap (optional route) | No |

**Routing decisions:**
- `/map` — New page. Add `pages/map.vue`. NavTabs should include Map (or replace "Play" with "Map" as primary hub).
- `/play` — Keep. May accept query params: `?level=N&mode=classic` for pack mode entry from map.
- Mistakes review — Can be a **route** (`/mistakes`) or a **modal** shown after level complete when session had wrong answers. Recommendation: modal first (simpler flow); add `/mistakes` route if "review later" is needed.

---

## 2. State Flow

### 2.1 Map → Play

```
/map
  ├── User sees nodes (completed = star, current = highlighted, locked = lock)
  ├── User clicks "Play" (or taps current node)
  └── Navigate to /play?source=pack&level=N&mode=classic
        └── play.vue reads level from query, loads levelPack, starts at index N-1
```

**Data:** `level` = 1-based level index. `usePlayGame` uses `packIndex` (0-based). Map passes `level - 1` or play page derives from `level` query.

### 2.2 Play → Level Complete Modal

```
/play (pack mode)
  ├── User answers correctly on last problem of level
  ├── game.feedback.correct === true AND packIndex % levelPack.length === last problem
  └── Show LevelCompleteModal
        ├── sound.playCelebrate()
        ├── User clicks "Next"
        └── Either: next level (packIndex++) or back to /map
```

**Trigger logic:** Level complete = correct answer AND (pack mode AND completed all problems in current "level" segment). For linear pack, "level" = one problem per level in MVP, or N problems per level if we group. Discovery says "complete level N → unlock N+1" — so one level = one problem for simplest implementation.

### 2.3 Play → Mistakes Review

```
/play
  ├── Session has ≥1 wrong answer (track in session state)
  ├── Level complete modal OR end-of-session
  └── Show MistakesReviewModal (or navigate to /mistakes)
        └── Display list: { a, b, selectedAnswer, correctAnswer }[]
```

**Data source:** New `useMistakes` composable or session ref in play page that collects `PlayFeedback` with `correct: false` and `selectedAnswer`. Each item: `{ a, b, correctAnswer, selectedAnswer }` from `question` + `feedback`.

### 2.4 Level Progress Persistence

- **Current:** `ProfileProgress.bestScore` (cumulative), `totalRounds`, `totalCorrect`, `totalWrong`, `totalTimeout`, `modeCounts`.
- **New (Epic 20):** Per-level completion for map. Extend `ProfileProgress`:
  - `levelProgress?: Record<number, { stars: number }>` — level index → stars (1–3)
  - Or `completedLevels?: number[]` — list of completed level indices
  - Or `currentLevel?: number` — highest unlocked level

**Recommendation:** `levelProgress: Record<number, { stars: number }>` for flexibility. `completedLevels: number[]` as minimal alternative.

---

## 3. Component Architecture

### 3.1 New Components

| Component | Path | Purpose |
|-----------|------|---------|
| `MapPage` | `pages/map.vue` | Map route; contains MapPath, MapNodes, etc. |
| `MapPath` | `components/map/MapPath.vue` | SVG winding path |
| `MapNode` | `components/map/MapNode.vue` | Single level node (circle, star/lock, number) |
| `MapAvatar` | `components/map/MapAvatar.vue` | Avatar bubble at current node |
| `Keypad` | `components/play/Keypad.vue` | 0–9, clear, submit keys |
| `ProblemCard` | `components/play/ProblemCard.vue` | Large `a + b = ?` card |
| `LevelCompleteModal` | `components/modals/LevelCompleteModal.vue` | Mascot + stars + confetti + Next |
| `MistakesReviewModal` or `MistakesReviewScreen` | `components/review/MistakesReviewModal.vue` | List of wrong answers |
| `Confetti` | `components/effects/Confetti.vue` | CSS-only confetti particles |

### 3.2 Modified Components

| Component | Changes |
|-----------|---------|
| `play.vue` | Integrate Keypad, ProblemCard; show LevelCompleteModal, MistakesReviewModal; handle `?level=` query |
| `SkinClassic.vue` (or new PlaySkin) | Replace choices with Keypad; use ProblemCard layout |
| `AppShell` / `NavTabs` | Add Map tab or adjust nav for map-centric flow |
| `GameStageCard` | May wrap ProblemCard; or ProblemCard replaces it in play |

### 3.3 Component Hierarchy (Map)

```
pages/map.vue
  └── AppShell
        └── NavTabs
  └── MapPath (SVG)
  └── MapNodes (v-for over levels)
        └── MapNode (per level)
  └── MapAvatar (positioned at current)
  └── PrimaryButton "Play"
```

### 3.4 Component Hierarchy (Play)

```
pages/play.vue
  └── PlayModeSelector (existing)
  └── skin-picker (existing)
  └── StatPill (existing)
  └── #game-main
        └── ModeClassic (or new PlayLayout)
              └── ProblemCard (question)
              └── Keypad (onAnswer)
              └── Feedback area (correct/wrong + Next)
  └── LevelCompleteModal (v-if showLevelComplete)
  └── MistakesReviewModal (v-if showMistakesReview)
```

---

## 4. Data Model Changes

### 4.1 ProfileProgress Extension

```ts
// utils/profileSchema.ts — extend ProfileProgress
levelProgress?: Record<number, { stars: number }>  // level index (1-based) → stars
currentLevel?: number  // highest unlocked (1-based)
```

**Migration:** Existing profiles get `currentLevel: 1`, `levelProgress: {}`. When user completes level N with stars S, set `levelProgress[N] = { stars: S }` and `currentLevel = Math.max(currentLevel, N + 1)`.

### 4.2 Star Tracking

- 1 star: completed (any outcome)
- 2 stars: completed with no wrong answers in that level
- 3 stars: (optional) completed quickly + no wrong

**Storage:** `levelProgress[levelIndex] = { stars }`. Compute from session: level had wrong → max 1 star; no wrong → 2 stars.

### 4.3 Session Mistakes

In-memory during play:

```ts
interface MistakeItem {
  a: number
  b: number
  correctAnswer: number
  selectedAnswer: number
}
// ref<MistakeItem[]> in play page or useMistakes()
```

---

## 5. Integration with Existing Systems

| System | Integration |
|--------|-------------|
| **usePlayGame** | Keep. Add support for starting at specific pack index when `?level=N`. `selectAnswer` receives number from Keypad. |
| **usePersistence** | Extend for `levelProgress`, `currentLevel`. New `useLevelProgress(profile)` composable. |
| **useRewards** | Unchanged. Skins still unlock by `bestScore`. Stars can feed future sticker/theme unlocks. |
| **useProfile** | `updateProfile` used to persist `levelProgress`, `currentLevel`. |
| **useRoundOutcome** | Keep. Records correct/wrong/timeout per round. |
| **useSound** | Add `playCelebrate()` call when LevelCompleteModal opens. |
| **useDailyGoal** | Unchanged. |
| **useAssistance** | Unchanged. Hints still shown in feedback area. |

---

## 6. Asset Pipeline

### 6.1 New SVGs Needed

| Asset | Path | Purpose |
|-------|------|---------|
| Mascot | `assets/graphics/characters/mascot.svg` | Replace placeholder; level complete, mistakes |
| Star (filled) | `assets/graphics/icons/star.svg` | Completed nodes, level complete |
| Lock | `assets/graphics/icons/lock.svg` | Locked nodes |
| Map path | `assets/graphics/map/path.svg` or inline in MapPath | Winding path |
| Sparkle (reduced motion) | `assets/graphics/icons/sparkle.svg` | Static confetti alternative |

### 6.2 Organization

- `assets/graphics/characters/` — mascot
- `assets/graphics/icons/` — star, lock, sparkle
- `assets/graphics/map/` — path, node decorations if any

### 6.3 Inline vs. Import

- Small icons (star, lock): inline SVG in components for fewer requests.
- Mascot, path: can be `img` or inline; inline preferred for theming via CSS.

---

## 7. Performance Constraints

### 7.1 Bundle Budget

- **Baseline (from tasks):** `.output < 3MB`, client JS < 250KB.
- **Current:** ~2.18 MB total, ~175 KB main client chunk (from CI logs).
- **Epic 20 impact:** New components (map, keypad, modals, confetti) add ~15–25 KB estimated. Lazy-load map page: `definePageMeta({ layout: 'default' })`; Nuxt already code-splits by route.

### 7.2 Lazy Loading Strategy

- Map page: Route-level split (automatic with Nuxt).
- LevelCompleteModal, MistakesReviewModal: Import async if large; or keep sync (small).
- Confetti: Keep in modal; 24–32 divs + CSS is negligible.
- Level packs: Already imported in play.vue; consider dynamic import for map if we load different packs per mode.

### 7.3 Avoid

- No new heavy deps (canvas libs, animation libs).
- No synchronous large JSON in critical path; level packs are small (~27 levels).

---

*End of Architecture*
