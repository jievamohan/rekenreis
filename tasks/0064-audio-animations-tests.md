---
id: "0064"
title: "audio-animations-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests for useSound: mock Audio; verify playCorrect/playWrong/playCelebrate when soundOn"
  - "Unit tests for useSound: no play when soundOn false"
  - "Unit tests for soundOn persistence (profileSchema or settings flow)"
  - "Tests for reduced-motion: document or test CSS/media behavior"
scope_out:
  - "E2E (optional)"
acceptance:
  - "useSound tests pass"
  - "Settings persistence test for soundOn"
  - "Typecheck passes"
lanes:
  - name: "T"
    files:
      - "apps/web/test/useSound.test.ts"
      - "apps/web/test/profileSchema.test.ts"
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 11 Task 5. Tests for sound and animations.
