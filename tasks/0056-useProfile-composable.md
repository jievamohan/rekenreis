---
id: "0056"
title: "useProfile-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create apps/web/composables/useProfile.ts"
  - "activeProfile: computed from schema"
  - "switchProfile(id), createProfile(name, avatarId)"
  - "Reactive: changes to profile data trigger updates"
scope_out:
  - "UI, play integration"
acceptance:
  - "useProfile returns activeProfile, switchProfile, createProfile"
  - "switchProfile updates activeProfileId and persisted schema"
  - "createProfile adds profile and optionally switches"
  - "Unit tests"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useProfile.ts", "apps/web/test/useProfile.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 10 Task 2. Composable for profile management.
