---
id: "0061"
title: "useSound-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create useSound(profile?) composable"
  - "playCorrect(), playWrong(), playCelebrate() methods"
  - "Read soundOn from profile.activeProfile.value?.prefs?.soundOn ?? true"
  - "Lazy-load Audio objects on first play; cache in module"
  - "Try/catch around play(); never throw; never block gameplay"
scope_out:
  - "SFX asset files, play.vue integration"
acceptance:
  - "useSound plays correct SFX when soundOn is true"
  - "useSound no-op when soundOn is false"
  - "Audio failure does not throw; game continues"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useSound.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 11 Task 2. Sound composable with lazy-load and fail-safe.
