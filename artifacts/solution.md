# Epic 7 — Solution

## 1. Extend Mode Contract

- `InteractionModeId`: add `'build-bridge'`
- `modeResolver.ts`: include build-bridge in INTERACTION_IDS
- `useMode.ts`: register ModeBuildBridge component

## 2. Mode Selector UI

- New component: `ModeSelector.vue` (or `PlayModeSelector.vue`)
  - Big buttons: Classic, Timed Pop, Build Bridge (with simple icons or emoji)
  - Optional skin picker inline or reuse existing skin-picker
  - On select: write to localStorage (lastMode, lastSkin), update route query, close
- Integration: play.vue
  - "Choose game" / "Change mode" button opens selector (v-if showSelector)
  - On mount: if no route.query.mode and no localStorage, consider showing selector; else use stored or default
  - Sync: when mode/skin changes (user or selector), update route + localStorage

## 3. Build-Bridge Mode

- `ModeBuildBridge.vue`:
  - Layout: question text, bridge graphic (simple SVG/CSS), planks as draggable elements
  - VueUse `useDrag` or native HTML5 drag API; keyboard: focus plank → click slot to "place"
  - On drop/place: if correct → onAnswer(correctAnswer), then show feedback; if wrong → onAnswer(wrong), show hint
  - Feedback: reuse PlayFeedback; gentle hint on wrong ("Try another!")
  - No timer; no recordTimeout

## 4. Persistence

- Keys: `rekenreis_last_mode`, `rekenreis_last_skin`
- Read on /play load; write when user selects in selector
- Fallback: classic, first unlocked skin

## 5. Tests

- Unit: modeResolver includes build-bridge
- Unit: Mode selector writes/reads localStorage
- Unit: ModeBuildBridge — deterministic with fake events (simulate place correct/wrong)
- E2E: smoke — navigate to build-bridge, complete one round
