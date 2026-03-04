---
id: "0055"
title: "profile-schema"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create apps/web/utils/profileSchema.ts"
  - "ProfileSchemaV1: profiles[], activeProfileId, per-profile progress/prefs/telemetryOptOut"
  - "Load/save to localStorage key rekenreis_profiles_v1"
  - "Migration: if no profiles, create default from legacy rekenreis_progress, last_mode, last_skin, telemetry"
  - "Keep persistenceSchema for progress shape; profile embeds it"
scope_out:
  - "UI, composables, parent gate"
acceptance:
  - "profileSchema loads/saves valid data"
  - "Migration creates default profile from legacy data"
  - "Invalid/missing data falls back to default profile"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/profileSchema.ts", "apps/web/test/profileSchema.test.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "data-loss"
    note: "Migration must preserve legacy data"
---

## Context

Epic 10 Task 1. Profile storage schema and migration from single-user.
