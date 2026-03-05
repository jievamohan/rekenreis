# Epic 21: Architecture

**Role:** Principal Architect  
**Scope:** 6 minigames, minigame map, shuffle-bag serving, difficulty progression, Dutch i18n

---

## 1. Type Definitions

### MinigameId (enum)

```ts
export type MinigameId =
  | 'bubble-pop'
  | 'treasure-dive'
  | 'fish-feed'
  | 'coral-builder'
  | 'submarine-sort'
  | 'starfish-match'
```

### MinigameDefinition

```ts
import type { Component } from 'vue'

export interface MinigameDefinition {
  id: MinigameId
  component: Component
  /** Asset keys required (e.g. sprites, sounds) for preload hints */
  requiredAssets: string[]
  /** Params that scale with difficulty (e.g. timeLimit, bubbleCount) */
  difficultyKnobs: Record<string, number | string>
  /** Fallback label for screen readers when component fails */
  a11yFallback: string
}
```

### MinigameMap Schema

Maps level ranges or level IDs to minigame selection:

```ts
/** Single minigame for a level range */
export interface MinigameMapEntryDirect {
  levelIdMin: number
  levelIdMax: number
  minigameId: MinigameId
}

/** Weighted pool for variety within a chapter */
export interface MinigameMapEntryPool {
  levelIdMin: number
  levelIdMax: number
  pool: Array<{ minigameId: MinigameId; weight: number }>
}

export type MinigameMapEntry = MinigameMapEntryDirect | MinigameMapEntryPool

export interface MinigameMap {
  version: 1
  entries: MinigameMapEntry[]
}
```

### DifficultyProgression

```ts
export interface DifficultyProgression {
  /** Math operand ranges per chapter/level index */
  mathRanges: {
    chapterIndex: number
    operandMin: number
    operandMax: number
    choiceCount: number
  }[]
  /** Minigame-specific params per chapter (e.g. bubble-pop.timeLimit) */
  minigameParams: Record<MinigameId, Record<string, number>>
}
```

---

## 2. Composables

### useMinigame

- **Registry:** Map of `MinigameId` → `MinigameDefinition`
- **Resolution:** Given `levelId` and optional `MinigameMap`, returns `MinigameId` (direct or from weighted pool)
- **Serving:** Delegates to `useMinigameServing` for shuffle-bag / no-repeat logic

### useMinigameServing

- **Shuffle bag:** Fill bag with minigame IDs from pool, draw without replacement until empty, then refill
- **No-repeat window:** Configurable N (e.g. 3) — same minigame cannot appear within last N rounds
- **Seed:** Uses `createSeededRng` for deterministic draws (reproducible sessions)

### useDifficultyProgression

- **Input:** Level index, chapter index (or derived from level pack)
- **Output:** `{ operandMin, operandMax, choiceCount }` for math + minigame-specific params
- **Source:** DifficultyProgression config (JSON or inline)

### useI18n

- **Lookup:** `t(key: string): string` — returns Dutch text from `nl.json`
- **Fallback:** Returns key if missing (dev visibility)
- **Scope:** Single source of truth for all UI copy

---

## 3. Content File Structure

### minigame-map.v1.json

```json
{
  "version": 1,
  "entries": [
    { "levelIdMin": 0, "levelIdMax": 4, "minigameId": "bubble-pop" },
    {
      "levelIdMin": 5,
      "levelIdMax": 14,
      "pool": [
        { "minigameId": "treasure-dive", "weight": 2 },
        { "minigameId": "fish-feed", "weight": 1 }
      ]
    }
  ]
}
```

---

## 4. Integration Points

- **usePlayGame** continues to own the core loop: question generation, answer handling, score, feedback
- **usePlayGame** (or a thin wrapper) calls `useMinigameServing.pick(levelId, seed)` to obtain `MinigameId` for the current round
- The play screen renders **MinigameRenderer** with:
  - `question` (from usePlayGame)
  - `minigameId` (from useMinigameServing)
  - `onAnswer` callback (wired to usePlayGame.selectAnswer)
- Minigames receive **question + onAnswer** only — no own math logic; they are pure interaction patterns

---

## 5. Component Architecture

### MinigameRenderer.vue

- Dynamic component loader: resolves `MinigameId` → component via `useMinigame`
- Lazy-loads minigame components via `defineAsyncComponent`
- Props: `question`, `minigameId`, `onAnswer`, `difficultyParams`
- Handles loading/error states and a11y fallback

### 6 Minigame Components

- `MinigameBubblePop.vue`, `MinigameTreasureDive.vue`, `MinigameFishFeed.vue`, `MinigameCoralBuilder.vue`, `MinigameSubmarineSort.vue`, `MinigameStarfishMatch.vue`
- Each: receives `question: AdditionQuestion`, `onAnswer: (choice: number) => void`, optional `params` from difficulty
- Emit answer via `onAnswer`; no question generation or validation

---

## 6. Core Loop Reuse

Minigames are **interaction patterns only**:

1. Parent (usePlayGame) generates question via `generateQuestionFromLevel` / `generateAdditionQuestion`
2. Parent passes `question` and `onAnswer` to MinigameRenderer
3. Minigame renders choices (or equivalent interaction) and calls `onAnswer(choice)` on user action
4. Parent validates (choice === question.correctAnswer) and updates score/feedback
5. Parent calls `nextQuestion()` and picks next minigame for the next round

---

## 7. i18n Architecture

- **Source of truth:** `apps/web/content/locales/nl.json` (flat key-value)
- **Composable:** `useI18n()` → `{ t(key: string): string }`
- **Loading:** Static import at build time (no runtime fetch)
- **ESLint rule:** `no-hardcoded-ui-strings` — flag literal strings in templates/components that should use `t()`
- **Scope:** Dutch only for Epic 21; structure allows future locales
