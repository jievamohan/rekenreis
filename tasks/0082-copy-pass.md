---
id: "0082"
title: "copy-pass"
owner: "orchestrator"
status: "done"
scope_in:
  - "Friendly microcopy across index, start, play, stickers, summary, settings"
  - "Parent-facing: settings, summary, privacy notes"
  - "Kid-facing: play, stickers, feedback messages"
  - "Keep changes small; align with kid-friendly, parent-friendly voice"
scope_out:
  - "Full copy rewrite"
  - "Localization"
acceptance:
  - "Index/start: welcoming, kid-friendly entry copy"
  - "Summary: parent-friendly labels; export buttons clear"
  - "Settings: clear labels for difficulty, hints, sound"
  - "Privacy note and opt-out wording friendly"
  - "Gates C, D, F pass"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
gates: ["C", "D", "F"]
risks:
  - area: "copy"
    note: "Subjective; keep changes minimal and consistent"
---

## Context

Epic 15: Release Prep. Microcopy should feel friendly and clear for kids and parents.

## Dependencies

None.
