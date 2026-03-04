---
id: "0059"
title: "play-integration-profiles"
owner: "orchestrator"
status: "done"
scope_in:
  - "play.vue: use useProfile; show ProfileSelector when no profile or on entry"
  - "usePlayPreferences, usePersistence, useTelemetry: read/write from active profile"
  - "Settings page: difficulty ceiling, hints on/off; behind ParentGate"
  - "Per-profile: bestScore, lastMode, lastSkin, difficultyCeiling, hintsOn, telemetryOptOut"
scope_out:
  - "Manual QA"
acceptance:
  - "Play uses active profile data"
  - "Switching profile changes progress/prefs context"
  - "Settings page behind gate; difficulty/hints per profile"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue", "apps/web/pages/settings.vue"]
  - name: "W2"
    files: ["apps/web/composables/usePlayPreferences.ts", "apps/web/composables/usePersistence.ts", "apps/web/composables/useProfile.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 10 Task 5. Wire profiles into play and add settings page.
