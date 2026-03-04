---
id: "0060"
title: "sound-prefs-schema"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add soundOn: boolean to ProfilePrefs in profileSchema.ts (default true)"
  - "Update defaultPrefs() and migration to include soundOn"
  - "Ensure new profiles and migrated profiles get soundOn: true"
scope_out:
  - "Settings UI, useSound, SFX assets"
acceptance:
  - "ProfilePrefs includes soundOn"
  - "Migration preserves soundOn for new profiles"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/profileSchema.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 11 Task 1. Add sound preference to profile schema.
