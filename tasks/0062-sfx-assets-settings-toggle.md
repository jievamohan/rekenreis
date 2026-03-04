---
id: "0062"
title: "sfx-assets-settings-toggle"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add public/sfx/ with correct.mp3, wrong.mp3, celebrate.mp3 (tiny placeholder or minimal SFX)"
  - "useSound loads from /sfx/correct.mp3 etc. (lazy)"
  - "settings.vue: add Sound effects checkbox bound to profile prefs.soundOn"
  - "Wire useSound to play.vue feedback (watch feedback, call playCorrect/playWrong)"
  - "Wire playCelebrate on reward unlock (useRewards or play flow)"
scope_out:
  - "Feedback animations"
acceptance:
  - "SFX files exist and are served"
  - "Settings toggle persists soundOn per profile"
  - "Feedback triggers correct/wrong SFX"
  - "Celebrate plays on reward unlock"
  - "Typecheck passes"
lanes:
  - name: "I"
    files: ["apps/web/public/sfx/"]
  - name: "W1"
    files: ["apps/web/pages/settings.vue", "apps/web/pages/play.vue"]
  - name: "W2"
    files: ["apps/web/composables/useRewards.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 11 Task 3. SFX assets, settings toggle, and play integration.
