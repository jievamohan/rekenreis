# Epic 2: Skin System + 1 Skin — Architecture

## Boundaries

- **Web (apps/web)**: Skin system, skin components, play page
- **API**: No change
- **Core loop**: usePlayGame stays in composables/; skins only receive data + callbacks

## Data flow

```
play.vue
  ├─ usePlayGame(mode, options)  ← core loop (single source of truth)
  │   └─ question, score, streak, feedback, selectAnswer, nextQuestion
  ├─ skin = useSkin(route.query.skin)  ← resolves skin id → component
  └─ <component :is="skin.component" v-bind="skinProps" />
        └─ skin receives: question, feedback, score, streak, onAnswer, onNext
```

## Skin contract (TS)

```ts
// types/skin.ts
export interface SkinRoundProps {
  question: AdditionQuestion | null
  feedback: PlayFeedback | null
  score: number
  streak: number
  onAnswer: (choice: number) => void
  onNext: () => void
}

export interface SkinDefinition {
  id: string
  component: Component
}
```

## File layout

- `apps/web/types/skin.ts` — contract types
- `apps/web/composables/useSkin.ts` — resolve skin id → component
- `apps/web/components/skins/SkinClassic.vue` — default skin
- `apps/web/components/skins/SkinMonsterFeed.vue` — Monster Feed skin
- `apps/web/pages/play.vue` — wires usePlayGame + skin, renders dynamic component

## Integration

- play.vue stays orchestrator; no logic moves into skins
- Skins are pure presentational; callbacks drive state
