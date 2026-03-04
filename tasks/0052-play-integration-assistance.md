---
id: "0052"
title: "play-integration-assistance"
owner: "orchestrator"
status: "done"
scope_in:
  - "play.vue: instantiate useAssistance with game.feedback, game.question"
  - "Extend skinProps with hintToShow, hintQuestion (a,b,correctAnswer for hint components)"
  - "Skin components: when hintToShow, render HintDots or HintNumberLine in feedback area"
  - "Default hint type: 'dots' when level.hintMode unspecified"
scope_out:
  - "Pacing intervention, E2E"
acceptance:
  - "After 2 wrong, hint appears in feedback area"
  - "SkinClassic and at least one other skin show hint"
  - "Next clears hint and loads new question"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue", "apps/web/components/skins/SkinClassic.vue"]
  - name: "W2"
    files: ["apps/web/composables/useAssistance.ts", "apps/web/types/skin.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 9 Task 3. Wire assistance and hint components into play flow.
