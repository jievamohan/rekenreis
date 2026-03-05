# Epic 21.3 — Plan

**Branch:** feat/epic-21.3-bubble-pop-treasure-dive  
**Source:** docs/design/epic-21.md

## Scope

Implement the first two playable minigames:

- **Bubble Pop** — tap interaction; floating bubbles with numbers; tap correct answer
- **Treasure Dive** — drag interaction; gems with numbers; drag correct gem to chest

Both receive `AdditionQuestion` + `onAnswer` from the core loop. Register in `useMinigame`, wire into `play.vue` via `MinigameRenderer`.

## Out of Scope

- Fish Feed, Coral Builder, Submarine Sort, Starfish Match
- Backend changes, new APIs
- Full asset production (placeholders only)

## Gates

- C: Typecheck clean
- D: Security baseline (gitleaks, semgrep, audits)
- F: Bundle budget passes
